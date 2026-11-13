import axios, { type InternalAxiosRequestConfig } from 'axios';
import { navigate } from '../routing/router';

interface ApiErrorResponse {
  message?: string;
}

interface RefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = (configuredApiUrl || '/api').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const isPublicAuthRequest = ['/auth/login', '/auth/signup', '/auth/refresh-token']
    .some((path) => config.url?.includes(path));
  const accessToken =
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  if (accessToken && !isPublicAuthRequest) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    const refreshToken =
      localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    const isPublicAuthRequest = ['/auth/login', '/auth/signup', '/auth/refresh-token']
      .some((path) => originalRequest?.url?.includes(path));

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<RefreshResponse>(
          `${baseURL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true },
        );
        const tokens = response.data.data;

        if (!response.data.success || !tokens) throw new Error('Token refresh failed');

        const storage = localStorage.getItem('refreshToken')
          ? localStorage
          : sessionStorage;
        storage.setItem('accessToken', tokens.accessToken);
        storage.setItem('refreshToken', tokens.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        return apiClient(originalRequest);
      } catch {
        for (const storage of [localStorage, sessionStorage]) {
          storage.removeItem('accessToken');
          storage.removeItem('refreshToken');
          storage.removeItem('authUser');
        }

        if (!['/signin', '/signup', '/login', '/register'].includes(window.location.pathname)) {
          navigate('/signin', { replace: true });
        }
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Please try again.';
    }

    return (
      error.response.data?.message ||
      'Something went wrong. Please try again.'
    );
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
