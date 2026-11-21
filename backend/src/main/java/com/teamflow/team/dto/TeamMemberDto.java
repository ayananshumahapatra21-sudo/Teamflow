package com.teamflow.team.dto;

import com.teamflow.team.TeamMember;
import com.teamflow.user.UserDto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TeamMemberDto {

    private UUID id;
    private UserDto user;
    private String role;
    private LocalDateTime joinedAt;

    public TeamMemberDto() {
    }

    public TeamMemberDto(UUID id, UserDto user, String role, LocalDateTime joinedAt) {
        this.id = id;
        this.user = user;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public static TeamMemberDto fromEntity(TeamMember member) {
        if (member == null) return null;
        return new TeamMemberDto(
                member.getId(),
                UserDto.fromEntity(member.getUser()),
                member.getRole() != null ? member.getRole().name() : "MEMBER",
                member.getJoinedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
