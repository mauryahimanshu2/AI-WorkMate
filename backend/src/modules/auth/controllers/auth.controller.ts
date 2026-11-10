import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { User } from '../models/user.model.js';
import {
  createTokenPair,
  hashToken,
  verifyRefreshToken,
} from '../services/token.service.js';

const SALT_ROUNDS = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
}

export const signup = async (
  request: Request<unknown, unknown, SignupBody>,
  response: Response,
): Promise<void> => {
  try {
    const name = request.body.name?.trim();
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (!name || !email || !password) {
      response.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
      return;
    }

    if (name.length < 2 || name.length > 100) {
      response.status(400).json({
        success: false,
        message: 'Name must contain between 2 and 100 characters',
      });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      response.status(400).json({
        success: false,
        message: 'Enter a valid email address',
      });
      return;
    }

    if (password.length < 8) {
      response.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters',
      });
      return;
    }

    const existingUser = await User.exists({ email });

    if (existingUser) {
      response.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    response.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error: unknown) {
    // A unique database index protects against two simultaneous signups.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      response.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    console.error('Signup failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to create the account',
    });
  }
};

interface LoginBody {
  email?: string;
  password?: string;
}

export const login = async (
  request: Request<unknown, unknown, LoginBody>,
  response: Response,
): Promise<void> => {
  try {
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (!email || !password) {
      response.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const user = await User.findOne({ email }).select(
      '+passwordHash +tokenVersion',
    );

    if (!user) {
      response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    if (!user.isActive) {
      response.status(403).json({
        success: false,
        message: 'This account has been disabled',
      });
      return;
    }

    const tokens = createTokenPair({
      id: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    user.lastLoginAt = new Date();
    user.refreshTokenHash = hashToken(tokens.refreshToken);
    await user.save();

    response.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ...tokens,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Login failed:', error);

    response.status(500).json({
      success: false,
      message: 'Unable to log in',
    });
  }
};

interface RefreshTokenBody {
  refreshToken?: string;
}

export const refreshAccessToken = async (
  request: Request<unknown, unknown, RefreshTokenBody>,
  response: Response,
): Promise<void> => {
  try {
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
      response.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    let tokenPayload;

    try {
      tokenPayload = verifyRefreshToken(refreshToken);
    } catch {
      response.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
      return;
    }

    const currentTokenHash = hashToken(refreshToken);
    const user = await User.findOne({
      _id: tokenPayload.userId,
      isActive: true,
    }).select('+refreshTokenHash +tokenVersion');

    if (
      !user ||
      user.refreshTokenHash !== currentTokenHash ||
      user.tokenVersion !== tokenPayload.tokenVersion
    ) {
      response.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
      return;
    }

    const tokens = createTokenPair({
      id: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const updateResult = await User.updateOne(
      {
        _id: user._id,
        refreshTokenHash: currentTokenHash,
        tokenVersion: user.tokenVersion,
      },
      {
        $set: { refreshTokenHash: hashToken(tokens.refreshToken) },
      },
    );

    if (updateResult.modifiedCount !== 1) {
      response.status(401).json({
        success: false,
        message: 'Refresh token has already been used',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    console.error('Token refresh failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to refresh the token',
    });
  }
};

export const logout = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    if (!request.auth) {
      response.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const updateResult = await User.updateOne(
      {
        _id: request.auth.userId,
        tokenVersion: request.auth.tokenVersion,
      },
      {
        $unset: { refreshTokenHash: 1 },
        $inc: { tokenVersion: 1 },
      },
    );

    if (updateResult.modifiedCount !== 1) {
      response.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to log out',
    });
  }
};

