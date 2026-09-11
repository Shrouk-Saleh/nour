import { apiClient } from './client';

export const houseApi = {
  get: () => apiClient.get('/house'),
  update: (data) => apiClient.put('/house', data),
};
