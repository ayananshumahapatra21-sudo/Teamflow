// Realistic mock state store for static hosts (GitHub Pages) and offline demo mode
const INITIAL_USERS = [
  {
    id: 'usr-1',
    email: 'ayananshu@teamflow.io',
    fullName: 'Ayananshu (Lead Architect)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ayananshu',
    systemRole: 'ROLE_ADMIN',
  },
  {
    id: 'usr-2',
    email: 'sarah@teamflow.io',
    fullName: 'Sarah Chen (PM)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    systemRole: 'ROLE_USER',
  },
  {
    id: 'usr-3',
    email: 'david@teamflow.io',
    fullName: 'David Miller (Dev)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    systemRole: 'ROLE_USER',
  },
  {
    id: 'usr-4',
    email: 'admin@teamflow.io',
    fullName: 'Ayananshu (Lead Admin)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ayananshu',
    systemRole: 'ROLE_ADMIN',
  }
];

const INITIAL_TEAMS = [
  {
    id: 'team-1',
    name: "Ayananshu's Engineering Core",
    description: "High-throughput distributed APIs, micro-frontends, and database engines",
    owner: INITIAL_USERS[0],
    members: [
      { id: 'tm-1', user: INITIAL_USERS[0], role: 'ADMIN', joinedAt: new Date().toISOString() },
      { id: 'tm-2', user: INITIAL_USERS[1], role: 'MANAGER', joinedAt: new Date().toISOString() },
      { id: 'tm-3', user: INITIAL_USERS[2], role: 'MEMBER', joinedAt: new Date().toISOString() },
    ]
  },
  {
    id: 'team-2',
    name: "Product & UX Innovation",
    description: "Client features, design systems and mobile responsiveness",
    owner: INITIAL_USERS[1],
    members: [
      { id: 'tm-4', user: INITIAL_USERS[1], role: 'ADMIN', joinedAt: new Date().toISOString() },
      { id: 'tm-5', user: INITIAL_USERS[0], role: 'MEMBER', joinedAt: new Date().toISOString() },
    ]
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    description: 'Enterprise Kanban system designed by Ayananshu with WebSocket real-time broadcast and optimistic concurrency',
    teamId: 'team-1',
    teamName: "Ayananshu's Engineering Core",
    owner: INITIAL_USERS[0],
    status: 'ACTIVE',
    members: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2]],
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-2',
    name: 'Cloud Infra & Dockerization',
    projectKey: 'INFRA',
    description: 'Containerized deployment manifests, PostgreSQL & Redis caching architecture',
    teamId: 'team-1',
    teamName: "Ayananshu's Engineering Core",
    owner: INITIAL_USERS[0],
    status: 'ACTIVE',
    members: [INITIAL_USERS[0], INITIAL_USERS[2]],
    createdAt: new Date().toISOString()
  }
];

