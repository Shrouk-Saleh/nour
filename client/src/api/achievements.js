import { apiClient } from './client';

export const achievementsApi = {
  getAll: () => apiClient.get('/achievements'),
};
