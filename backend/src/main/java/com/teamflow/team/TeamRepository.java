package com.teamflow.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {

    @Query("SELECT DISTINCT t FROM Team t LEFT JOIN t.members m WHERE t.owner.id = :userId OR m.user.id = :userId")
    List<Team> findAllByUserId(@Param("userId") UUID userId);
}
