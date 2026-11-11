import type { ContentGeneration } from '../../content/types/content.types';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListFilters {
  page: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | '';
  role?: 'user' | 'admin' | '';
}

export interface UserListResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    totalUsers: number;
    totalPages: number;
  };
}

export interface AdminUserDetails {
  user: AdminUser;
  generationCount: number;
}

export interface AdminUserHistory {
  history: ContentGeneration[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface AdminSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  administrators: number;
}
