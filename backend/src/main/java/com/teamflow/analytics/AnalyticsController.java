package com.teamflow.analytics;

import com.teamflow.activity.dto.ActivityLogDto;
import com.teamflow.analytics.dto.DashboardAnalyticsDto;
import com.teamflow.analytics.dto.ProjectAnalyticsDto;
import com.teamflow.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Analytics", description = "Performance metrics, completion rates, workloads and activity streams")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level dashboard metrics for current user")
    public ResponseEntity<ApiResponse<DashboardAnalyticsDto>> getDashboardAnalytics() {
        DashboardAnalyticsDto analytics = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/projects/{projectId}")
    @Operation(summary = "Get detailed analytics and workload distribution for a project")
    public ResponseEntity<ApiResponse<ProjectAnalyticsDto>> getProjectAnalytics(@PathVariable UUID projectId) {
        ProjectAnalyticsDto analytics = analyticsService.getProjectAnalytics(projectId);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/activities")
    @Operation(summary = "Get global recent activity feed")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getRecentActivities() {
        List<ActivityLogDto> activities = analyticsService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success(activities));
    }
}
