package com.teamflow.team.dto;

import com.teamflow.team.TeamRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddTeamMemberRequest {

    @NotBlank(message = "User email is required")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotNull(message = "Role is required")
    private TeamRole role = TeamRole.MEMBER;

    public AddTeamMemberRequest() {
    }

    public AddTeamMemberRequest(String email, TeamRole role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TeamRole getRole() {
        return role;
    }

    public void setRole(TeamRole role) {
        this.role = role;
    }
}
