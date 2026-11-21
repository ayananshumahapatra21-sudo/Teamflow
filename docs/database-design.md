# TeamFlow Database Design

## 1. Relational Schema & Entities

The relational database schema is structured for 3NF normalization, referential integrity via foreign keys, cascading where appropriate, and indexing on frequently queried columns.

### Tables Specification

#### 1. `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User login email |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `full_name` | VARCHAR(120) | NOT NULL | Display name |
| `avatar_url` | VARCHAR(512) | NULL | User avatar image URL |
| `system_role` | VARCHAR(32) | NOT NULL | Default `ROLE_USER` / `ROLE_ADMIN` |
| `created_at` | TIMESTAMP | NOT NULL | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |

#### 2. `teams`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique team identifier |
| `name` | VARCHAR(120) | NOT NULL | Team name |
| `description` | TEXT | NULL | Team description |
| `owner_id` | UUID | NOT NULL, FK -> `users(id)` | Team creator/owner |
| `created_at` | TIMESTAMP | NOT NULL | Created date |

#### 3. `team_members`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Membership record ID |
| `team_id` | UUID | NOT NULL, FK -> `teams(id)` | Associated team |
| `user_id` | UUID | NOT NULL, FK -> `users(id)` | Associated member |
| `role` | VARCHAR(32) | NOT NULL | `ADMIN`, `MANAGER`, `MEMBER` |
| `joined_at` | TIMESTAMP | NOT NULL | Timestamp when joined |

#### 4. `projects`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique project identifier |
| `name` | VARCHAR(120) | NOT NULL | Project title |
| `project_key` | VARCHAR(10) | NOT NULL, UNIQUE | Short identifier (e.g. `TF`) |
| `description` | TEXT | NULL | Project objective |
| `team_id` | UUID | NOT NULL, FK -> `teams(id)` | Parent team |
| `owner_id` | UUID | NOT NULL, FK -> `users(id)` | Project lead |
| `status` | VARCHAR(32) | NOT NULL | `ACTIVE`, `ARCHIVED`, `COMPLETED` |
| `created_at` | TIMESTAMP | NOT NULL | Created date |

#### 5. `tasks`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Unique task identifier |
| `title` | VARCHAR(255) | NOT NULL | Task summary |
| `description` | TEXT | NULL | Rich markdown description |
| `status` | VARCHAR(32) | NOT NULL | `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE` |
| `priority` | VARCHAR(32) | NOT NULL | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `project_id` | UUID | NOT NULL, FK -> `projects(id)` | Project association |
| `assignee_id` | UUID | NULL, FK -> `users(id)` | Assigned user |
| `created_by` | UUID | NOT NULL, FK -> `users(id)` | Task creator |
| `due_date` | DATE | NULL | Deadline |
| `version` | BIGINT | NOT NULL, DEFAULT 0 | Optimistic concurrency locking |
| `created_at` | TIMESTAMP | NOT NULL | Creation date |
| `updated_at` | TIMESTAMP | NOT NULL | Modification date |

#### 6. `task_comments`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Comment identifier |
| `task_id` | UUID | NOT NULL, FK -> `tasks(id)` | Parent task |
| `user_id` | UUID | NOT NULL, FK -> `users(id)` | Author |
| `content` | TEXT | NOT NULL | Comment text |
| `created_at` | TIMESTAMP | NOT NULL | Post timestamp |

#### 7. `notifications`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Notification ID |
| `recipient_id` | UUID | NOT NULL, FK -> `users(id)` | User receiving notice |
| `title` | VARCHAR(255) | NOT NULL | Brief notice title |
| `message` | TEXT | NOT NULL | Details |
| `type` | VARCHAR(64) | NOT NULL | `TASK_ASSIGNED`, `STATUS_CHANGED`, etc. |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | Read state |
| `created_at` | TIMESTAMP | NOT NULL | Event timestamp |

#### 8. `activity_logs`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY | Log entry ID |
| `project_id` | UUID | NOT NULL, FK -> `projects(id)` | Project context |
| `user_id` | UUID | NOT NULL, FK -> `users(id)` | Actor who triggered event |
| `action` | VARCHAR(64) | NOT NULL | e.g. `CREATED_TASK`, `MOVED_TASK` |
| `entity_type` | VARCHAR(32) | NOT NULL | `TASK`, `PROJECT`, `COMMENT` |
| `entity_id` | UUID | NOT NULL | Target entity ID |
| `details` | TEXT | NULL | Human-readable change summary |
| `created_at` | TIMESTAMP | NOT NULL | Timestamp |
