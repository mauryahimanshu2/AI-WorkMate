export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInResult extends AuthTokens {
  user: User;
}
