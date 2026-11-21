package com.teamflow.analytics.dto;

import com.teamflow.activity.dto.ActivityLogDto;

import java.util.List;
import java.util.Map;

public class DashboardAnalyticsDto {

    private long totalProjects;
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
    private long reviewTasks;
    private long overdueTasks;
    private double completionRate;
    private Map<String, Long> priorityDistribution;
    private Map<String, Long> statusDistribution;
    private List<ActivityLogDto> recentActivities;

    public DashboardAnalyticsDto() {
    }

    public DashboardAnalyticsDto(long totalProjects, long totalTasks, long completedTasks,
                                 long inProgressTasks, long todoTasks, long reviewTasks,
                                 long overdueTasks, double completionRate,
                                 Map<String, Long> priorityDistribution,
                                 Map<String, Long> statusDistribution,
                                 List<ActivityLogDto> recentActivities) {
        this.totalProjects = totalProjects;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.todoTasks = todoTasks;
        this.reviewTasks = reviewTasks;
        this.overdueTasks = overdueTasks;
        this.completionRate = completionRate;
        this.priorityDistribution = priorityDistribution;
        this.statusDistribution = statusDistribution;
        this.recentActivities = recentActivities;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public void setTodoTasks(long todoTasks) {
        this.todoTasks = todoTasks;
    }

    public long getReviewTasks() {
        return reviewTasks;
    }

    public void setReviewTasks(long reviewTasks) {
        this.reviewTasks = reviewTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public Map<String, Long> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(Map<String, Long> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<ActivityLogDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityLogDto> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
