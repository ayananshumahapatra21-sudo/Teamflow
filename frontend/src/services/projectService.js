import api from './api';

export const projectService = {
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (teamId, name, projectKey, description) =>
    api.post('/projects', { teamId, name, projectKey, description }),
  getProjectsByTeam: (teamId) => api.get(`/projects/team/${teamId}`),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members/${userId}`),
};
