# TeamFlow REST & WebSocket API Specification

Base URL: `/api/v1`

All secured endpoints require HTTP header:
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication (`/api/v1/auth`)

### `POST /auth/register`
Creates a new account and returns initial tokens with user profile.
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```
- **Response**: `201 Created`
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "d8e3b2...",
  "tokenType": "Bearer",
  "user": {
    "id": "c1f7a0...",
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### `POST /auth/login`
Authenticates credentials.
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```
- **Response**: `200 OK` (Same schema as register)

---

## 2. Teams (`/api/v1/teams`)

### `GET /teams`
Returns teams the authenticated user belongs to.

### `POST /teams`
Create a new team workspace.
```json
{
  "name": "Frontend Engineering",
  "description": "Core frontend UI & UX team"
}
```

### `POST /teams/{teamId}/members`
Add member to team with role (`ADMIN`, `MANAGER`, `MEMBER`).
```json
{
  "userEmail": "alex@example.com",
  "role": "MEMBER"
}
```

---

## 3. Projects (`/api/v1/projects`)

### `GET /projects` or `GET /teams/{teamId}/projects`
List projects accessible to user.

### `POST /projects`
Create project inside a team.
```json
{
  "teamId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "name": "Mobile Redesign",
  "key": "MOB",
  "description": "Revamp mobile responsive UX and animations"
}
```

### `GET /projects/{id}`
Returns project details, member list, and task metrics.

---

## 4. Tasks (`/api/v1/tasks`)

### `GET /projects/{projectId}/tasks`
Query parameters: `?status=IN_PROGRESS&priority=HIGH&search=login`
Returns task list for Kanban board or list view.

### `POST /tasks`
Create a new task.
```json
{
  "projectId": "8a32d1...",
  "title": "Implement OAuth2 Social Login",
  "description": "Integrate Google and GitHub sign-in via Spring Security",
  "status": "TODO",
  "priority": "HIGH",
  "assigneeId": "c1f7a0...",
  "dueDate": "2026-12-05"
}
```

### `PATCH /tasks/{id}/status`
Optimized quick status change for Kanban drag-and-drop.
```json
{
  "status": "IN_PROGRESS",
  "version": 1
}
```

### `PUT /tasks/{id}`
Full task update with optimistic locking guard.

### `DELETE /tasks/{id}`
Deletes or archives task.

---

## 5. Comments & Activity (`/api/v1/tasks/{taskId}/comments`)

### `GET /tasks/{taskId}/comments`
Get discussion thread.

### `POST /tasks/{taskId}/comments`
Add comment:
```json
{
  "content": "PR is ready for review at #42."
}
```

---

## 6. Analytics (`/api/v1/analytics`)

### `GET /analytics/dashboard`
Returns aggregated metrics for the current user and their teams:
- Total projects
- Total tasks, completed, in-progress, overdue
- Completion rate percentage
- Task distribution by priority and status
- Team workload breakdown

---

## 7. WebSocket STOMP Endpoints

- **Connection URL**: `/ws/teamflow`
- **Topic Subscription**: `/topic/projects/{projectId}`
  - Broadcasts payload on any task status movement, creation, or update so other team members' boards update instantly without page refresh!
- **User Queue**: `/user/queue/notifications`
  - Delivers direct push alerts when a user is assigned a task or mentioned.
