import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildSocialMediaPrompt = (
  input: GenerateContentInput,
): string => `Write a social media post appropriate for the selected platform.

Use an engaging opening, readable structure, and the requested call to action. Add only relevant hashtags and avoid excessive emojis or clickbait.

${buildUserContext(input)}`;
