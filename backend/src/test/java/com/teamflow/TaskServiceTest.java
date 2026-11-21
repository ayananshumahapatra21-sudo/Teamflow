package com.teamflow;

import com.teamflow.activity.ActivityLogRepository;
import com.teamflow.notification.NotificationService;
import com.teamflow.project.Project;
import com.teamflow.project.ProjectRepository;
import com.teamflow.project.ProjectStatus;
import com.teamflow.security.UserPrincipal;
import com.teamflow.task.*;
import com.teamflow.task.dto.CreateTaskRequest;
import com.teamflow.task.dto.TaskDto;
import com.teamflow.task.dto.UpdateTaskStatusRequest;
import com.teamflow.team.Team;
import com.teamflow.user.SystemRole;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TaskService taskService;

    private User currentUser;
    private Project sampleProject;
    private Task sampleTask;

    @BeforeEach
    void setUp() {
        currentUser = new User("admin@teamflow.io", "pass", "Admin User", null, SystemRole.ROLE_ADMIN);
        currentUser.setId(UUID.randomUUID());

        UserPrincipal principal = UserPrincipal.create(currentUser);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Team team = new Team("Engineering", "Dev team", currentUser);
        sampleProject = new Project("Mobile App", "MOB", "Description", team, currentUser, ProjectStatus.ACTIVE);
        sampleProject.setId(UUID.randomUUID());

        sampleTask = new Task("Test Task", "Details", TaskStatus.TODO, TaskPriority.HIGH, sampleProject, null, currentUser, LocalDate.now());
        sampleTask.setId(UUID.randomUUID());
        sampleTask.setVersion(0L);
    }

    @Test
    void createTask_Success() {
        CreateTaskRequest request = new CreateTaskRequest(
                sampleProject.getId(),
                "New Task",
                "Description",
                TaskStatus.TODO,
                TaskPriority.HIGH,
                null,
                LocalDate.now()
        );

        when(userRepository.findById(currentUser.getId())).thenReturn(Optional.of(currentUser));
        when(projectRepository.findById(sampleProject.getId())).thenReturn(Optional.of(sampleProject));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskDto result = taskService.createTask(request);

        assertNotNull(result);
        assertEquals(sampleTask.getTitle(), result.getTitle());
        verify(activityLogRepository, times(1)).save(any());
    }

    @Test
    void updateTaskStatus_Success() {
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest(TaskStatus.IN_PROGRESS, 0L);

        when(userRepository.findById(currentUser.getId())).thenReturn(Optional.of(currentUser));
        when(taskRepository.findById(sampleTask.getId())).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskDto result = taskService.updateTaskStatus(sampleTask.getId(), request);

        assertNotNull(result);
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    void updateTaskStatus_OptimisticLockingCollision_ThrowsException() {
        // Version mismatch: requested version is 0L but current task version in DB is 1L
        sampleTask.setVersion(1L);
        UpdateTaskStatusRequest staleRequest = new UpdateTaskStatusRequest(TaskStatus.DONE, 0L);

        when(userRepository.findById(currentUser.getId())).thenReturn(Optional.of(currentUser));
        when(taskRepository.findById(sampleTask.getId())).thenReturn(Optional.of(sampleTask));

        assertThrows(OptimisticLockingFailureException.class, () ->
                taskService.updateTaskStatus(sampleTask.getId(), staleRequest));

        verify(taskRepository, never()).save(any());
    }
}
