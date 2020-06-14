package com.threadjava.post;

import com.threadjava.post.dto.PostDetailsQueryResult;
import com.threadjava.post.model.Post;
import com.threadjava.post.dto.PostListQueryResult;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostsRepository extends JpaRepository<Post, UUID> {

    @Query("SELECT new com.threadjava.post.dto.PostListQueryResult(p.id, p.body, " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = TRUE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = FALSE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
            "(SELECT COUNT(*) FROM p.comments), " +
            "p.createdAt, i, p.user) " +
            "FROM Post p " +
            "LEFT JOIN p.image i " +
            "WHERE ( cast(:userId as string) is null OR p.user.id = :userId) " +
            "order by p.createdAt desc" )
    List<PostListQueryResult> findAllPosts(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT new com.threadjava.post.dto.PostDetailsQueryResult(p.id, p.body, " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = TRUE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = FALSE THEN 1 ELSE 0 END), 0) FROM p.reactions pr WHERE pr.post = p), " +
            "(SELECT COUNT(*) FROM p.comments), " +
            "p.createdAt, p.updatedAt, i, p.user) " +
            "FROM Post p " +
            "LEFT JOIN p.image i " +
            "WHERE p.id = :id")
    Optional<PostDetailsQueryResult> findPostById(@Param("id") UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE Post p SET p.body = :body WHERE p.id = :id")
    void setPostBodyById(@Param("body") String body, @Param("id") UUID id);

    @Modifying
    @Transactional
    @Query("UPDATE Post p SET p.deletedAt = :date WHERE p.id = :id")
    void softDeletePostById(@Param("id") UUID id, @Param("date") Date date);
}
