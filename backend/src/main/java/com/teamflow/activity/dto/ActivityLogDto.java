package com.teamflow.activity.dto;

import com.teamflow.activity.ActivityLog;
import com.teamflow.user.UserDto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ActivityLogDto {

    private UUID id;
    private UUID projectId;
    private UserDto user;
    private String action;
    private String entityType;
    private UUID entityId;
    private String details;
    private LocalDateTime createdAt;

    public ActivityLogDto() {
    }

    public ActivityLogDto(UUID id, UUID projectId, UserDto user, String action, String entityType, UUID entityId, String details, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.createdAt = createdAt;
    }

    public static ActivityLogDto fromEntity(ActivityLog log) {
        if (log == null) return null;
        return new ActivityLogDto(
                log.getId(),
                log.getProject() != null ? log.getProject().getId() : null,
                UserDto.fromEntity(log.getUser()),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
