import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  getUserHistory,
  updateUserStatus,
} from '../controllers/admin-user.controller.js';
import {
  authenticate,
  requireAdmin,
} from '../../auth/middleware/auth.middleware.js';

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:userId', getUserById);
adminRouter.patch('/users/:userId/status', updateUserStatus);
adminRouter.get('/users/:userId/history', getUserHistory);

export default adminRouter;

