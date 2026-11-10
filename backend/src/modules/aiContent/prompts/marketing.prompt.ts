import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildMarketingCopyPrompt = (
  input: GenerateContentInput,
): string => `Write audience-focused marketing copy.

Use a clear value proposition, persuasive but truthful benefits, and an appropriate call to action. Avoid unsupported urgency, guarantees, or factual claims.

${buildUserContext(input)}`;
