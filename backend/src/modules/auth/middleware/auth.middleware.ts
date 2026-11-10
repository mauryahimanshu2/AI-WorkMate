import type { NextFunction, Request, Response } from 'express';

import { User } from '../models/user.model.js';
import { verifyAccessToken } from '../services/token.service.js';

const sendUnauthorized = (response: Response): void => {
  response.status(401).json({
    success: false,
    message: 'Authentication required',
  });
};

export const authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    sendUnauthorized(response);
    return;
  }

  const accessToken = authorizationHeader.slice('Bearer '.length).trim();

  try {
    const tokenPayload = verifyAccessToken(accessToken);
    const user = await User.findOne({
      _id: tokenPayload.userId,
      isActive: true,
    }).select('+tokenVersion');

    if (!user || user.tokenVersion !== tokenPayload.tokenVersion) {
      sendUnauthorized(response);
      return;
    }

    request.auth = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch {
    sendUnauthorized(response);
  }
};

