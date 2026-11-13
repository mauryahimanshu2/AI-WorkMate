import type {
  SignInInput,
  SignInResult,
  SignUpInput,
  User,
} from '../types/auth.types';
import { apiClient, getApiErrorMessage } from '../../services/apiClient';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(path, body);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Something went wrong. Please try again.');
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function signUp(input: SignUpInput): Promise<User> {
  const data = await post<{ user: User }>('/auth/signup', input);
  return data.user;
}

export async function signIn(input: SignInInput): Promise<SignInResult> {
  return post<SignInResult>('/auth/login', input);
}

export function saveSession(session: SignInResult): void {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('authUser');

  localStorage.setItem('accessToken', session.accessToken);
  localStorage.setItem('refreshToken', session.refreshToken);
  localStorage.setItem('authUser', JSON.stringify(session.user));
}

export function getStoredUser(): User | null {
  const storedUser =
    localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
}

export function hasStoredSession(): boolean {
  return Boolean(
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'),
  );
}

export function clearSession(): void {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem('accessToken');
    storage.removeItem('refreshToken');
    storage.removeItem('authUser');
  }
}

export async function signOut(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Local sign-out must still work if the server is temporarily unavailable.
  } finally {
    clearSession();
  }
}
