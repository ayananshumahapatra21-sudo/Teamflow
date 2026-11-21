# TeamFlow System Architecture

## Overview
TeamFlow is a collaborative project management and tracking platform built as a modular monolith using Java 21+ / Spring Boot 3.4 and React 18 / Vite / Tailwind CSS. It is designed to model core collaborative workflows seen in industry-standard platforms like Jira, Asana, and Trello.

---

## 1. High-Level Architecture

The system is organized into decoupled layers and business modules:

```
┌────────────────────────────────────────────────────────────────┐
│               Frontend Single Page Application                 │
│         React 18 + Vite + Tailwind CSS + Lucide Icons          │
│   (Auth Context, Protected Routes, Kanban Board, Analytics)    │
└───────────────▲────────────────────────────────▲───────────────┘
                │ REST API (JSON)                │ WebSocket (STOMP)
                │ Bearer JWT                     │ /ws/teamflow
┌───────────────▼────────────────────────────────▼───────────────┐
│               Spring Boot Modular Monolith                     │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Security Filter Chain: JwtAuthenticationFilter             │ │
│ └────────────────────────────────────────────────────────────┘ │
│ ┌──────────────┬──────────────┬──────────────┬───────────────┐ │
│ │ Auth Module  │ User Module  │ Team Module  │ Project Module│ │
│ ├──────────────┼──────────────┼──────────────┼───────────────┤ │
│ │ Task Module  │ Comment Mod. │ Notification │ Analytics Mod │ │
│ └──────────────┴──────────────┴──────────────┴───────────────┘ │
└───────────────▲────────────────────────────────▲───────────────┘
                │ JPA / Hibernate                │ Redis (Optional/Cache)
┌───────────────▼────────────────────────────────▼───────────────┐
│ Database Tier: PostgreSQL (Production) / H2 (Local Dev)        │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Modules & Responsibilities

1. **`auth`**: Handles user registration, credentials validation, password hashing with BCrypt, access & refresh token generation using JJWT.
2. **`user`**: User profile management, password updates, search by email/name for assignment and team invitations.
3. **`team`**: Workspaces, role assignment (`ADMIN`, `MANAGER`, `MEMBER`), team membership lifecycle.
4. **`project`**: Project metadata, team association, project key generation (e.g. `TF-`), project members.
5. **`task`**: Task lifecycle with statuses (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`), priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), assignees, due dates, and optimistic locking (`@Version`) to resolve concurrent updates.
6. **`comment`**: Task discussion threads with author stamps and notification dispatch.
7. **`notification`**: In-app notifications and WebSocket broadcasts for task assignments, status changes, and mentions.
8. **`analytics`**: Aggregation queries calculating task completion rates, overdue counts, project progress, and workload per team member.

---

## 3. Concurrency & Data Integrity
- **Optimistic Locking**: Every task entity contains a `@Version Long version` attribute. Simultaneous updates by two users detect version collision and throw `OptimisticLockingFailureException`, preventing dirty overwrites.
- **Transactional Consistency**: Domain operations (e.g. creating a task and recording an activity log) are guarded by `@Transactional` boundaries.
