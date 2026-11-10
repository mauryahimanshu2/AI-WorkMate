import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildProfessionalEmailPrompt = (
  input: GenerateContentInput,
): string => `Write a professional business email.

Required format:
Subject: <clear subject line>

<email body with greeting, concise paragraphs, and appropriate closing>

Keep the message practical, grammatically correct, and suitable for the intended recipient.

${buildUserContext(input)}`;
