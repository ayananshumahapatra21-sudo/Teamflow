package com.teamflow.team;

import com.teamflow.common.ApiResponse;
import com.teamflow.team.dto.AddTeamMemberRequest;
import com.teamflow.team.dto.CreateTeamRequest;
import com.teamflow.team.dto.TeamDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
@Tag(name = "Teams", description = "Team workspaces and member management")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    @Operation(summary = "Create a new team workspace")
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        TeamDto team = teamService.createTeam(request);
        return new ResponseEntity<>(ApiResponse.success("Team created successfully", team), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all teams the current user belongs to")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getCurrentUserTeams() {
        List<TeamDto> teams = teamService.getCurrentUserTeams();
        return ResponseEntity.ok(ApiResponse.success(teams));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team details by id")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamById(@PathVariable UUID id) {
        TeamDto team = teamService.getTeamById(id);
        return ResponseEntity.ok(ApiResponse.success(team));
    }

    @PostMapping("/{id}/members")
    @Operation(summary = "Invite or add a member to the team")
    public ResponseEntity<ApiResponse<TeamDto>> addMember(@PathVariable UUID id,
                                                          @Valid @RequestBody AddTeamMemberRequest request) {
        TeamDto team = teamService.addMemberToTeam(id, request);
        return ResponseEntity.ok(ApiResponse.success("Member added successfully", team));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @Operation(summary = "Remove a member from the team")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable UUID id,
                                                          @PathVariable UUID userId) {
        teamService.removeMemberFromTeam(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully", null));
    }
}
