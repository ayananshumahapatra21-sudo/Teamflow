import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (fullName, email, password) => api.post('/auth/register', { fullName, email, password }),
  getCurrentUser: () => api.get('/users/me'),
  searchUsers: (query) => api.get(`/users/search?query=${encodeURIComponent(query || '')}`),
};
