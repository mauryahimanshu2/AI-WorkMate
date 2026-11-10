import { Router } from 'express';

import {
  generateContent,
  getContentTypes,
  getOptions,
} from '../controllers/ai-content.controller.js';
import {
  deleteContent,
  getContentById,
  getContentHistory,
  getContentRevisions,
  updateContent,
} from '../controllers/content-history.controller.js';
import { generationRateLimit } from '../middleware/generation-rate-limit.middleware.js';
import { authenticate } from '../../auth/middleware/auth.middleware.js';

const aiContentRouter = Router();

aiContentRouter.get('/content-types', getContentTypes);
aiContentRouter.get('/options', getOptions);

aiContentRouter.use(authenticate);

aiContentRouter.post('/generate', generationRateLimit, generateContent);
aiContentRouter.get('/history', getContentHistory);
aiContentRouter.get('/:generationId/revisions', getContentRevisions);
aiContentRouter.get('/:generationId', getContentById);
aiContentRouter.patch('/:generationId', updateContent);
aiContentRouter.delete('/:generationId', deleteContent);

export default aiContentRouter;
