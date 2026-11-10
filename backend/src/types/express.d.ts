import type { UserRole } from '../modules/auth/models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
        tokenVersion: number;
      };
    }
  }
}

export {};

