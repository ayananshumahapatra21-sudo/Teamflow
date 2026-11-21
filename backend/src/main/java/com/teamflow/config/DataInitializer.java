package com.teamflow.config;

import com.teamflow.activity.ActivityLog;
import com.teamflow.activity.ActivityLogRepository;
import com.teamflow.comment.TaskComment;
import com.teamflow.comment.TaskCommentRepository;
import com.teamflow.notification.Notification;
import com.teamflow.notification.NotificationRepository;
import com.teamflow.notification.NotificationType;
import com.teamflow.project.Project;
import com.teamflow.project.ProjectMember;
import com.teamflow.project.ProjectMemberRepository;
import com.teamflow.project.ProjectRepository;
import com.teamflow.project.ProjectStatus;
import com.teamflow.task.Task;
import com.teamflow.task.TaskPriority;
import com.teamflow.task.TaskRepository;
import com.teamflow.task.TaskStatus;
import com.teamflow.team.Team;
import com.teamflow.team.TeamMember;
import com.teamflow.team.TeamMemberRepository;
import com.teamflow.team.TeamRepository;
import com.teamflow.team.TeamRole;
import com.teamflow.user.SystemRole;
import com.teamflow.user.User;
import com.teamflow.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository,
                           ProjectRepository projectRepository,
                           ProjectMemberRepository projectMemberRepository,
                           TaskRepository taskRepository,
                           TaskCommentRepository commentRepository,
                           ActivityLogRepository activityLogRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.activityLogRepository = activityLogRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Users
        User ayananshu = new User(
                "ayananshu@teamflow.io",
                passwordEncoder.encode("Password123!"),
                "Ayananshu (Lead Architect)",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=ayananshu",
                SystemRole.ROLE_ADMIN
        );
        User admin = new User(
                "admin@teamflow.io",
                passwordEncoder.encode("Password123!"),
                "Admin Lead",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                SystemRole.ROLE_ADMIN
        );
        User sarah = new User(
                "sarah@teamflow.io",
                passwordEncoder.encode("Password123!"),
                "Sarah Chen (PM)",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                SystemRole.ROLE_USER
        );
        User david = new User(
                "david@teamflow.io",
                passwordEncoder.encode("Password123!"),
                "David Miller (Dev)",
                "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
                SystemRole.ROLE_USER
        );

        ayananshu = userRepository.save(ayananshu);
        admin = userRepository.save(admin);
        sarah = userRepository.save(sarah);
        david = userRepository.save(david);

        // 2. Create Teams
        Team platformTeam = new Team("Ayananshu's Engineering Core", "Responsible for high-throughput distributed APIs, micro-frontends, and database engines", ayananshu);
        platformTeam = teamRepository.save(platformTeam);

        teamMemberRepository.save(new TeamMember(platformTeam, ayananshu, TeamRole.ADMIN));
        teamMemberRepository.save(new TeamMember(platformTeam, admin, TeamRole.ADMIN));
        teamMemberRepository.save(new TeamMember(platformTeam, sarah, TeamRole.MANAGER));
        teamMemberRepository.save(new TeamMember(platformTeam, david, TeamRole.MEMBER));

        Team productTeam = new Team("Product & UX Innovation", "Focused on client features, design systems and mobile responsiveness", sarah);
        productTeam = teamRepository.save(productTeam);
        teamMemberRepository.save(new TeamMember(productTeam, sarah, TeamRole.ADMIN));
        teamMemberRepository.save(new TeamMember(productTeam, ayananshu, TeamRole.MEMBER));

        // 3. Create Projects
        Project projectTF = new Project(
                "TeamFlow 2.0 Platform",
                "TF",
                "Enterprise Kanban system designed by Ayananshu with WebSocket real-time broadcast and optimistic concurrency",
                platformTeam,
                ayananshu,
                ProjectStatus.ACTIVE
        );
        projectTF = projectRepository.save(projectTF);
        projectMemberRepository.save(new ProjectMember(projectTF, ayananshu));
        projectMemberRepository.save(new ProjectMember(projectTF, admin));
        projectMemberRepository.save(new ProjectMember(projectTF, sarah));
        projectMemberRepository.save(new ProjectMember(projectTF, david));

        Project projectInfra = new Project(
                "Cloud Infra & Dockerization",
                "INFRA",
                "Containerized deployment manifests, PostgreSQL & Redis caching architecture",
                platformTeam,
                ayananshu,
                ProjectStatus.ACTIVE
        );
        projectInfra = projectRepository.save(projectInfra);
        projectMemberRepository.save(new ProjectMember(projectInfra, ayananshu));
        projectMemberRepository.save(new ProjectMember(projectInfra, david));

        // 4. Create Tasks
        LocalDate now = LocalDate.now();

        Task t1 = new Task(
                "Implement JWT Authentication & Refresh Token Rotation",
                "Configure Spring Security 6 filter chain with stateless Bearer token authentication and Redis session blacklist.",
                TaskStatus.DONE,
                TaskPriority.HIGH,
                projectTF,
                ayananshu,
                ayananshu,
                now.minusDays(2)
        );
        t1 = taskRepository.save(t1);

        Task t2 = new Task(
                "Build Interactive Kanban Drag-and-Drop Board",
                "Implement 4 columns: To Do, In Progress, Review, and Done with smooth drag and status update API integration.",
                TaskStatus.IN_PROGRESS,
                TaskPriority.URGENT,
                projectTF,
                david,
                sarah,
                now.plusDays(3)
        );
        t2 = taskRepository.save(t2);

        Task t3 = new Task(
                "WebSocket Real-time Broadcasts for Board Sync",
                "Setup STOMP broker over SockJS at /ws/teamflow to emit task movements to /topic/projects/{id}.",
                TaskStatus.REVIEW,
                TaskPriority.HIGH,
                projectTF,
                ayananshu,
                ayananshu,
                now.plusDays(1)
        );
        t3 = taskRepository.save(t3);

        Task t4 = new Task(
                "Optimistic Locking & Concurrency Control",
                "Add @Version column to prevent concurrent edit overwrites and display friendly collision toast alert.",
                TaskStatus.TODO,
                TaskPriority.MEDIUM,
                projectTF,
                david,
                sarah,
                now.plusDays(5)
        );
        t4 = taskRepository.save(t4);

        Task t5 = new Task(
                "Productivity & Burndown Analytics Dashboard",
                "Compute completion percentages, overdue items, priority breakdowns and individual workload distribution.",
                TaskStatus.TODO,
                TaskPriority.LOW,
                projectTF,
                sarah,
                ayananshu,
                now.plusDays(7)
        );
        t5 = taskRepository.save(t5);

        // 5. Create Comments
        commentRepository.save(new TaskComment(t2, sarah, "Great progress David! Make sure touch gestures are responsive for tablets."));
        commentRepository.save(new TaskComment(t2, david, "Almost finished with the drag handles; testing with mock data now."));
        commentRepository.save(new TaskComment(t3, ayananshu, "PR ready with STOMP broker configuration and CORS origins allowed."));

        // 6. Create Activity Logs
        activityLogRepository.save(new ActivityLog(projectTF, ayananshu, "CREATED_TASK", "TASK", t1.getId(), "Created task: " + t1.getTitle()));
        activityLogRepository.save(new ActivityLog(projectTF, ayananshu, "MOVED_TASK", "TASK", t1.getId(), "Moved task '" + t1.getTitle() + "' to DONE"));
        activityLogRepository.save(new ActivityLog(projectTF, sarah, "CREATED_TASK", "TASK", t2.getId(), "Assigned " + t2.getTitle() + " to David"));
        activityLogRepository.save(new ActivityLog(projectTF, david, "MOVED_TASK", "TASK", t2.getId(), "Moved task to IN_PROGRESS"));

        // 7. Create Notifications
        notificationRepository.save(new Notification(
                ayananshu,
                "Welcome to TeamFlow, Ayananshu!",
                "Your workspace 'Ayananshu's Engineering Core' and project 'TeamFlow 2.0' are ready.",
                NotificationType.PROJECT_INVITE
        ));
        notificationRepository.save(new Notification(
                ayananshu,
                "Task Reviewed",
                "David submitted 'Build Interactive Kanban Drag-and-Drop Board' for review.",
                NotificationType.STATUS_CHANGED
        ));
    }
}
