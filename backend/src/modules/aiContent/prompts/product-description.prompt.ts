import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildProductDescriptionPrompt = (
  input: GenerateContentInput,
): string => `Write an accurate product description.

Lead with the product's value, explain supplied features as customer benefits, and finish with an appropriate call to action. Do not add specifications or claims that were not supplied.

${buildUserContext(input)}`;
