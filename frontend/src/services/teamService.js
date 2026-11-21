import api from './api';

export const teamService = {
  getTeams: () => api.get('/teams'),
  getTeamById: (id) => api.get(`/teams/${id}`),
  createTeam: (name, description) => api.post('/teams', { name, description }),
  addMember: (teamId, email, role) => api.post(`/teams/${teamId}/members`, { email, role }),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};
