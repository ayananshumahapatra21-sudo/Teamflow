import api from './api';
import { mockStore } from './mockStore';

export const projectService = {
  getProjects: async () => {
    try {
      return await api.get('/projects');
    } catch (e) {
      return mockStore.getProjects();
    }
  },
  getProjectById: async (id) => {
    try {
      return await api.get(`/projects/${id}`);
    } catch (e) {
      return mockStore.getProjectById(id);
    }
  },
  createProject: async (teamId, name, projectKey, description) => {
    try {
      return await api.post('/projects', { teamId, name, projectKey, description });
    } catch (e) {
      return mockStore.createProject(teamId, name, projectKey, description);
    }
  },
  getProjectsByTeam: async (teamId) => {
    try {
      return await api.get(`/projects/team/${teamId}`);
    } catch (e) {
      return mockStore.getProjects();
    }
  },
  addMember: async (projectId, userId) => {
    try {
      return await api.post(`/projects/${projectId}/members/${userId}`);
    } catch (e) {
      return { data: null };
    }
  },
};
