import { createHash, randomUUID } from 'node:crypto';

import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

import type { UserRole } from '../models/user.model.js';

interface TokenUser {
  id: string;
  role: UserRole;
  tokenVersion: number;
}

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
  tokenVersion: number;
  tokenType: 'access';
}

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
  tokenVersion: number;
  tokenType: 'refresh';
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

const getTokenConfig = () => ({
  accessSecret: getRequiredEnv('JWT_SECRET'),
  refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
  accessExpiresIn: getRequiredEnv(
    'JWT_ACCESS_EXPIRES_IN',
  ) as SignOptions['expiresIn'],
  refreshExpiresIn: getRequiredEnv(
    'JWT_REFRESH_EXPIRES_IN',
  ) as SignOptions['expiresIn'],
});

export const createTokenPair = (user: TokenUser): TokenPair => {
  const config = getTokenConfig();

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      tokenType: 'access',
    },
    config.accessSecret,
    {
      expiresIn: config.accessExpiresIn,
      jwtid: randomUUID(),
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      tokenType: 'refresh',
    },
    config.refreshSecret,
    {
      expiresIn: config.refreshExpiresIn,
      jwtid: randomUUID(),
    },
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const { accessSecret } = getTokenConfig();
  const decoded = jwt.verify(token, accessSecret);

  if (
    typeof decoded === 'string' ||
    typeof decoded.userId !== 'string' ||
    (decoded.role !== 'user' && decoded.role !== 'admin') ||
    !Number.isInteger(decoded.tokenVersion) ||
    decoded.tokenVersion < 0 ||
    decoded.tokenType !== 'access'
  ) {
    throw new Error('Invalid access token payload');
  }

  return decoded as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const { refreshSecret } = getTokenConfig();
  const decoded = jwt.verify(token, refreshSecret);

  if (
    typeof decoded === 'string' ||
    typeof decoded.userId !== 'string' ||
    (decoded.role !== 'user' && decoded.role !== 'admin') ||
    !Number.isInteger(decoded.tokenVersion) ||
    decoded.tokenVersion < 0 ||
    decoded.tokenType !== 'refresh'
  ) {
    throw new Error('Invalid refresh token payload');
  }

  return decoded as RefreshTokenPayload;
};

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

