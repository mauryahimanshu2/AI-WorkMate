import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildCustomContentPrompt = (
  input: GenerateContentInput,
): string => `Create content that satisfies the stated purpose and additional instructions.

Choose a clear professional structure suitable for the requested audience. User instructions remain subject to the system safety and factual-accuracy rules.

${buildUserContext(input)}`;
