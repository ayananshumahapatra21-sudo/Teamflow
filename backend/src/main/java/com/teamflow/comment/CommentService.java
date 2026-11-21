package com.teamflow.comment;

import com.teamflow.activity.ActivityLog;
import com.teamflow.activity.ActivityLogRepository;
import com.teamflow.comment.dto.CommentDto;
import com.teamflow.comment.dto.CreateCommentRequest;
import com.teamflow.common.ResourceNotFoundException;
import com.teamflow.notification.NotificationService;
import com.teamflow.notification.NotificationType;
import com.teamflow.security.SecurityUtils;
import com.teamflow.task.Task;
import com.teamflow.task.TaskRepository;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final TaskCommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public CommentService(TaskCommentRepository commentRepository,
                          TaskRepository taskRepository,
                          UserRepository userRepository,
                          ActivityLogRepository activityLogRepository,
                          NotificationService notificationService,
                          SimpMessagingTemplate messagingTemplate) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public CommentDto addComment(UUID taskId, CreateCommentRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        TaskComment comment = new TaskComment(task, currentUser, request.getContent().trim());
        TaskComment saved = commentRepository.save(comment);

        // Activity Log
        ActivityLog log = new ActivityLog(
                task.getProject(),
                currentUser,
                "COMMENTED",
                "COMMENT",
                saved.getId(),
                "Added a comment to task: " + task.getTitle()
        );
        activityLogRepository.save(log);

        // Notify Assignee or Creator if not the commenter
        User recipient = task.getAssignee() != null ? task.getAssignee() : task.getCreatedBy();
        if (recipient != null && !recipient.getId().equals(currentUser.getId())) {
            notificationService.createAndSend(
                    recipient,
                    "New Comment on Task",
                    currentUser.getFullName() + " commented on '" + task.getTitle() + "'",
                    NotificationType.COMMENT_ADDED
            );
        }

        CommentDto dto = CommentDto.fromEntity(saved);

        // Broadcast comment event to WS subscribers
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("action", "COMMENT_ADDED");
            payload.put("taskId", taskId);
            payload.put("comment", dto);
            messagingTemplate.convertAndSend("/topic/projects/" + task.getProject().getId(), payload);
        } catch (Exception ignored) {
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByTaskId(UUID taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }
}
