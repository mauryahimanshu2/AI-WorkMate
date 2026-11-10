import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { ContentGeneration } from '../../aiContent/models/content-generation.model.js';
import { User } from '../../auth/models/user.model.js';

const USER_FIELDS =
  'name email role isActive lastLoginAt createdAt updatedAt';
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

interface UserListFilter {
  isActive?: boolean;
  role?: 'user' | 'admin';
  $or?: Array<
    | { name: { $regex: string; $options: 'i' } }
    | { email: { $regex: string; $options: 'i' } }
  >;
}

const getPositiveInteger = (
  value: unknown,
  defaultValue: number,
  maximum?: number,
): number => {
  const parsedValue = Number.parseInt(String(value ?? ''), 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return maximum ? Math.min(parsedValue, maximum) : parsedValue;
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isValidUserId = (userId: string): boolean =>
  mongoose.isValidObjectId(userId);

const getRouteParameter = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

export const getAllUsers = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const page = getPositiveInteger(request.query.page, 1);
    const limit = getPositiveInteger(
      request.query.limit,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const search = String(request.query.search ?? '').trim();
    const status = String(request.query.status ?? '').toLowerCase();
    const role = String(request.query.role ?? '').toLowerCase();
    const filter: UserListFilter = {};

    if (search) {
      const safeSearch = escapeRegExp(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    if (role === 'user' || role === 'admin') {
      filter.role = role;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select(USER_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    response.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve users',
    });
  }
};

export const getUserById = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const userId = getRouteParameter(request.params.userId);

    if (!userId || !isValidUserId(userId)) {
      response.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
      return;
    }

    const [user, generationCount] = await Promise.all([
      User.findById(userId).select(USER_FIELDS).lean(),
      ContentGeneration.countDocuments({ userId }),
    ]);

    if (!user) {
      response.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user,
        generationCount,
      },
    });
  } catch (error) {
    console.error('Get user failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve the user',
    });
  }
};

export const updateUserStatus = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const userId = getRouteParameter(request.params.userId);
    const { isActive } = request.body as { isActive?: unknown };

    if (!userId || !isValidUserId(userId)) {
      response.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
      return;
    }

    if (typeof isActive !== 'boolean') {
      response.status(400).json({
        success: false,
        message: 'isActive must be true or false',
      });
      return;
    }

    if (request.auth?.userId === userId && !isActive) {
      response.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account',
      });
      return;
    }

    const user = await User.findById(userId).select(
      '+tokenVersion +refreshTokenHash',
    );

    if (!user) {
      response.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (user.isActive !== isActive) {
      user.isActive = isActive;

      if (!isActive) {
        user.refreshTokenHash = undefined;
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
      }

      await user.save();
    }

    response.status(200).json({
      success: true,
      message: isActive
        ? 'User activated successfully'
        : 'User deactivated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Update user status failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to update user status',
    });
  }
};

export const getUserHistory = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const userId = getRouteParameter(request.params.userId);

    if (!userId || !isValidUserId(userId)) {
      response.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
      return;
    }

    const userExists = await User.exists({ _id: userId });

    if (!userExists) {
      response.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const page = getPositiveInteger(request.query.page, 1);
    const limit = getPositiveInteger(
      request.query.limit,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const filter = { userId };
    const [history, totalRecords] = await Promise.all([
      ContentGeneration.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContentGeneration.countDocuments(filter),
    ]);

    response.status(200).json({
      success: true,
      message: 'User history retrieved successfully',
      data: {
        history,
        pagination: {
          page,
          limit,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user history failed:', error);
    response.status(500).json({
      success: false,
      message: 'Unable to retrieve user history',
    });
  }
};

