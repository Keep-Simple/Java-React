package com.threadjava.comment;

import com.threadjava.comment.dto.FetchCommentDto;
import com.threadjava.comment.model.Comment;
import com.threadjava.post.dto.PostCommentDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Query("SELECT new com.threadjava.comment.dto.FetchCommentDto(c.id, c.body, " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = TRUE THEN 1 ELSE 0 END), 0) FROM c.reactions pr WHERE pr.comment = c), " +
            "(SELECT COALESCE(SUM(CASE WHEN pr.isLike = FALSE THEN 1 ELSE 0 END), 0) FROM c.reactions pr WHERE pr.comment = c), " +
            "c.user," +
            " c.createdAt) " +
            "FROM Comment c " +
            "WHERE c.post.id = :postId " +
            "order by c.createdAt desc" )
    List<FetchCommentDto> findAllByPostId(@Param("postId") UUID postId);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.body = :body WHERE c.id = :id")
    void updateComment(@Param("id") UUID id, @Param("body") String body);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.deletedAt = :date WHERE c.id = :id")
    void softDeleteCommentById(@Param("id") UUID id, @Param("date") Date date);
}
