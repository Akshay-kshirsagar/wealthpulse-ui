export const authConfig = {
  useLocalAuth: true,
  identityApiBaseUrl: '/api/identity',
  endpoints: {
    login: '/login',
    register: '/register'
  }
} as const;
