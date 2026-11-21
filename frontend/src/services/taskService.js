import api from './api';

export const taskService = {
  getTasks: (projectId, params = {}) => {
    const query = new URLSearchParams({ projectId, ...params }).toString();
    return api.get(`/tasks?${query}`);
  },
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTaskStatus: (id, status, version) => api.patch(`/tasks/${id}/status`, { status, version }),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getComments: (taskId) => api.get(`/tasks/${taskId}/comments`),
  addComment: (taskId, content) => api.post(`/tasks/${taskId}/comments`, { content }),
};
