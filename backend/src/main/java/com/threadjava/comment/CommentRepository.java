package com.threadjava.comment;

import com.threadjava.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByPostId(UUID postId);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.body = :body WHERE c.id = :id")
    void updateComment(@Param("id") UUID id, @Param("body") String body);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.deletedAt = :date WHERE c.id = :id")
    void softDeleteCommentById(@Param("id") UUID id, @Param("date") Date date);
}
