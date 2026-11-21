import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('teamflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('teamflow_token');
      localStorage.removeItem('teamflow_user');
      if (!window.location.hash.includes('login') && !window.location.pathname.includes('login')) {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
