export interface GenerateContentOptions {
  systemInstruction: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AIProviderResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
  provider: string;
}

export interface AIProvider {
  generateContent(
    prompt: string,
    options: GenerateContentOptions,
  ): Promise<AIProviderResult>;
}
