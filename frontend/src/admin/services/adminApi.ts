import { apiClient, getApiErrorMessage } from '../../services/apiClient';
import type {
  AdminSummary,
  AdminUser,
  AdminUserDetails,
  AdminUserHistory,
  UserListFilters,
  UserListResponse,
} from '../types/admin.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function readData<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const response = await request;
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'The admin request could not be completed.');
    }
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export function getUsers(filters: UserListFilters): Promise<UserListResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
  );
  return readData<UserListResponse>(apiClient.get('/admin/users', { params }));
}

export function getUserDetails(userId: string): Promise<AdminUserDetails> {
  return readData<AdminUserDetails>(apiClient.get(`/admin/users/${userId}`));
}

export function getUserHistory(userId: string, page = 1): Promise<AdminUserHistory> {
  return readData<AdminUserHistory>(
    apiClient.get(`/admin/users/${userId}/history`, { params: { page, limit: 6 } }),
  );
}

export async function setUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
  const data = await readData<{ user: AdminUser }>(
    apiClient.patch(`/admin/users/${userId}/status`, { isActive }),
  );
  return data.user;
}

export async function getAdminSummary(): Promise<AdminSummary> {
  const [all, active, inactive, admins] = await Promise.all([
    getUsers({ page: 1, limit: 1 }),
    getUsers({ page: 1, limit: 1, status: 'active' }),
    getUsers({ page: 1, limit: 1, status: 'inactive' }),
    getUsers({ page: 1, limit: 1, role: 'admin' }),
  ]);

  return {
    totalUsers: all.pagination.totalUsers,
    activeUsers: active.pagination.totalUsers,
    inactiveUsers: inactive.pagination.totalUsers,
    administrators: admins.pagination.totalUsers,
  };
}
