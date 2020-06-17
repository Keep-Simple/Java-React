package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.ReceivedCommentReactionDto;
import com.threadjava.commentReactions.dto.ResponseCommentReactionDto;
import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

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
}
