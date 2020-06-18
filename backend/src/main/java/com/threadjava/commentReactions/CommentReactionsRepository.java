package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.ExtendedResponseCommentReactionDto;
import com.threadjava.commentReactions.model.CommentReaction;
import com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto;
import com.threadjava.postReactions.model.PostReaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentReactionsRepository extends CrudRepository<CommentReaction, UUID> {
    String BASE_GET_COMMENT_REACTIONS_QUERY = "SELECT" +
            " new com.threadjava.commentReactions.dto.ExtendedResponseCommentReactionDto(" +
            "r.user.username," +
            "a.link, r.createdAt, r.id) " +
            "FROM CommentReaction r " +
            "LEFT JOIN r.user.avatar a " +
            "WHERE r.comment.id = :commentId ";

    @Query("SELECT r " +
            "FROM CommentReaction r " +
            "WHERE r.user.id = :userId AND r.comment.id = :commentId ")
    Optional<CommentReaction> getCommentReaction(@Param("userId") UUID userId, @Param("commentId") UUID commentId);

    @Query(BASE_GET_COMMENT_REACTIONS_QUERY + "AND r.isLike = TRUE ")
    List<ExtendedResponseCommentReactionDto> getCommentLikes(@Param("commentId") UUID commentId);

    @Query(BASE_GET_COMMENT_REACTIONS_QUERY + "AND r.isLike = FALSE ")
    List<ExtendedResponseCommentReactionDto> getCommentDislikes(@Param("commentId") UUID commentId);
}
