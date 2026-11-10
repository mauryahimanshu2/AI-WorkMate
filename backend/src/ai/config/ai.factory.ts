import type { AIProvider } from '../interfaces/ai-provider.interface.js';
import { GeminiProvider } from '../providers/gemini.provider.js';
import { AIConfigurationError } from '../../modules/aiContent/utils/ai-content.errors.js';

const getRequiredEnvironmentValue = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new AIConfigurationError(`${name} is not configured`);
  }

  return value;
};

export const createAIProvider = (): AIProvider => {
  const providerName = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (providerName === 'gemini') {
    return new GeminiProvider(
      getRequiredEnvironmentValue('GEMINI_API_KEY'),
      getRequiredEnvironmentValue('AI_MODEL'),
    );
  }

  throw new AIConfigurationError(
    `Unsupported AI provider: ${providerName}`,
  );
};
