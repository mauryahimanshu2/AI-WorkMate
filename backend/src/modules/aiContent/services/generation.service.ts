import { createAIProvider } from '../../../ai/config/ai.factory.js';
import { SYSTEM_PROMPT } from '../prompts/system.prompt.js';
import { buildGenerationPrompt } from '../prompts/prompt.factory.js';
import {
  completeGeneration,
  createPendingGeneration,
  createUsageLog,
  failGeneration,
  findGenerationByRequestKey,
} from '../repositories/ai-content.repository.js';
import { DuplicateGenerationError } from '../utils/ai-content.errors.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

interface GenerateContentServiceInput {
  userId: string;
  input: GenerateContentInput;
  requestKey?: string;
}

const getPositiveNumber = (value: string | undefined): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
};

const calculateEstimatedCost = (
  inputTokens: number,
  outputTokens: number,
): number => {
  const inputPrice = getPositiveNumber(
    process.env.AI_INPUT_COST_PER_1M_TOKENS,
  );
  const outputPrice = getPositiveNumber(
    process.env.AI_OUTPUT_COST_PER_1M_TOKENS,
  );

  const estimatedCost =
    (inputTokens / 1_000_000) * inputPrice +
    (outputTokens / 1_000_000) * outputPrice;

  return Number(estimatedCost.toFixed(8));
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000;

export const generateContent = async ({
  userId,
  input,
  requestKey,
}: GenerateContentServiceInput) => {
  if (requestKey) {
    const existingGeneration = await findGenerationByRequestKey(
      userId,
      requestKey,
    );

    if (existingGeneration) {
      if (existingGeneration.status === 'completed') {
        return { generation: existingGeneration, reused: true };
      }

      throw new DuplicateGenerationError();
    }
  }

  let generation;

  try {
    generation = await createPendingGeneration(userId, input, requestKey);
  } catch (error) {
    if (requestKey && isDuplicateKeyError(error)) {
      const existingGeneration = await findGenerationByRequestKey(
        userId,
        requestKey,
      );

      if (existingGeneration) {
        if (existingGeneration.status === 'completed') {
          return { generation: existingGeneration, reused: true };
        }

        throw new DuplicateGenerationError();
      }

      throw new DuplicateGenerationError();
    }

    throw error;
  }

  const startedAt = performance.now();
  const configuredProvider = process.env.AI_PROVIDER || 'gemini';
  const configuredModel = process.env.AI_MODEL || 'not-configured';

  try {
    const provider = createAIProvider();
    const prompt = buildGenerationPrompt(input);
    const providerResult = await provider.generateContent(prompt, {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS) || 4000,
      timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 60000,
    });
    const responseTime = Math.round(performance.now() - startedAt);
    const estimatedCost = calculateEstimatedCost(
      providerResult.inputTokens,
      providerResult.outputTokens,
    );

    const completedGeneration = await completeGeneration(
      generation._id.toString(),
      {
        content: providerResult.content,
        provider: providerResult.provider,
        model: providerResult.model,
        inputTokens: providerResult.inputTokens,
        outputTokens: providerResult.outputTokens,
        estimatedCost,
      },
    );

    if (!completedGeneration) {
      throw new Error('Generated content could not be saved');
    }

    await createUsageLog({
      userId: generation.userId,
      generationId: generation._id,
      provider: providerResult.provider,
      model: providerResult.model,
      operation: 'generate',
      inputTokens: providerResult.inputTokens,
      outputTokens: providerResult.outputTokens,
      totalTokens: providerResult.totalTokens,
      estimatedCost,
      status: 'success',
      responseTime,
    });

    return { generation: completedGeneration, reused: false };
  } catch (error) {
    const responseTime = Math.round(performance.now() - startedAt);
    const errorMessage =
      error instanceof Error ? error.message.slice(0, 500) : 'Unknown error';

    await Promise.allSettled([
      failGeneration(
        generation._id.toString(),
        configuredProvider,
        configuredModel,
      ),
      createUsageLog({
        userId: generation.userId,
        generationId: generation._id,
        provider: configuredProvider,
        model: configuredModel,
        operation: 'generate',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
        status: 'failed',
        responseTime,
        errorMessage,
      }),
    ]);

    throw error;
  }
};
