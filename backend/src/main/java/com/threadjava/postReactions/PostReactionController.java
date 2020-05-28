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
    @Autowired
    private PostReactionService postsService;
    @Autowired
    private SimpMessagingTemplate template;

    @PutMapping("like")
    public Optional<ResponsePostReactionDto> setLikeReaction(@RequestBody ReceivedPostReactionDto postReaction){
        postReaction.setUserId(getUserId());
        var reaction = postsService.setReaction(postReaction, true);

        if (reaction.isPresent() && reaction.get().getUserId() != getUserId()) {
            template.convertAndSend("/topic/like", "Your post was liked!");
        }
        return reaction;
    }
    @PutMapping("dislike")
    public Optional<ResponsePostReactionDto> setDislikeReaction(@RequestBody ReceivedPostReactionDto postReaction){
        postReaction.setUserId(getUserId());
        var reaction = postsService.setReaction(postReaction, false);

        if (reaction.isPresent() && reaction.get().getUserId() != getUserId()) {
            template.convertAndSend("/topic/dislike", "Your post was disliked!");
        }
        return reaction;
    }
}
