import api from './api';
import { mockStore } from './mockStore';

export const taskService = {
  getTasks: async (projectId, params = {}) => {
    try {
      const query = new URLSearchParams({ projectId, ...params }).toString();
      return await api.get(`/tasks?${query}`);
    } catch (e) {
      return mockStore.getTasks(projectId, params);
    }
  },
  getTaskById: async (id) => {
    try {
      return await api.get(`/tasks/${id}`);
    } catch (e) {
      return { data: null };
    }
  },
  createTask: async (taskData) => {
    try {
      return await api.post('/tasks', taskData);
    } catch (e) {
      return mockStore.createTask(taskData);
    }
  },
  updateTaskStatus: async (id, status, version) => {
    try {
      return await api.patch(`/tasks/${id}/status`, { status, version });
    } catch (e) {
      return mockStore.updateTaskStatus(id, status, version);
    }
  },
  updateTask: async (id, taskData) => {
    try {
      return await api.put(`/tasks/${id}`, taskData);
    } catch (e) {
      return mockStore.updateTask(id, taskData);
    }
  },
  deleteTask: async (id) => {
    try {
      return await api.delete(`/tasks/${id}`);
    } catch (e) {
      return mockStore.deleteTask(id);
    }
  },
  getComments: async (taskId) => {
    try {
      return await api.get(`/tasks/${taskId}/comments`);
    } catch (e) {
      return mockStore.getComments(taskId);
    }
  },
  addComment: async (taskId, content) => {
    try {
      return await api.post(`/tasks/${taskId}/comments`, { content });
    } catch (e) {
      return mockStore.addComment(taskId, content);
    }
  },
};
