package com.teamflow.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<Task> findByAssigneeId(UUID assigneeId);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assigneeId IS NULL OR t.assignee.id = :assigneeId) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.createdAt DESC")
    List<Task> findFilteredTasks(@Param("projectId") UUID projectId,
                                 @Param("status") TaskStatus status,
                                 @Param("priority") TaskPriority priority,
                                 @Param("assigneeId") UUID assigneeId,
                                 @Param("search") String search);

    long countByProjectId(UUID projectId);

    long countByProjectIdAndStatus(UUID projectId, TaskStatus status);

    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status != 'DONE'")
    long countOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.dueDate < :today AND t.status != 'DONE'")
    long countOverdueTasksByProject(@Param("projectId") UUID projectId, @Param("today") LocalDate today);
}
