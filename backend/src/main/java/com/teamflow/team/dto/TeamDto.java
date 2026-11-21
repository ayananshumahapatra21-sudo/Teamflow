package com.teamflow.team.dto;

import com.teamflow.team.Team;
import com.teamflow.user.UserDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class TeamDto {

    private UUID id;
    private String name;
    private String description;
    private UserDto owner;
    private List<TeamMemberDto> members;
    private int memberCount;
    private LocalDateTime createdAt;

    public TeamDto() {
    }

    public TeamDto(UUID id, String name, String description, UserDto owner, List<TeamMemberDto> members, int memberCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.members = members;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
    }

    public static TeamDto fromEntity(Team team) {
        if (team == null) return null;
        List<TeamMemberDto> memberDtos = team.getMembers() != null
                ? team.getMembers().stream().map(TeamMemberDto::fromEntity).collect(Collectors.toList())
                : List.of();

        return new TeamDto(
                team.getId(),
                team.getName(),
                team.getDescription(),
                UserDto.fromEntity(team.getOwner()),
                memberDtos,
                memberDtos.size(),
                team.getCreatedAt()
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserDto getOwner() {
        return owner;
    }

    public void setOwner(UserDto owner) {
        this.owner = owner;
    }

    public List<TeamMemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberDto> members) {
        this.members = members;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
