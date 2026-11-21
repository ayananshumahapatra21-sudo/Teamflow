import api from './api';

export const analyticsService = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard'),
  getProjectAnalytics: (projectId) => api.get(`/analytics/projects/${projectId}`),
  getRecentActivities: () => api.get('/analytics/activities'),
};
