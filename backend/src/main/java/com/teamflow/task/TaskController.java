package com.teamflow.task;

import com.teamflow.common.ApiResponse;
import com.teamflow.task.dto.CreateTaskRequest;
import com.teamflow.task.dto.TaskDto;
import com.teamflow.task.dto.UpdateTaskRequest;
import com.teamflow.task.dto.UpdateTaskStatusRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "Task management, filtering and Kanban movements")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto task = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", task), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get filtered tasks by project, status, priority, assignee or search query")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasks(
            @RequestParam UUID projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) UUID assigneeId,
            @RequestParam(required = false) String search) {
        List<TaskDto> tasks = taskService.getTasks(projectId, status, priority, assigneeId, search);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single task details")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(@PathVariable UUID id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status for Kanban board drag & drop movements")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(@PathVariable UUID id,
                                                             @Valid @RequestBody UpdateTaskStatusRequest request) {
        TaskDto task = taskService.updateTaskStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Status updated", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task details with optimistic concurrency check")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(@PathVariable UUID id,
                                                           @Valid @RequestBody UpdateTaskRequest request) {
        TaskDto task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
