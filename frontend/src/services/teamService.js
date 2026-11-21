import api from './api';
import { mockStore } from './mockStore';

export const teamService = {
  getTeams: async () => {
    try {
      return await api.get('/teams');
    } catch (e) {
      return mockStore.getTeams();
    }
  },
  getTeamById: async (id) => {
    try {
      return await api.get(`/teams/${id}`);
    } catch (e) {
      return mockStore.getTeamById(id);
    }
  },
  createTeam: async (name, description) => {
    try {
      return await api.post('/teams', { name, description });
    } catch (e) {
      return mockStore.createTeam(name, description);
    }
  },
  addMember: async (teamId, email, role) => {
    try {
      return await api.post(`/teams/${teamId}/members`, { email, role });
    } catch (e) {
      return mockStore.addMember(teamId, email, role);
    }
  },
  removeMember: async (teamId, userId) => {
    try {
      return await api.delete(`/teams/${teamId}/members/${userId}`);
    } catch (e) {
      return mockStore.removeMember(teamId, userId);
    }
  },
};
