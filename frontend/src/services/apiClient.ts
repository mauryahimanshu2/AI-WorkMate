import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
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
  const accessToken =
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

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
