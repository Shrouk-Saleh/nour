import { apiClient } from './client';

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
  getMe: () => apiClient.get('/auth/me'),
};
