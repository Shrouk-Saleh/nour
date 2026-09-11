import { apiClient } from './client';

export const scheduleApi = {
  getAll: () => apiClient.get('/schedule'),
  getByDay: (day) => apiClient.get(`/schedule?day=${encodeURIComponent(day)}`),
  create: (task) => apiClient.post('/schedule', task),
  update: (id, updates) => apiClient.put(`/schedule/${id}`, updates),
  remove: (id) => apiClient.delete(`/schedule/${id}`),
  complete: (id, completed = true) => apiClient.post(`/schedule/${id}/complete`, { completed }),
};
