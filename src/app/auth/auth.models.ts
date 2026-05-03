export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
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
  userEmail: string | null;
  userName: string | null;
}

export interface LocalAuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
}
