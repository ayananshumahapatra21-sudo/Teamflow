package com.teamflow.team;

import com.teamflow.common.BadRequestException;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.security.SecurityUtils;
import com.teamflow.team.dto.AddTeamMemberRequest;
import com.teamflow.team.dto.CreateTeamRequest;
import com.teamflow.team.dto.TeamDto;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository,
                       UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TeamDto createTeam(CreateTeamRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Team team = new Team(request.getName(), request.getDescription(), currentUser);
        Team savedTeam = teamRepository.save(team);

        TeamMember adminMembership = new TeamMember(savedTeam, currentUser, TeamRole.ADMIN);
        teamMemberRepository.save(adminMembership);
        savedTeam.getMembers().add(adminMembership);

        return TeamDto.fromEntity(savedTeam);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getCurrentUserTeams() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return teamRepository.findAllByUserId(currentUserId)
                .stream()
                .map(TeamDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        return TeamDto.fromEntity(team);
    }

    @Transactional
    public TeamDto addMemberToTeam(UUID teamId, AddTeamMemberRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        // Check if current user is owner or ADMIN/MANAGER
        boolean isAuthorized = team.getOwner().getId().equals(currentUserId) ||
                teamMemberRepository.findByTeamIdAndUserId(teamId, currentUserId)
                        .map(m -> m.getRole() == TeamRole.ADMIN || m.getRole() == TeamRole.MANAGER)
                        .orElse(false);

        if (!isAuthorized) {
            throw new AccessDeniedException("Only team admins or managers can invite new members");
        }

        User userToAdd = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + request.getEmail() + " not found"));

        if (teamMemberRepository.existsByTeamIdAndUserId(teamId, userToAdd.getId())) {
            throw new BadRequestException("User is already a member of this team");
        }

        TeamMember member = new TeamMember(team, userToAdd, request.getRole());
        teamMemberRepository.save(member);
        team.getMembers().add(member);

        return TeamDto.fromEntity(team);
    }

    @Transactional
    public void removeMemberFromTeam(UUID teamId, UUID memberUserId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        if (team.getOwner().getId().equals(memberUserId)) {
            throw new BadRequestException("Cannot remove team owner from the team");
        }

        boolean isAuthorized = team.getOwner().getId().equals(currentUserId) ||
                teamMemberRepository.findByTeamIdAndUserId(teamId, currentUserId)
                        .map(m -> m.getRole() == TeamRole.ADMIN)
                        .orElse(false) ||
                currentUserId.equals(memberUserId); // user leaving themselves

        if (!isAuthorized) {
            throw new AccessDeniedException("You do not have permission to remove this member");
        }

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this team"));

        team.getMembers().remove(member);
        teamMemberRepository.delete(member);
    }
}
