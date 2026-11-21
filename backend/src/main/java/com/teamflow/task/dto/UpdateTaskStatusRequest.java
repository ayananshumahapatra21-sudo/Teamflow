package com.teamflow.task.dto;

import com.teamflow.task.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTaskStatusRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    private Long version;

    public UpdateTaskStatusRequest() {
    }

    public UpdateTaskStatusRequest(TaskStatus status, Long version) {
        this.status = status;
        this.version = version;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
