import type { Request, Response } from 'express';

import {
  CONTENT_TYPES,
  LANGUAGES,
  SOCIAL_PLATFORMS,
  TONES,
} from '../config/content-options.js';
import { generateContent as generateContentService } from '../services/generation.service.js';
import {
  AIConfigurationError,
  AIProviderError,
  AIProviderTimeoutError,
  DuplicateGenerationError,
} from '../utils/ai-content.errors.js';
import { generateContentSchema } from '../validators/generate-content.validator.js';

export const getContentTypes = (_request: Request, response: Response): void => {
  response.status(200).json({
    success: true,
    message: 'Content types retrieved successfully',
    data: { contentTypes: CONTENT_TYPES },
  });
};

export const getOptions = (_request: Request, response: Response): void => {
  response.status(200).json({
    success: true,
    message: 'Content options retrieved successfully',
    data: {
      tones: TONES,
      languages: LANGUAGES,
      socialPlatforms: SOCIAL_PLATFORMS,
      wordCount: { minimum: 50, maximum: 5000 },
      maximumKeywords: 15,
    },
  });
};

export const generateContent = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const validationResult = generateContentSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(422).json({
      success: false,
      message: 'Please correct the invalid content fields',
      errors: validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (!request.auth) {
    response.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const requestKey = request.get('Idempotency-Key')?.trim();

  if (requestKey && !/^[A-Za-z0-9_-]{8,128}$/.test(requestKey)) {
    response.status(400).json({
      success: false,
      message:
        'Idempotency-Key must contain 8-128 letters, numbers, underscores, or hyphens',
    });
    return;
  }

  try {
    const result = await generateContentService({
      userId: request.auth.userId,
      input: validationResult.data,
      requestKey,
    });
    const generation = result.generation.toJSON();

    response.status(result.reused ? 200 : 201).json({
      success: true,
      message: result.reused
        ? 'Existing generation retrieved successfully'
        : 'Content generated successfully',
      data: {
        id: generation._id,
        title: generation.title,
        contentType: generation.contentType,
        generatedContent: generation.generatedContent,
        status: generation.status,
        provider: generation.provider,
        model: generation.model,
        usage: {
          ...generation.usage,
          totalTokens:
            generation.usage.inputTokens + generation.usage.outputTokens,
        },
        createdAt: generation.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof AIConfigurationError) {
      response.status(503).json({
        success: false,
        message: 'AI content generation is not configured',
      });
      return;
    }

    if (error instanceof AIProviderTimeoutError) {
      response.status(504).json({
        success: false,
        message: 'The AI provider took too long to respond',
      });
      return;
    }

    if (error instanceof AIProviderError) {
      response.status(502).json({
        success: false,
        message: 'The AI provider could not generate content',
      });
      return;
    }

    if (error instanceof DuplicateGenerationError) {
      response.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error('Content generation failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to generate content',
    });
  }
};
