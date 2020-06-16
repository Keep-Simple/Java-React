package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/postreaction")
public class PostReactionController {

    private final PostReactionService postsService;
    private final SimpMessagingTemplate template;

    public PostReactionController(PostReactionService postsService, SimpMessagingTemplate template) {
        this.postsService = postsService;
        this.template = template;
    }

    @PutMapping
    public Optional<ResponsePostReactionDto> setReaction(@RequestBody ReceivedPostReactionDto postReaction){
        var userPostId = postReaction.getUserId();
        postReaction.setUserId(getUserId());

        var reaction = postsService.setReaction(postReaction);

        if (reaction.isPresent() && !userPostId.equals(getUserId()) && reaction.get().getIsLike() == postReaction.getIsLike()) {
            if(reaction.get().getIsLike()) {
                template.convertAndSend("/topic/like", userPostId);
            } else {
                template.convertAndSend("/topic/dislike", userPostId);
            }
        }
        return reaction;
    }
}