const now = new Date();
const today = now.toISOString().split('T')[0];
const in3Days = new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0];
const in5Days = new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0];
const in7Days = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];
const pastDue = new Date(now.getTime() - 2 * 86400000).toISOString().split('T')[0];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Implement JWT Authentication & Refresh Token Rotation',
    description: 'Configure Spring Security 6 filter chain with stateless Bearer token authentication and Redis session blacklist.',
    status: 'DONE',
    priority: 'HIGH',
    projectId: 'proj-1',
    projectName: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    assignee: INITIAL_USERS[0],
    createdBy: INITIAL_USERS[0],
    dueDate: pastDue,
    version: 0,
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Build Interactive Kanban Drag-and-Drop Board',
    description: 'Implement 4 columns: To Do, In Progress, Review, and Done with smooth drag and status update API integration.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    projectId: 'proj-1',
    projectName: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    assignee: INITIAL_USERS[2],
    createdBy: INITIAL_USERS[1],
    dueDate: in3Days,
    version: 1,
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'WebSocket Real-time Broadcasts for Board Sync',
    description: 'Setup STOMP broker over SockJS at /ws/teamflow to emit task movements to /topic/projects/{id}.',
    status: 'REVIEW',
    priority: 'HIGH',
    projectId: 'proj-1',
    projectName: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    assignee: INITIAL_USERS[0],
    createdBy: INITIAL_USERS[0],
    dueDate: in5Days,
    version: 0,
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Optimistic Locking & Concurrency Control',
    description: 'Add @Version column to prevent concurrent edit overwrites and display friendly collision toast alert.',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: 'proj-1',
    projectName: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    assignee: INITIAL_USERS[2],
    createdBy: INITIAL_USERS[1],
    dueDate: in7Days,
    version: 0,
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'Productivity & Burndown Analytics Dashboard',
    description: 'Compute completion percentages, overdue items, priority breakdowns and individual workload distribution.',
    status: 'TODO',
    priority: 'LOW',
    projectId: 'proj-1',
    projectName: 'TeamFlow 2.0 Platform',
    projectKey: 'TF',
    assignee: INITIAL_USERS[1],
    createdBy: INITIAL_USERS[0],
    dueDate: in7Days,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_COMMENTS = [
  {
    id: 'comm-1',
    taskId: 'task-2',
    user: INITIAL_USERS[1],
    content: 'Great progress David! Make sure touch gestures are responsive for tablets.',
    createdAt: new Date(now.getTime() - 3600000).toISOString()
  },
  {
    id: 'comm-2',
    taskId: 'task-2',
    user: INITIAL_USERS[2],
    content: 'Almost finished with the drag handles; testing with mock data now.',
    createdAt: new Date(now.getTime() - 1800000).toISOString()
  },
  {
    id: 'comm-3',
    taskId: 'task-3',
    user: INITIAL_USERS[0],
    content: 'PR ready with STOMP broker configuration and CORS origins allowed.',
    createdAt: new Date(now.getTime() - 900000).toISOString()
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    projectId: 'proj-1',
    user: INITIAL_USERS[0],
    action: 'CREATED_TASK',
    entityType: 'TASK',
    entityId: 'task-1',
    details: 'Created task: Implement JWT Authentication & Refresh Token Rotation',
    createdAt: new Date(now.getTime() - 4 * 86400000).toISOString()
  },
  {
    id: 'act-2',
    projectId: 'proj-1',
    user: INITIAL_USERS[0],
    action: 'MOVED_TASK',
    entityType: 'TASK',
    entityId: 'task-1',
    details: "Moved task 'Implement JWT Authentication & Refresh Token Rotation' to DONE",
    createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
  },
  {
    id: 'act-3',
    projectId: 'proj-1',
    user: INITIAL_USERS[1],
    action: 'CREATED_TASK',
    entityType: 'TASK',
    entityId: 'task-2',
    details: 'Assigned Build Interactive Kanban Drag-and-Drop Board to David',
    createdAt: new Date(now.getTime() - 86400000).toISOString()
  },
  {
    id: 'act-4',
    projectId: 'proj-1',
    user: INITIAL_USERS[2],
    action: 'MOVED_TASK',
    entityType: 'TASK',
    entityId: 'task-2',
    details: 'Moved task to IN_PROGRESS',
    createdAt: new Date(now.getTime() - 1800000).toISOString()
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to TeamFlow, Ayananshu!',
    message: "Your workspace 'Ayananshu's Engineering Core' and project 'TeamFlow 2.0' are ready.",
    type: 'PROJECT_INVITE',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    title: 'Task Reviewed',
    message: "David submitted 'Build Interactive Kanban Drag-and-Drop Board' for review.",
    type: 'STATUS_CHANGED',
    read: false,
    createdAt: new Date(now.getTime() - 1800000).toISOString()
  }
];

