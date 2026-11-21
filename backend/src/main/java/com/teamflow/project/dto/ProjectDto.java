package com.teamflow.project.dto;

import com.teamflow.project.Project;
import com.teamflow.user.UserDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class ProjectDto {

    private UUID id;
    private String name;
    private String projectKey;
    private String description;
    private UUID teamId;
    private String teamName;
    private UserDto owner;
    private String status;
    private List<UserDto> members;
    private LocalDateTime createdAt;

    public ProjectDto() {
    }

    public ProjectDto(UUID id, String name, String projectKey, String description, UUID teamId, String teamName,
                      UserDto owner, String status, List<UserDto> members, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.projectKey = projectKey;
        this.description = description;
        this.teamId = teamId;
        this.teamName = teamName;
        this.owner = owner;
        this.status = status;
        this.members = members;
        this.createdAt = createdAt;
    }

    public static ProjectDto fromEntity(Project project) {
        if (project == null) return null;

        List<UserDto> memberDtos = project.getMembers() != null
                ? project.getMembers().stream()
                .map(m -> UserDto.fromEntity(m.getUser()))
                .collect(Collectors.toList())
                : List.of();

        return new ProjectDto(
                project.getId(),
                project.getName(),
                project.getProjectKey(),
                project.getDescription(),
                project.getTeam() != null ? project.getTeam().getId() : null,
                project.getTeam() != null ? project.getTeam().getName() : null,
                UserDto.fromEntity(project.getOwner()),
                project.getStatus() != null ? project.getStatus().name() : "ACTIVE",
                memberDtos,
                project.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getTeamId() {
        return teamId;
    }

    public void setTeamId(UUID teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public UserDto getOwner() {
        return owner;
    }

    public void setOwner(UserDto owner) {
        this.owner = owner;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<UserDto> getMembers() {
        return members;
    }

    public void setMembers(List<UserDto> members) {
        this.members = members;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
