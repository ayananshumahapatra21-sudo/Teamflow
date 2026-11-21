package com.teamflow.project;

import com.teamflow.common.ApiResponse;
import com.teamflow.project.dto.CreateProjectRequest;
import com.teamflow.project.dto.ProjectDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "Project creation and workspaces")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDto project = projectService.createProject(request);
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", project), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all projects for current user")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getCurrentUserProjects() {
        List<ProjectDto> projects = projectService.getCurrentUserProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "Get all projects in a specific team")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByTeamId(@PathVariable UUID teamId) {
        List<ProjectDto> projects = projectService.getProjectsByTeamId(teamId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by id")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable UUID id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping("/{id}/members/{userId}")
    @Operation(summary = "Add user to project")
    public ResponseEntity<ApiResponse<ProjectDto>> addMember(@PathVariable UUID id, @PathVariable UUID userId) {
        ProjectDto project = projectService.addMemberToProject(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Member added to project", project));
    }
}
