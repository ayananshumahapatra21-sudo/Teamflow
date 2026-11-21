import api from './api';
import { mockStore } from './mockStore';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    try {
      return await api.get('/analytics/dashboard');
    } catch (e) {
      return mockStore.getDashboardAnalytics();
    }
  },
  getProjectAnalytics: async (projectId) => {
    try {
      return await api.get(`/analytics/projects/${projectId}`);
    } catch (e) {
      return mockStore.getProjectAnalytics(projectId);
    }
  },
  getRecentActivities: async () => {
    try {
      return await api.get('/analytics/activities');
    } catch (e) {
      return { data: [] };
    }
  },
};
