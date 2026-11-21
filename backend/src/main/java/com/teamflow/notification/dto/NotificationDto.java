package com.teamflow.notification.dto;

import com.teamflow.notification.Notification;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationDto {

    private UUID id;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationDto() {
    }

    public NotificationDto(UUID id, String title, String message, String type, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.createdAt = createdAt;
    }

    public static NotificationDto fromEntity(Notification notification) {
        if (notification == null) return null;
        return new NotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType() != null ? notification.getType().name() : "GENERAL",
                notification.isRead(),
                notification.getCreatedAt()
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
