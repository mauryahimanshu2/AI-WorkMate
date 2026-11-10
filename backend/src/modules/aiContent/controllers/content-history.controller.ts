import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  deleteUserGeneration,
  findUserGenerationById,
  findUserHistory,
  updateUserGeneration,
} from '../repositories/ai-content.repository.js';
import {
  historyQuerySchema,
  updateContentSchema,
} from '../validators/content-history.validator.js';

const getRouteParameter = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

const getAuthenticatedUserId = (
  request: Request,
  response: Response,
): string | undefined => {
  if (!request.auth) {
    response.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return undefined;
  }

  return request.auth.userId;
};

const getValidGenerationId = (
  request: Request,
  response: Response,
): string | undefined => {
  const generationId = getRouteParameter(request.params.generationId);

  if (!generationId || !mongoose.isValidObjectId(generationId)) {
    response.status(400).json({
      success: false,
      message: 'Invalid content ID',
    });
    return undefined;
  }

  return generationId;
};

const formatValidationErrors = (
  issues: Array<{ path: PropertyKey[]; message: string }>,
) =>
  issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

export const getContentHistory = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const userId = getAuthenticatedUserId(request, response);

  if (!userId) return;

  const validationResult = historyQuerySchema.safeParse(request.query);

  if (!validationResult.success) {
    response.status(422).json({
      success: false,
      message: 'Please correct the invalid history filters',
      errors: formatValidationErrors(validationResult.error.issues),
    });
    return;
  }

  try {
    const filters = validationResult.data;
    const { history, totalRecords } = await findUserHistory(userId, filters);

    response.status(200).json({
      success: true,
      message: 'Content history retrieved successfully',
      data: {
        history,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          totalRecords,
          totalPages: Math.ceil(totalRecords / filters.limit),
        },
      },
    });
  } catch (error) {
    console.error('Get content history failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve content history',
    });
  }
};

export const getContentById = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const userId = getAuthenticatedUserId(request, response);
  const generationId = getValidGenerationId(request, response);

  if (!userId || !generationId) return;

  try {
    const generation = await findUserGenerationById(userId, generationId);

    if (!generation) {
      response.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Content retrieved successfully',
      data: { generation },
    });
  } catch (error) {
    console.error('Get content failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve content',
    });
  }
};

export const updateContent = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const userId = getAuthenticatedUserId(request, response);
  const generationId = getValidGenerationId(request, response);

  if (!userId || !generationId) return;

  const validationResult = updateContentSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(422).json({
      success: false,
      message: 'Please correct the invalid content fields',
      errors: formatValidationErrors(validationResult.error.issues),
    });
    return;
  }

  try {
    const existingGeneration = await findUserGenerationById(
      userId,
      generationId,
    );

    if (!existingGeneration) {
      response.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    if (existingGeneration.status !== 'completed') {
      response.status(409).json({
        success: false,
        message: 'Only completed content can be edited',
      });
      return;
    }

    const generation = await updateUserGeneration(
      userId,
      generationId,
      validationResult.data,
    );

    if (!generation) {
      response.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: { generation },
    });
  } catch (error) {
    console.error('Update content failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to update content',
    });
  }
};

export const getContentRevisions = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const userId = getAuthenticatedUserId(request, response);
  const generationId = getValidGenerationId(request, response);

  if (!userId || !generationId) return;

  try {
    const generation = await findUserGenerationById(userId, generationId);

    if (!generation) {
      response.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    const currentVersion = generation.revisions.length + 1;

    response.status(200).json({
      success: true,
      message: 'Content revisions retrieved successfully',
      data: {
        revisions: generation.revisions,
        current: {
          version: currentVersion,
          content: generation.generatedContent,
          createdAt: generation.updatedAt,
        },
        totalVersions: currentVersion,
      },
    });
  } catch (error) {
    console.error('Get content revisions failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve content revisions',
    });
  }
};

export const deleteContent = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const userId = getAuthenticatedUserId(request, response);
  const generationId = getValidGenerationId(request, response);

  if (!userId || !generationId) return;

  try {
    const generation = await deleteUserGeneration(userId, generationId);

    if (!generation) {
      response.status(404).json({
        success: false,
        message: 'Content not found',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to delete content',
    });
  }
};
