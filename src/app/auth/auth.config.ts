export const authConfig = {
  useLocalAuth: true,
  sessionTimeoutMinutes: 30,
  identityApiBaseUrl: '/api/identity',
  endpoints: {
    login: '/login',
    register: '/register',
    refresh: '/refresh'
  }
} as const;
