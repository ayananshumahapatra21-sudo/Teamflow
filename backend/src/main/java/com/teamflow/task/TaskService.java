package com.teamflow.task;

import com.teamflow.activity.ActivityLog;
import com.teamflow.activity.ActivityLogRepository;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.notification.NotificationService;
import com.teamflow.notification.NotificationType;
import com.teamflow.project.Project;
import com.teamflow.project.ProjectRepository;
import com.teamflow.security.SecurityUtils;
import com.teamflow.task.dto.CreateTaskRequest;
import com.teamflow.task.dto.TaskDto;
import com.teamflow.task.dto.UpdateTaskRequest;
import com.teamflow.task.dto.UpdateTaskStatusRequest;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository,
                       ActivityLogRepository activityLogRepository,
                       NotificationService notificationService,
                       SimpMessagingTemplate messagingTemplate) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public TaskDto createTask(CreateTaskRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Task task = new Task(
                request.getTitle().trim(),
                request.getDescription(),
                request.getStatus(),
                request.getPriority(),
                project,
                assignee,
                currentUser,
                request.getDueDate()
        );

        Task savedTask = taskRepository.save(task);

        // Audit Log
        ActivityLog log = new ActivityLog(
                project,
                currentUser,
                "CREATED_TASK",
                "TASK",
                savedTask.getId(),
                "Created task: " + savedTask.getTitle()
        );
        activityLogRepository.save(log);

        // Notify Assignee
        if (assignee != null && !assignee.getId().equals(currentUser.getId())) {
            notificationService.createAndSend(
                    assignee,
                    "New Task Assigned",
                    currentUser.getFullName() + " assigned you: " + savedTask.getTitle(),
                    NotificationType.TASK_ASSIGNED
            );
        }

        TaskDto dto = TaskDto.fromEntity(savedTask);
        broadcastProjectEvent(project.getId(), "TASK_CREATED", dto);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasks(UUID projectId, TaskStatus status, TaskPriority priority, UUID assigneeId, String search) {
        return taskRepository.findFilteredTasks(projectId, status, priority, assigneeId, search)
                .stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return TaskDto.fromEntity(task);
    }

    @Transactional
    public TaskDto updateTaskStatus(UUID taskId, UpdateTaskStatusRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getVersion() != null && !request.getVersion().equals(task.getVersion())) {
            throw new OptimisticLockingFailureException("Task was modified by another user concurrent update.");
        }

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);

        // Audit Log
        ActivityLog log = new ActivityLog(
                task.getProject(),
                currentUser,
                "MOVED_TASK",
                "TASK",
                task.getId(),
                "Moved task '" + task.getTitle() + "' from " + oldStatus + " to " + request.getStatus()
        );
        activityLogRepository.save(log);

        // Notify Assignee
        if (task.getAssignee() != null && !task.getAssignee().getId().equals(currentUser.getId())) {
            notificationService.createAndSend(
                    task.getAssignee(),
                    "Task Status Updated",
                    currentUser.getFullName() + " changed '" + task.getTitle() + "' to " + request.getStatus(),
                    NotificationType.STATUS_CHANGED
            );
        }

        TaskDto dto = TaskDto.fromEntity(updatedTask);
        broadcastProjectEvent(task.getProject().getId(), "TASK_UPDATED", dto);

        return dto;
    }

    @Transactional
    public TaskDto updateTask(UUID taskId, UpdateTaskRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getVersion() != null && !request.getVersion().equals(task.getVersion())) {
            throw new OptimisticLockingFailureException("Task was modified by another user concurrent update.");
        }

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);

        ActivityLog log = new ActivityLog(
                task.getProject(),
                currentUser,
                "UPDATED_TASK",
                "TASK",
                task.getId(),
                "Updated details for: " + task.getTitle()
        );
        activityLogRepository.save(log);

        TaskDto dto = TaskDto.fromEntity(updatedTask);
        broadcastProjectEvent(task.getProject().getId(), "TASK_UPDATED", dto);

        return dto;
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        UUID projectId = task.getProject().getId();
        String title = task.getTitle();

        ActivityLog log = new ActivityLog(
                task.getProject(),
                currentUser,
                "DELETED_TASK",
                "TASK",
                taskId,
                "Deleted task: " + title
        );
        activityLogRepository.save(log);

        taskRepository.delete(task);

        Map<String, Object> payload = new HashMap<>();
        payload.put("taskId", taskId);
        payload.put("action", "TASK_DELETED");
        broadcastProjectEvent(projectId, "TASK_DELETED", payload);
    }

    private void broadcastProjectEvent(UUID projectId, String action, Object data) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("action", action);
            message.put("projectId", projectId);
            message.put("data", data);
            messagingTemplate.convertAndSend("/topic/projects/" + projectId, message);
        } catch (Exception e) {
            // Non-blocking if WS is disconnected
        }
    }
}
