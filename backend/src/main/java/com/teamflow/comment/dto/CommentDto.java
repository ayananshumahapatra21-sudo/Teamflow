package com.teamflow.comment.dto;

import com.teamflow.comment.TaskComment;
import com.teamflow.user.UserDto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommentDto {

    private UUID id;
    private UUID taskId;
    private UserDto user;
    private String content;
    private LocalDateTime createdAt;

    public CommentDto() {
    }

    public CommentDto(UUID id, UUID taskId, UserDto user, String content, LocalDateTime createdAt) {
        this.id = id;
        this.taskId = taskId;
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static CommentDto fromEntity(TaskComment comment) {
        if (comment == null) return null;
        return new CommentDto(
                comment.getId(),
                comment.getTask() != null ? comment.getTask().getId() : null,
                UserDto.fromEntity(comment.getUser()),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
