import { Router } from 'express';

import {
  generateContent,
  getContentTypes,
  getOptions,
} from '../controllers/ai-content.controller.js';
import { generationRateLimit } from '../middleware/generation-rate-limit.middleware.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';

const aiContentRouter = Router();

aiContentRouter.get('/content-types', getContentTypes);
aiContentRouter.get('/options', getOptions);
aiContentRouter.post(
  '/generate',
  authenticate,
  generationRateLimit,
  generateContent,
);

export default aiContentRouter;
