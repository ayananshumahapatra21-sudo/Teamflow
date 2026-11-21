package com.teamflow.task.dto;

import com.teamflow.task.Task;
import com.teamflow.user.UserDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class TaskDto {

    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID projectId;
    private String projectName;
    private String projectKey;
    private UserDto assignee;
    private UserDto createdBy;
    private LocalDate dueDate;
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskDto() {
    }

    public TaskDto(UUID id, String title, String description, String status, String priority,
                   UUID projectId, String projectName, String projectKey, UserDto assignee,
                   UserDto createdBy, LocalDate dueDate, Long version, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectKey = projectKey;
        this.assignee = assignee;
        this.createdBy = createdBy;
        this.dueDate = dueDate;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TaskDto fromEntity(Task task) {
        if (task == null) return null;
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus() != null ? task.getStatus().name() : "TODO",
                task.getPriority() != null ? task.getPriority().name() : "MEDIUM",
                task.getProject() != null ? task.getProject().getId() : null,
                task.getProject() != null ? task.getProject().getName() : null,
                task.getProject() != null ? task.getProject().getProjectKey() : null,
                UserDto.fromEntity(task.getAssignee()),
                UserDto.fromEntity(task.getCreatedBy()),
                task.getDueDate(),
                task.getVersion(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public UserDto getAssignee() {
        return assignee;
    }

    public void setAssignee(UserDto assignee) {
        this.assignee = assignee;
    }

    public UserDto getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDto createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
