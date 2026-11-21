package com.teamflow.user;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String systemRole;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(UUID id, String email, String fullName, String avatarUrl, String systemRole, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.systemRole = systemRole;
        this.createdAt = createdAt;
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getSystemRole() != null ? user.getSystemRole().name() : "ROLE_USER",
                user.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getSystemRole() {
        return systemRole;
    }

    public void setSystemRole(String systemRole) {
        this.systemRole = systemRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
