import api from './api';
import { mockStore } from './mockStore';

export const notificationService = {
  getNotifications: async () => {
    try {
      return await api.get('/notifications');
    } catch (e) {
      return mockStore.getNotifications();
    }
  },
  getUnreadCount: async () => {
    try {
      return await api.get('/notifications/unread-count');
    } catch (e) {
      const notifs = mockStore.getNotifications();
      return { data: notifs.data.filter((n) => !n.read).length };
    }
  },
  markAsRead: async (id) => {
    try {
      return await api.patch(`/notifications/${id}/read`);
    } catch (e) {
      return mockStore.markAsRead(id);
    }
  },
  markAllAsRead: async () => {
    try {
      return await api.post('/notifications/read-all');
    } catch (e) {
      return mockStore.markAllAsRead();
    }
  },
};
