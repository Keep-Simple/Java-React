package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto;
import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
                template.convertAndSend("/topic/like/post", userPostId);
            } else {
                template.convertAndSend("/topic/dislike/post", userPostId);
            }
        }
        return reaction;
    }

    @GetMapping("/{postId}/{isLikes}")
    public List<ExtendedResponsePostReactionDto> getLikeInfoForPost(@PathVariable UUID postId, @PathVariable boolean isLikes) {
        System.out.println(postsService.getPostLikes(postId, isLikes));
        return postsService.getPostLikes(postId, isLikes);
    }
}
