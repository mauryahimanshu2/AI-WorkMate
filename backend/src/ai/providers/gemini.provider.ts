import { GoogleGenAI } from '@google/genai';

import type {
  AIProvider,
  AIProviderResult,
  GenerateContentOptions,
} from '../interfaces/ai-provider.interface.js';
import {
  AIProviderError,
  AIProviderTimeoutError,
} from '../../modules/aiContent/utils/ai-content.errors.js';

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateContent(
    prompt: string,
    options: GenerateContentOptions,
  ): Promise<AIProviderResult> {
    const configuredAttempts = Number(process.env.AI_RETRY_ATTEMPTS) || 3;
    const maximumAttempts = Math.min(Math.max(configuredAttempts, 1), 5);

    for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
      try {
        const response = await this.client.models.generateContent({
          model: this.model,
          contents: prompt,
          config: {
            systemInstruction: options.systemInstruction,
            temperature: options.temperature,
            maxOutputTokens: options.maxTokens,
            httpOptions: {
              timeout: options.timeoutMs,
            },
          },
        });

        const content = response.text?.trim();

        if (!content) {
          console.error('Gemini returned an empty response', {
            finishReason: response.candidates?.[0]?.finishReason,
            blockReason: response.promptFeedback?.blockReason,
            promptTokens: response.usageMetadata?.promptTokenCount,
            outputTokens: response.usageMetadata?.candidatesTokenCount,
            totalTokens: response.usageMetadata?.totalTokenCount,
          });

          if (attempt < maximumAttempts) {
            const retryDelay = 500 * 2 ** (attempt - 1);
            console.warn(
              `Gemini returned no content on attempt ${attempt}; retrying`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }

          throw new AIProviderError('The AI provider returned an empty response');
        }

        const inputTokens = response.usageMetadata?.promptTokenCount ?? 0;
        const outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;
        const totalTokens =
          response.usageMetadata?.totalTokenCount ?? inputTokens + outputTokens;

        return {
          content,
          inputTokens,
          outputTokens,
          totalTokens,
          model: this.model,
          provider: 'gemini',
        };
      } catch (error) {
        if (error instanceof AIProviderError) {
          throw error;
        }

        const errorName = error instanceof Error ? error.name.toLowerCase() : '';
        const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
        const status =
          typeof error === 'object' && error !== null && 'status' in error
            ? Number(error.status)
            : undefined;

        if (errorName.includes('timeout') || errorName.includes('abort')) {
          throw new AIProviderTimeoutError();
        }

        const isRetryable =
          status === 429 ||
          (status !== undefined && status >= 500) ||
          errorMessage.includes('fetch failed') ||
          errorMessage.includes('high demand') ||
          errorMessage.includes('unavailable');

        if (isRetryable && attempt < maximumAttempts) {
          const retryDelay = 500 * 2 ** (attempt - 1);
          console.warn(
            `Gemini request attempt ${attempt} failed (${status ?? 'network'}); retrying`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        console.error(
          `Gemini request failed after ${attempt} attempt(s) with status ${status ?? 'unknown'}`,
        );
        throw new AIProviderError();
      }
    }

    throw new AIProviderError();
  }
}
