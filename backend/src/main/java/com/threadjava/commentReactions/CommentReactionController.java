package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.ExtendedResponseCommentReactionDto;
import com.threadjava.commentReactions.dto.ReceivedCommentReactionDto;
import com.threadjava.commentReactions.dto.ResponseCommentReactionDto;
import com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto;
import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/commentreaction")
public class CommentReactionController {

    private final CommentReactionService commentReactionService;
    private final SimpMessagingTemplate template;

    public CommentReactionController(CommentReactionService commentReactionService, SimpMessagingTemplate template) {
        this.commentReactionService = commentReactionService;
        this.template = template;
    }

    @PutMapping
    public Optional<ResponseCommentReactionDto> setCommentReaction(@RequestBody ReceivedCommentReactionDto commentReaction){
        var userCommentId = commentReaction.getUserId();
        commentReaction.setUserId(getUserId());

        var reaction = commentReactionService.setCommentReaction(commentReaction);

        if (reaction.isPresent() && !userCommentId.equals(getUserId()) && reaction.get().getIsLike() == commentReaction.getIsLike()) {
            if(reaction.get().getIsLike()) {
                template.convertAndSend("/topic/like/comment", userCommentId);
            } else {
                template.convertAndSend("/topic/dislike/comment", userCommentId);
            }
        }
        return reaction;
    }

    @GetMapping("/{commentId}/{isLikes}")
    public List<ExtendedResponseCommentReactionDto> getLikeInfoForPost(@PathVariable UUID commentId, @PathVariable boolean isLikes) {
        return commentReactionService.getCommentLikes(commentId, isLikes);
    }
}
