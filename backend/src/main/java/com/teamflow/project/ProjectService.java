package com.teamflow.project;

import com.teamflow.common.BadRequestException;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.project.dto.CreateProjectRequest;
import com.teamflow.project.dto.ProjectDto;
import com.teamflow.security.SecurityUtils;
import com.teamflow.team.Team;
import com.teamflow.team.TeamMemberRepository;
import com.teamflow.team.TeamRepository;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          TeamRepository teamRepository,
                          TeamMemberRepository teamMemberRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectDto createProject(CreateProjectRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));

        boolean isMember = team.getOwner().getId().equals(currentUserId) ||
                teamMemberRepository.existsByTeamIdAndUserId(team.getId(), currentUserId);

        if (!isMember) {
            throw new AccessDeniedException("You are not a member of the selected team.");
        }

        String projectKey = request.getProjectKey().toUpperCase().trim();
        if (projectRepository.existsByProjectKey(projectKey)) {
            throw new BadRequestException("A project with key '" + projectKey + "' already exists.");
        }

        Project project = new Project(
                request.getName().trim(),
                projectKey,
                request.getDescription(),
                team,
                currentUser,
                ProjectStatus.ACTIVE
        );

        Project savedProject = projectRepository.save(project);

        ProjectMember member = new ProjectMember(savedProject, currentUser);
        projectMemberRepository.save(member);
        savedProject.getMembers().add(member);

        return ProjectDto.fromEntity(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getCurrentUserProjects() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return projectRepository.findAllByUserId(currentUserId)
                .stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsByTeamId(UUID teamId) {
        return projectRepository.findByTeamId(teamId)
                .stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return ProjectDto.fromEntity(project);
    }

    @Transactional
    public ProjectDto addMemberToProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new BadRequestException("User is already a member of this project.");
        }

        ProjectMember member = new ProjectMember(project, user);
        projectMemberRepository.save(member);
        project.getMembers().add(member);

        return ProjectDto.fromEntity(project);
    }
}
