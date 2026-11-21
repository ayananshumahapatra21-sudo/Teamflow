# TeamFlow – Smart Collaborative Project Management System
**Architected & Developed by Ayananshu**

[![Java](https://img.shields.io/badge/Java-21%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**TeamFlow** is an enterprise-grade full-stack collaborative project management platform combining the best features of **Trello** (interactive Kanban boards), **Jira** (structured workflows, issue tracking, roles, audit trails), and **Asana** (deadlines, workload analytics).

Designed and engineered by **Ayananshu** as a premier full-stack software engineering project showcase.

---

## 🌟 Key Engineering Highlights

- **🔐 Enterprise Authentication**: Stateless Spring Security 6 with JWT access/refresh token rotation, BCrypt password hashing, and role-based access control.
- **🛡️ Concurrency & Optimistic Locking**: Every task entity uses `@Version` optimistic concurrency control to prevent simultaneous overwrite collisions in collaborative sprints.
- **📋 Interactive Kanban Board**: Color-coded priority tags (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), dynamic filtering, task detail drawer, and drag-and-drop state transitions.
- **💬 Real-Time Collaboration**: Discussion threads per task and WebSocket (STOMP) push notifications for instant board updates.
- **🏢 Multi-Team & Workspace Model**: Granular role assignments (`ADMIN`, `MANAGER`, `MEMBER`) and member invitations.
- **📊 Productivity Analytics**: Comprehensive progress meters, overdue tracking, task priority distribution, and per-contributor workload distribution.
- **🐳 Cloud & Containerization**: Multi-container Docker Compose setup for PostgreSQL 16, Redis 7, Backend, and Nginx.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Backend Language & Framework** | Java 21 / 25 LTS, Spring Boot 3.3.5 |
| **Security & Auth** | Spring Security 6, JJWT 0.12.6, BCrypt |
| **Persistence & Database** | Spring Data JPA, Hibernate, PostgreSQL (Prod/Docker), H2 (Local Dev) |
| **Real-Time Communication** | Spring WebSocket, STOMP broker, SockJS |
| **Frontend Framework & Styling** | React 18, Vite, Tailwind CSS 3.4, Lucide Icons, Axios |
| **API Documentation** | SpringDoc OpenAPI 2.6.0, Swagger UI |
| **Infrastructure** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 🚀 Quick Start Guide

### 1. Start the Backend API
```powershell
cd backend
mvn spring-boot:run
```
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (Look for the author banner: *"TeamFlow REST API – Designed by Ayananshu"*)

### 2. Start the Frontend
```powershell
cd frontend
npm run dev
```
- **Frontend Application**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Preloaded Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Lead Architect & Admin** | **Ayananshu** | `ayananshu@teamflow.io` | `Password123!` |
| **Engineering Manager** | Sarah Chen | `sarah@teamflow.io` | `Password123!` |
| **Senior Developer** | David Miller | `david@teamflow.io` | `Password123!` |

*(The login page features 1-click demo login buttons to authenticate instantly).*

---

## 👨‍💻 Author & Engineering Attribution
- **Creator**: **Ayananshu**
- **Role**: Lead Full-Stack Architect
- **Year**: 2026
