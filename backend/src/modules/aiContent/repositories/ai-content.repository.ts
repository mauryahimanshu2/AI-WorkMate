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

export interface HistoryFilters {
  page: number;
  limit: number;
  contentType?: string;
  status?: 'pending' | 'completed' | 'failed';
  search?: string;
}

interface UpdateGenerationData {
  title?: string;
  generatedContent?: string;
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

export const findUserHistory = async (
  userId: string,
  filters: HistoryFilters,
) => {
  const query: Record<string, unknown> = { userId };

  if (filters.contentType) {
    query.contentType = filters.contentType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    const safeSearch = escapeRegExp(filters.search);
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { 'input.topic': { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const [history, totalRecords] = await Promise.all([
    ContentGeneration.find(query)
      .select(
        'title contentType status provider model usage createdAt updatedAt',
      )
      .sort({ createdAt: -1 })
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .lean(),
    ContentGeneration.countDocuments(query),
  ]);

  return { history, totalRecords };
};

export const findUserGenerationById = async (
  userId: string,
  generationId: string,
) => ContentGeneration.findOne({ _id: generationId, userId });

export const updateUserGeneration = async (
  userId: string,
  generationId: string,
  data: UpdateGenerationData,
) => {
  const generation = await findUserGenerationById(userId, generationId);

  if (!generation) {
    return null;
  }

  if (
    data.generatedContent !== undefined &&
    data.generatedContent !== generation.generatedContent
  ) {
    generation.revisions.push({
      version: generation.revisions.length + 1,
      content: generation.generatedContent,
      createdAt: generation.updatedAt,
    });
    generation.generatedContent = data.generatedContent;
  }

  if (data.title !== undefined) {
    generation.title = data.title;
  }

  await generation.save();
  return generation;
};

export const deleteUserGeneration = async (
  userId: string,
  generationId: string,
) => ContentGeneration.findOneAndDelete({ _id: generationId, userId });

export type ContentGenerationDocument = IContentGeneration;
