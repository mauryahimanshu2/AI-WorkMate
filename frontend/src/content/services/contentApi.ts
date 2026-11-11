import { apiClient, getApiErrorMessage } from '../../services/apiClient';
import type {
  ContentGeneration,
  ContentHistoryResponse,
  ContentOptions,
  ContentType,
  GeneratedContent,
  GenerationInput,
  HistoryFilters,
  RevisionHistory,
} from '../types/content.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function readData<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const response = await request;

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'The request could not be completed.');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getContentTypes(): Promise<ContentType[]> {
  const data = await readData<{ contentTypes: ContentType[] }>(
    apiClient.get('/ai-content/content-types'),
  );
  return data.contentTypes;
}

export async function getContentOptions(): Promise<ContentOptions> {
  return readData<ContentOptions>(apiClient.get('/ai-content/options'));
}

export async function generateContent(input: GenerationInput): Promise<GeneratedContent> {
  const requestKey = `generate-${crypto.randomUUID()}`;
  return readData<GeneratedContent>(
    apiClient.post('/ai-content/generate', input, {
      headers: { 'Idempotency-Key': requestKey },
    }),
  );
}

export async function getContentHistory(filters: HistoryFilters): Promise<ContentHistoryResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
  );
  return readData<ContentHistoryResponse>(
    apiClient.get('/ai-content/history', { params }),
  );
}

export async function getContentById(id: string): Promise<ContentGeneration> {
  const data = await readData<{ generation: ContentGeneration }>(
    apiClient.get(`/ai-content/${id}`),
  );
  return data.generation;
}

export async function updateContent(
  id: string,
  updates: { title?: string; generatedContent?: string },
): Promise<ContentGeneration> {
  const data = await readData<{ generation: ContentGeneration }>(
    apiClient.patch(`/ai-content/${id}`, updates),
  );
  return data.generation;
}

export async function deleteContent(id: string): Promise<void> {
  try {
    await apiClient.delete(`/ai-content/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getContentRevisions(id: string): Promise<RevisionHistory> {
  return readData<RevisionHistory>(
    apiClient.get(`/ai-content/${id}/revisions`),
  );
}
