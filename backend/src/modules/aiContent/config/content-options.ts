export const CONTENT_TYPE_IDS = [
  'professional_email',
  'social_media_post',
  'blog_article',
  'blog_outline',
  'product_description',
  'marketing_copy',
  'business_proposal',
  'job_description',
  'meeting_summary',
  'custom_content',
] as const;

export const TONES = [
  'professional',
  'formal',
  'friendly',
  'conversational',
  'persuasive',
  'creative',
  'technical',
  'informative',
  'humorous',
] as const;

export const LANGUAGES = [
  'English',
  'Hindi',
  'French',
  'Spanish',
  'German',
  'Arabic',
  'Custom',
] as const;

export const SOCIAL_PLATFORMS = [
  'LinkedIn',
  'X',
  'Facebook',
  'Instagram',
  'General',
] as const;

export const CONTENT_TYPES = [
  {
    id: 'professional_email',
    name: 'Professional Email',
    description: 'A business email with a subject line and clear body.',
    dynamicFields: ['recipient', 'callToAction'],
  },
  {
    id: 'social_media_post',
    name: 'Social Media Post',
    description: 'A platform-appropriate post with an optional CTA and hashtags.',
    dynamicFields: ['platform', 'callToAction'],
  },
  {
    id: 'blog_article',
    name: 'Blog Article',
    description: 'A structured article draft with headings and coherent sections.',
    dynamicFields: ['keywords', 'outlinePreference'],
  },
  {
    id: 'blog_outline',
    name: 'Blog Outline',
    description: 'A structured outline with headings and useful subtopics.',
    dynamicFields: ['keywords'],
  },
  {
    id: 'product_description',
    name: 'Product Description',
    description: 'Feature-led product copy focused on customer benefits.',
    dynamicFields: ['productName', 'features', 'benefits'],
  },
  {
    id: 'marketing_copy',
    name: 'Marketing Copy',
    description: 'Promotional copy tailored to a target audience.',
    dynamicFields: ['callToAction', 'keywords'],
  },
  {
    id: 'business_proposal',
    name: 'Business Proposal',
    description: 'A structured proposal with objectives, approach, and next steps.',
    dynamicFields: ['callToAction'],
  },
  {
    id: 'job_description',
    name: 'Job Description',
    description: 'A role summary with responsibilities and requirements.',
    dynamicFields: ['keywords'],
  },
  {
    id: 'meeting_summary',
    name: 'Meeting Summary',
    description: 'A concise summary with decisions and action items.',
    dynamicFields: [],
  },
  {
    id: 'custom_content',
    name: 'Custom Content',
    description: 'Content generated from specific user instructions.',
    dynamicFields: ['additionalInstructions'],
  },
] as const;

export type ContentTypeId = (typeof CONTENT_TYPE_IDS)[number];
export type Tone = (typeof TONES)[number];
export type Language = (typeof LANGUAGES)[number];
