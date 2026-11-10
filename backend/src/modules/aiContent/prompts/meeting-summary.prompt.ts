import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildMeetingSummaryPrompt = (
  input: GenerateContentInput,
): string => `Turn the supplied meeting notes into a concise summary.

Use these sections when information is available: Overview, Key Discussion Points, Decisions, Action Items, Owners, and Deadlines. Do not invent decisions, owners, or dates.

${buildUserContext(input)}`;
