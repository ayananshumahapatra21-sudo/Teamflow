package com.teamflow.analytics.dto;

import java.util.Map;
import java.util.UUID;

public class ProjectAnalyticsDto {

    private UUID projectId;
    private String projectName;
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
    private long overdueTasks;
    private double completionRate;
    private Map<String, Long> workloadByMember;

    public ProjectAnalyticsDto() {
    }

    public ProjectAnalyticsDto(UUID projectId, String projectName, long totalTasks,
                               long completedTasks, long inProgressTasks, long todoTasks,
                               long overdueTasks, double completionRate,
                               Map<String, Long> workloadByMember) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.todoTasks = todoTasks;
        this.overdueTasks = overdueTasks;
        this.completionRate = completionRate;
        this.workloadByMember = workloadByMember;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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

    public Map<String, Long> getWorkloadByMember() {
        return workloadByMember;
    }

    public void setWorkloadByMember(Map<String, Long> workloadByMember) {
        this.workloadByMember = workloadByMember;
    }
}
