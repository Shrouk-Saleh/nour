import { apiClient } from './client';

export const progressApi = {
  get: () => apiClient.get('/progress'),
  update: (updates) => apiClient.put('/progress', updates),
  resetToday: () => apiClient.post('/progress/reset-today'),
  resetAll: () => apiClient.post('/progress/reset-all'),
};
