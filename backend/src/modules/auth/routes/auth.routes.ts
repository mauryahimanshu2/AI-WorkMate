import { Router } from 'express';

import {
  login,
  logout,
  refreshAccessToken,
  signup,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshAccessToken);
authRouter.post('/logout', authenticate, logout);

export default authRouter;

