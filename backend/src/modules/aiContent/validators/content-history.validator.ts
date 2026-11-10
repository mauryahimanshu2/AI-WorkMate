import { z } from 'zod';

import { CONTENT_TYPE_IDS } from '../config/content-options.js';

export const historyQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    contentType: z.enum(CONTENT_TYPE_IDS).optional(),
    status: z.enum(['pending', 'completed', 'failed']).optional(),
    search: z.string().trim().max(100).optional(),
  })
  .strict();

export const updateContentSchema = z
  .object({
    title: z.string().trim().min(1).max(150).optional(),
    generatedContent: z
      .string()
      .min(1)
      .max(50_000)
      .refine((content) => content.trim().length > 0, {
        message: 'Generated content cannot be empty',
      })
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.title !== undefined || data.generatedContent !== undefined,
    { message: 'Provide a title or generatedContent to update' },
  );
