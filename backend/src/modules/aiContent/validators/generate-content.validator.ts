import { z } from 'zod';

import {
  CONTENT_TYPE_IDS,
  LANGUAGES,
  SOCIAL_PLATFORMS,
  TONES,
} from '../config/content-options.js';

const maximumInputLength = Number(process.env.AI_MAX_INPUT_LENGTH) || 5000;

const optionalText = (maximum: number) =>
  z.string().trim().min(1).max(maximum).optional();

const textList = z
  .array(z.string().trim().min(1).max(300))
  .max(15)
  .default([]);

export const generateContentSchema = z
  .object({
    contentType: z.enum(CONTENT_TYPE_IDS),
    topic: z.string().trim().min(3).max(150),
    description: z.string().trim().min(10).max(5000),
    targetAudience: optionalText(300),
    tone: z.enum(TONES),
    language: z.enum(LANGUAGES),
    customLanguage: optionalText(100),
    wordCount: z.number().int().min(50).max(5000).optional(),
    keywords: z
      .array(z.string().trim().min(1).max(50))
      .max(15)
      .default([]),
    additionalInstructions: optionalText(2000),
    recipient: optionalText(200),
    platform: z.enum(SOCIAL_PLATFORMS).optional(),
    callToAction: optionalText(500),
    productName: optionalText(200),
    features: textList,
    benefits: textList,
    outlinePreference: z.boolean().optional(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.language === 'Custom' && !input.customLanguage) {
      context.addIssue({
        code: 'custom',
        path: ['customLanguage'],
        message: 'Custom language is required when language is Custom',
      });
    }

    const totalInputLength = [
      input.topic,
      input.description,
      input.targetAudience,
      input.additionalInstructions,
      input.recipient,
      input.callToAction,
      input.productName,
      ...input.keywords,
      ...input.features,
      ...input.benefits,
    ]
      .filter(Boolean)
      .join(' ').length;

    if (totalInputLength > maximumInputLength) {
      context.addIssue({
        code: 'custom',
        path: ['description'],
        message: `Combined input cannot exceed ${maximumInputLength} characters`,
      });
    }
  });

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
