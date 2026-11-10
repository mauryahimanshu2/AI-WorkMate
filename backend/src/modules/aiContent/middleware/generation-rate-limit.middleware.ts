import { rateLimit } from 'express-rate-limit';

const generationLimit = Number(process.env.AI_RATE_LIMIT) || 10;

export const generationRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: generationLimit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (request) => request.auth?.userId ?? 'unauthenticated',
  handler: (_request, response) => {
    response.status(429).json({
      success: false,
      message: 'Daily AI generation limit reached. Please try again later.',
    });
  },
});