// Helper to load or init local storage data
const getStore = (key, fallback) => {
  try {
    const item = localStorage.getItem(`tf_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStore = (key, value) => {
  try {
    localStorage.setItem(`tf_${key}`, JSON.stringify(value));
  } catch (e) {}
};

export const mockStore = {
  // Auth
  login: (email, password) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    let found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      // Default to Ayananshu or generic user
      found = {
        id: 'usr-custom-' + Date.now(),
        email: cleanEmail,
        fullName: cleanEmail.includes('ayananshu') ? 'Ayananshu (Lead Architect)' : cleanEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        systemRole: 'ROLE_ADMIN'
      };
    }
    const token = 'mock-jwt-token-' + Date.now();
    return { data: { accessToken: token, refreshToken: token, user: found } };
  },

  register: (fullName, email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.toLowerCase().trim(),
      fullName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.toLowerCase().trim()}`,
      systemRole: 'ROLE_USER'
    };
    const token = 'mock-jwt-token-' + Date.now();
    return { data: { accessToken: token, refreshToken: token, user: newUser } };
  },

  // Teams
  getTeams: () => {
    return { data: getStore('teams', INITIAL_TEAMS) };
  },

  getTeamById: (id) => {
    const teams = getStore('teams', INITIAL_TEAMS);
    const team = teams.find((t) => t.id === id) || teams[0];
    return { data: team };
  },

  createTeam: (name, description) => {
    const teams = getStore('teams', INITIAL_TEAMS);
    const newTeam = {
      id: 'team-' + Date.now(),
      name,
      description,
      owner: INITIAL_USERS[0],
      members: [{ id: 'tm-' + Date.now(), user: INITIAL_USERS[0], role: 'ADMIN', joinedAt: new Date().toISOString() }]
    };
    teams.push(newTeam);
    setStore('teams', teams);
    return { data: newTeam };
  },

  addMember: (teamId, email, role) => {
    const teams = getStore('teams', INITIAL_TEAMS);
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const user = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 'usr-' + Date.now(),
        email,
        fullName: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      team.members.push({ id: 'tm-' + Date.now(), user, role, joinedAt: new Date().toISOString() });
      setStore('teams', teams);
      return { data: team };
    }
    return { data: teams[0] };
  },

  removeMember: (teamId, userId) => {
    const teams = getStore('teams', INITIAL_TEAMS);
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      team.members = team.members.filter((m) => m.user.id !== userId);
      setStore('teams', teams);
    }
    return { data: null };
  },

  // Projects
  getProjects: () => {
    return { data: getStore('projects', INITIAL_PROJECTS) };
  },

  getProjectById: (id) => {
    const projects = getStore('projects', INITIAL_PROJECTS);
    const project = projects.find((p) => p.id === id) || projects[0];
    return { data: project };
  },

  createProject: (teamId, name, projectKey, description) => {
    const projects = getStore('projects', INITIAL_PROJECTS);
    const newProj = {
      id: 'proj-' + Date.now(),
      name,
      projectKey: projectKey.toUpperCase(),
      description,
      teamId,
      teamName: "Ayananshu's Engineering Core",
      owner: INITIAL_USERS[0],
      status: 'ACTIVE',
      members: [INITIAL_USERS[0]],
      createdAt: new Date().toISOString()
    };
    projects.unshift(newProj);
    setStore('projects', projects);
    return { data: newProj };
  },

  // Tasks
  getTasks: (projectId, params = {}) => {
    let tasks = getStore('tasks', INITIAL_TASKS);
    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId);
    }
    if (params.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }
    if (params.priority) {
      tasks = tasks.filter((t) => t.priority === params.priority);
    }
    if (params.assigneeId) {
      tasks = tasks.filter((t) => t.assignee?.id === params.assigneeId);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter((t) => (t.title && t.title.toLowerCase().includes(q)) || (t.description && t.description.toLowerCase().includes(q)));
    }
    return { data: tasks };
  },

  createTask: (taskData) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      projectId: taskData.projectId,
      projectKey: 'TF',
      assignee: taskData.assigneeId ? INITIAL_USERS.find((u) => u.id === taskData.assigneeId) || INITIAL_USERS[0] : null,
      createdBy: INITIAL_USERS[0],
      dueDate: taskData.dueDate || null,
      version: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    setStore('tasks', tasks);
    return { data: newTask };
  },

  updateTaskStatus: (id, status, version) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.version = (task.version || 0) + 1;
      task.updatedAt = new Date().toISOString();
      setStore('tasks', tasks);
      return { data: task };
    }
    return { data: null };
  },

  updateTask: (id, taskData) => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.title = taskData.title;
      task.description = taskData.description;
      task.status = taskData.status;
      task.priority = taskData.priority;
      task.dueDate = taskData.dueDate;
      if (taskData.assigneeId) {
        task.assignee = INITIAL_USERS.find((u) => u.id === taskData.assigneeId) || null;
      }
      task.version = (task.version || 0) + 1;
      task.updatedAt = new Date().toISOString();
      setStore('tasks', tasks);
      return { data: task };
    }
    return { data: null };
  },

  deleteTask: (id) => {
    let tasks = getStore('tasks', INITIAL_TASKS);
    tasks = tasks.filter((t) => t.id !== id);
    setStore('tasks', tasks);
    return { data: null };
  },

  // Comments
  getComments: (taskId) => {
    const comments = getStore('comments', INITIAL_COMMENTS);
    return { data: comments.filter((c) => c.taskId === taskId) };
  },

  addComment: (taskId, content) => {
    const comments = getStore('comments', INITIAL_COMMENTS);
    const newComment = {
      id: 'comm-' + Date.now(),
      taskId,
      user: INITIAL_USERS[0],
      content,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    setStore('comments', comments);
    return { data: newComment };
  },

  // Analytics
  getDashboardAnalytics: () => {
    const tasks = getStore('tasks', INITIAL_TASKS);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
    const reviewTasks = tasks.filter((t) => t.status === 'REVIEW').length;
    const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== 'DONE').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 1000) / 10 : 0;

    return {
      data: {
        totalProjects: 2,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        reviewTasks,
        overdueTasks,
        completionRate,
        priorityDistribution: {
          URGENT: tasks.filter((t) => t.priority === 'URGENT').length,
          HIGH: tasks.filter((t) => t.priority === 'HIGH').length,
          MEDIUM: tasks.filter((t) => t.priority === 'MEDIUM').length,
          LOW: tasks.filter((t) => t.priority === 'LOW').length,
        },
        statusDistribution: {
          TODO: todoTasks,
          IN_PROGRESS: inProgressTasks,
          REVIEW: reviewTasks,
          DONE: completedTasks,
        },
        recentActivities: getStore('activities', INITIAL_ACTIVITIES)
      }
    };
  },

  getProjectAnalytics: (projectId) => {
    const tasks = getStore('tasks', INITIAL_TASKS).filter((t) => t.projectId === projectId);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'DONE').length;
    const workload = {};
    tasks.forEach((t) => {
      const name = t.assignee?.fullName || 'Unassigned';
      workload[name] = (workload[name] || 0) + 1;
    });

    return {
      data: {
        projectId,
        projectName: 'TeamFlow 2.0 Platform',
        totalTasks: total,
        completedTasks: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
        workloadByMember: workload
      }
    };
  },

  // Notifications
  getNotifications: () => {
    return { data: getStore('notifications', INITIAL_NOTIFICATIONS) };
  },

  markAsRead: (id) => {
    const notifs = getStore('notifications', INITIAL_NOTIFICATIONS);
    const found = notifs.find((n) => n.id === id);
    if (found) found.read = true;
    setStore('notifications', notifs);
    return { data: null };
  },

  markAllAsRead: () => {
    const notifs = getStore('notifications', INITIAL_NOTIFICATIONS);
    notifs.forEach((n) => (n.read = true));
    setStore('notifications', notifs);
    return { data: null };
  }
};
