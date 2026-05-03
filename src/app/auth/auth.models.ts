export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
}
