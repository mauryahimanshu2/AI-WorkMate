export type ContentStatus = 'pending' | 'completed' | 'failed';

export interface ContentType {
  id: string;
  name: string;
  description: string;
  dynamicFields: string[];
}

export interface ContentOptions {
  tones: string[];
  languages: string[];
  socialPlatforms: string[];
  wordCount: { minimum: number; maximum: number };
  maximumKeywords: number;
}

export interface GenerationInput {
  contentType: string;
  topic: string;
  description: string;
  targetAudience?: string;
  tone: string;
  language: string;
  customLanguage?: string;
  wordCount?: number;
  keywords: string[];
  additionalInstructions?: string;
  recipient?: string;
  platform?: string;
  callToAction?: string;
  productName?: string;
  features: string[];
  benefits: string[];
  outlinePreference?: boolean;
}

export interface ContentUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  totalTokens?: number;
}

export interface GeneratedContent {
  id: string;
  title: string;
  contentType: string;
  generatedContent: string;
  status: ContentStatus;
  provider?: string;
  model?: string;
  usage: ContentUsage;
  createdAt: string;
}

export interface ContentHistoryItem {
  _id: string;
  title: string;
  contentType: string;
  status: ContentStatus;
  provider?: string;
  model?: string;
  usage: ContentUsage;
  createdAt: string;
  updatedAt: string;
}

export interface ContentRevision {
  version: number;
  content: string;
  createdAt: string;
}

export interface ContentGeneration extends Omit<ContentHistoryItem, 'usage'> {
  userId: string;
  input: GenerationInput;
  generatedContent: string;
  revisions: ContentRevision[];
  usage: ContentUsage;
}

export interface HistoryPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface ContentHistoryResponse {
  history: ContentHistoryItem[];
  pagination: HistoryPagination;
}

export interface HistoryFilters {
  page: number;
  limit?: number;
  search?: string;
  contentType?: string;
  status?: ContentStatus | '';
}

export interface RevisionHistory {
  revisions: ContentRevision[];
  current: ContentRevision;
  totalVersions: number;
}
