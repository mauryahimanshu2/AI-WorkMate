import { buildUserContext } from './prompt-context.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildBlogArticlePrompt = (
  input: GenerateContentInput,
): string => `Write a useful blog article in Markdown.

Include a strong title, introduction, descriptive headings, coherent sections, and a concise conclusion. Use keywords naturally without keyword stuffing.

${buildUserContext(input)}`;

export const buildBlogOutlinePrompt = (
  input: GenerateContentInput,
): string => `Create a detailed blog outline in Markdown.

Include a proposed title, introduction angle, logical H2 sections, useful H3 subtopics, and a conclusion or call-to-action section. Do not write the full article.

${buildUserContext(input)}`;
