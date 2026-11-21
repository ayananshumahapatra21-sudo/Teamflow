package com.teamflow.project;

import com.teamflow.common.BaseEntity;
import com.teamflow.team.Team;
import com.teamflow.user.User;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "project_key", nullable = false)
    private String projectKey;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    public Project() {
    }

    public Project(String name, String projectKey, String description, Team team, User owner, ProjectStatus status) {
        this.name = name;
        this.projectKey = projectKey;
        this.description = description;
        this.team = team;
        this.owner = owner;
        this.status = status != null ? status : ProjectStatus.ACTIVE;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public List<ProjectMember> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMember> members) {
        this.members = members;
    }
}
