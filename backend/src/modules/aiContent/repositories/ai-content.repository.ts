import { AIUsageLog, type IAIUsageLog } from '../models/ai-usage-log.model.js';
import {
  ContentGeneration,
  type IContentGeneration,
} from '../models/content-generation.model.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

interface CompleteGenerationData {
  content: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export const findGenerationByRequestKey = async (
  userId: string,
  requestKey: string,
) => ContentGeneration.findOne({ userId, requestKey });

export const createPendingGeneration = async (
  userId: string,
  input: GenerateContentInput,
  requestKey?: string,
) =>
  ContentGeneration.create({
    userId,
    title: input.topic,
    contentType: input.contentType,
    requestKey,
    input,
    generatedContent: '',
    status: 'pending',
    usage: {
      inputTokens: 0,
      outputTokens: 0,
      estimatedCost: 0,
    },
  });

export const completeGeneration = async (
  generationId: string,
  data: CompleteGenerationData,
) =>
  ContentGeneration.findByIdAndUpdate(
    generationId,
    {
      $set: {
        generatedContent: data.content,
        status: 'completed',
        provider: data.provider,
        model: data.model,
        usage: {
          inputTokens: data.inputTokens,
          outputTokens: data.outputTokens,
          estimatedCost: data.estimatedCost,
        },
      },
    },
    { new: true, runValidators: true },
  );

export const failGeneration = async (
  generationId: string,
  provider: string,
  model: string,
) =>
  ContentGeneration.findByIdAndUpdate(generationId, {
    $set: {
      status: 'failed',
      provider,
      model,
    },
  });

export const createUsageLog = async (
  data: Omit<IAIUsageLog, 'createdAt'>,
) => AIUsageLog.create(data);

export type ContentGenerationDocument = IContentGeneration;
