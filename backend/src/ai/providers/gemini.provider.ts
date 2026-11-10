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

      if (errorName.includes('timeout') || errorName.includes('abort')) {
        throw new AIProviderTimeoutError();
      }

      throw new AIProviderError();
    }
  }
}
