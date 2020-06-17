package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto;
import com.threadjava.postReactions.model.PostReaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostReactionsRepository extends CrudRepository<PostReaction, UUID> {

    String BASE_GET_POST_REACTIONS_QUERY = "SELECT new com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto(" +
            "r.user.username," +
            "a.link, r.createdAt, r.id) " +
            "FROM PostReaction r " +
            "LEFT JOIN r.user.avatar a " +
            "WHERE r.post.id = :postId ";

    @Query("SELECT r " +
            "FROM PostReaction r " +
            "WHERE r.user.id = :userId AND r.post.id = :postId ")
    Optional<PostReaction> getPostReaction(@Param("userId") UUID userId, @Param("postId") UUID postId);

    @Query(BASE_GET_POST_REACTIONS_QUERY + "AND r.isLike = TRUE ")
    List<ExtendedResponsePostReactionDto> getPostLikes(@Param("postId") UUID postId);

    @Query(BASE_GET_POST_REACTIONS_QUERY + "AND r.isLike = FALSE ")
    List<ExtendedResponsePostReactionDto> getPostDislikes(@Param("postId") UUID postId);
}
