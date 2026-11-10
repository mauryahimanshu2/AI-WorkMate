import { buildBlogArticlePrompt, buildBlogOutlinePrompt } from './blog.prompt.js';
import { buildBusinessProposalPrompt } from './business-proposal.prompt.js';
import { buildCustomContentPrompt } from './custom.prompt.js';
import { buildProfessionalEmailPrompt } from './email.prompt.js';
import { buildJobDescriptionPrompt } from './job-description.prompt.js';
import { buildMarketingCopyPrompt } from './marketing.prompt.js';
import { buildMeetingSummaryPrompt } from './meeting-summary.prompt.js';
import { buildProductDescriptionPrompt } from './product-description.prompt.js';
import { buildSocialMediaPrompt } from './social-media.prompt.js';
import type { GenerateContentInput } from '../validators/generate-content.validator.js';

type PromptBuilder = (input: GenerateContentInput) => string;

const promptBuilders: Record<GenerateContentInput['contentType'], PromptBuilder> = {
  professional_email: buildProfessionalEmailPrompt,
  social_media_post: buildSocialMediaPrompt,
  blog_article: buildBlogArticlePrompt,
  blog_outline: buildBlogOutlinePrompt,
  product_description: buildProductDescriptionPrompt,
  marketing_copy: buildMarketingCopyPrompt,
  business_proposal: buildBusinessProposalPrompt,
  job_description: buildJobDescriptionPrompt,
  meeting_summary: buildMeetingSummaryPrompt,
  custom_content: buildCustomContentPrompt,
};

export const buildGenerationPrompt = (input: GenerateContentInput): string =>
  promptBuilders[input.contentType](input);
