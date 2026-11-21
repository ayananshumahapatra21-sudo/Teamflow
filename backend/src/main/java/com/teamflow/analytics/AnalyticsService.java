package com.teamflow.analytics;

import com.teamflow.activity.ActivityLogRepository;
import com.teamflow.activity.dto.ActivityLogDto;
import com.teamflow.analytics.dto.DashboardAnalyticsDto;
import com.teamflow.analytics.dto.ProjectAnalyticsDto;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.project.Project;
import com.teamflow.project.ProjectRepository;
import com.teamflow.security.SecurityUtils;
import com.teamflow.task.Task;
import com.teamflow.task.TaskPriority;
import com.teamflow.task.TaskRepository;
import com.teamflow.task.TaskStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;

    public AnalyticsService(ProjectRepository projectRepository,
                            TaskRepository taskRepository,
                            ActivityLogRepository activityLogRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional(readOnly = true)
    public DashboardAnalyticsDto getDashboardAnalytics() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<Project> userProjects = projectRepository.findAllByUserId(currentUserId);
        long totalProjects = userProjects.size();

        List<Task> allTasks = new ArrayList<>();
        for (Project p : userProjects) {
            allTasks.addAll(taskRepository.findByProjectIdOrderByCreatedAtDesc(p.getId()));
        }

        long totalTasks = allTasks.size();
        long completed = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long inProgress = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long todo = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long review = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.REVIEW).count();

        LocalDate today = LocalDate.now();
        long overdue = allTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today) && t.getStatus() != TaskStatus.DONE)
                .count();

        double completionRate = totalTasks > 0 ? ((double) completed / totalTasks) * 100.0 : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        Map<String, Long> priorityDistribution = new HashMap<>();
        for (TaskPriority p : TaskPriority.values()) {
            long count = allTasks.stream().filter(t -> t.getPriority() == p).count();
            priorityDistribution.put(p.name(), count);
        }

        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("TODO", todo);
        statusDistribution.put("IN_PROGRESS", inProgress);
        statusDistribution.put("REVIEW", review);
        statusDistribution.put("DONE", completed);

        List<ActivityLogDto> recentActivities = activityLogRepository.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(ActivityLogDto::fromEntity)
                .collect(Collectors.toList());

        return new DashboardAnalyticsDto(
                totalProjects,
                totalTasks,
                completed,
                inProgress,
                todo,
                review,
                overdue,
                completionRate,
                priorityDistribution,
                statusDistribution,
                recentActivities
        );
    }

    @Transactional(readOnly = true)
    public ProjectAnalyticsDto getProjectAnalytics(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        long total = tasks.size();
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long todo = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();

        LocalDate today = LocalDate.now();
        long overdue = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today) && t.getStatus() != TaskStatus.DONE)
                .count();

        double completionRate = total > 0 ? ((double) completed / total) * 100.0 : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        Map<String, Long> workload = new HashMap<>();
        for (Task t : tasks) {
            String assigneeName = t.getAssignee() != null ? t.getAssignee().getFullName() : "Unassigned";
            workload.put(assigneeName, workload.getOrDefault(assigneeName, 0L) + 1);
        }

        return new ProjectAnalyticsDto(
                project.getId(),
                project.getName(),
                total,
                completed,
                inProgress,
                todo,
                overdue,
                completionRate,
                workload
        );
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDto> getRecentActivities() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(ActivityLogDto::fromEntity)
                .collect(Collectors.toList());
    }
}
