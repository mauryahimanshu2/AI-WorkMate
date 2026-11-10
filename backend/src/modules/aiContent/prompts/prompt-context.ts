import type { GenerateContentInput } from '../validators/generate-content.validator.js';

export const buildUserContext = (input: GenerateContentInput): string => {
  const language =
    input.language === 'Custom' ? input.customLanguage : input.language;

  const context = {
    topic: input.topic,
    purposeAndDescription: input.description,
    targetAudience: input.targetAudience,
    tone: input.tone,
    language,
    approximateWordCount: input.wordCount,
    keywords: input.keywords,
    additionalInstructions: input.additionalInstructions,
    recipient: input.recipient,
    platform: input.platform,
    callToAction: input.callToAction,
    productName: input.productName,
    features: input.features,
    benefits: input.benefits,
    outlinePreference: input.outlinePreference,
  };

  return `<user_context>\n${JSON.stringify(context, null, 2)}\n</user_context>`;
};
