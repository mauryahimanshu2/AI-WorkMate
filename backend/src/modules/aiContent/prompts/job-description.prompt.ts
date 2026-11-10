import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildJobDescriptionPrompt = (
  input: GenerateContentInput,
): string => `Write an inclusive, professional job description in Markdown.

Include a role summary, responsibilities, required qualifications, preferred qualifications, and a neutral application section. Do not invent salary, location, benefits, or company facts.

${buildUserContext(input)}`;
