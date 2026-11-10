export class AIConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIConfigurationError';
  }
}

export class AIProviderError extends Error {
  constructor(message = 'The AI provider could not generate content') {
    super(message);
    this.name = 'AIProviderError';
  }
}

export class AIProviderTimeoutError extends AIProviderError {
  constructor() {
    super('The AI provider request timed out');
    this.name = 'AIProviderTimeoutError';
  }
}

export class DuplicateGenerationError extends Error {
  constructor() {
    super('A generation with this idempotency key already exists');
    this.name = 'DuplicateGenerationError';
  }
}
