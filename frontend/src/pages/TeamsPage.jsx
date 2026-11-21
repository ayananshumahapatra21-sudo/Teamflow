import React, { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, Plus, Shield, ShieldAlert, User, Trash2, X } from 'lucide-react';

export const TeamsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create Team modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  // Invite Member modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await teamService.getTeams();
      if (res.data) {
        setTeams(res.data);
        if (res.data.length > 0) {
          setSelectedTeam(res.data[0]);
        }
      }
    } catch (err) {
      showToast('Failed to load teams', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      const res = await teamService.createTeam(newTeamName.trim(), newTeamDesc.trim());
      if (res.data) {
        showToast('Team workspace created!', 'success');
        setTeams((prev) => [...prev, res.data]);
        setSelectedTeam(res.data);
        setShowCreateModal(false);
        setNewTeamName('');
        setNewTeamDesc('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create team', 'error');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedTeam) return;

    try {
      const res = await teamService.addMember(selectedTeam.id, inviteEmail.trim(), inviteRole);
      if (res.data) {
        showToast('Member added to team!', 'success');
        setSelectedTeam(res.data);
        setTeams((prev) => prev.map((t) => (t.id === res.data.id ? res.data : t)));
        setShowInviteModal(false);
        setInviteEmail('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add member', 'error');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await teamService.removeMember(selectedTeam.id, userId);
      showToast('Member removed', 'success');
      // Refresh team details
      const res = await teamService.getTeamById(selectedTeam.id);
      if (res.data) {
        setSelectedTeam(res.data);
        setTeams((prev) => prev.map((t) => (t.id === res.data.id ? res.data : t)));
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove member', 'error');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Teams & Workspaces</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization members, workspace ownership and role-based permissions
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Team Workspace</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-400">Loading teams...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Team Switcher Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-2">
              Your Teams ({teams.length})
            </span>
            <div className="space-y-1">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeam(t)}
                  className={`w-full text-left p-3.5 rounded-2xl transition border ${
                    selectedTeam?.id === t.id
                      ? 'bg-white border-brand-500 shadow-sm ring-2 ring-brand-500/10'
                      : 'bg-white/60 hover:bg-white border-slate-200/60 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800">{t.name}</p>
                  <span className="text-xs text-slate-400">{t.members?.length || 1} members</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Team Details & Member Roster */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            {selectedTeam ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                      {selectedTeam.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      {selectedTeam.description || 'Workspace for team projects and collaborative tasks.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Member</span>
                  </button>
                </div>

                {/* Member Roster Table */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Team Members ({selectedTeam.members?.length || 0})
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {selectedTeam.members?.map((m) => {
                      const isOwner = selectedTeam.owner?.id === m.user?.id;
                      const isCurrentUser = user?.id === m.user?.id;
                      return (
                        <div
                          key={m.id}
                          className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={m.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user?.email}`}
                              alt={m.user?.fullName}
                              className="w-9 h-9 rounded-full bg-slate-100"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {m.user?.fullName} {isCurrentUser && <span className="text-xs text-slate-400 font-normal">(You)</span>}
                              </p>
                              <p className="text-xs text-slate-400">{m.user?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getRoleBadge(
                                m.role
                              )}`}
                            >
                              {m.role} {isOwner && '• Owner'}
                            </span>

                            {!isOwner && !isCurrentUser && (
                              <button
                                onClick={() => handleRemoveMember(m.user?.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Remove member"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">No team workspace selected.</p>
            )}
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Create Team Workspace</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Backend Engineering"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Workspace scope and objectives..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Invite Member to {selectedTeam?.name}</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInviteMember} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">User Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@teamflow.io"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="MEMBER">Member (Can manage tasks & comments)</option>
                  <option value="MANAGER">Manager (Can manage projects & invite members)</option>
                  <option value="ADMIN">Admin (Full workspace control)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
