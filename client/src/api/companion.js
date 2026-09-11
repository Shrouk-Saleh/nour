import { apiClient } from './client';

export const companionApi = {
  get: () => apiClient.get('/companion'),
  update: (data) => apiClient.put('/companion', data),
  feed: () => apiClient.post('/companion/feed'),
  water: () => apiClient.post('/companion/garden/water'),
  harvest: () => apiClient.rawPost('/companion/garden/harvest'),
};
