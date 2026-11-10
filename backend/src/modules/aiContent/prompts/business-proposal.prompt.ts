import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildBusinessProposalPrompt = (
  input: GenerateContentInput,
): string => `Draft a structured business proposal in Markdown.

Include an executive summary, objectives, proposed approach, deliverables, assumptions, and next steps. Use placeholders when commercial details or timelines were not provided.

${buildUserContext(input)}`;
