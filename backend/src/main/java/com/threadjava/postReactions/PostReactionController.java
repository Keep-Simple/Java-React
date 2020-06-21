package com.threadjava.postReactions;

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
        UUID userPostId = postReaction.getUserId();
        postReaction.setUserId(getUserId());

        var reaction = postsService.setReaction(postReaction);

        // When reaction was applied
        if (reaction.isPresent() && reaction.get().getIsLike() == postReaction.getIsLike()) {
            reaction.get().setPostUserId(userPostId);
                template.convertAndSend("/topic/new_post_reaction", reaction);
        }

        // When reaction was deleted
        if (reaction.isEmpty()) {
            var response = new ResponsePostReactionDto();
            response.setPostId(postReaction.getPostId());
            // live-update change for all users
            template.convertAndSend("/topic/new_post_reaction", response);
        }

        return reaction;
    }

    @GetMapping("/{postId}/{isLikes}")
    public List<ExtendedResponsePostReactionDto> getLikeInfoForPost(@PathVariable UUID postId, @PathVariable boolean isLikes) {
        return postsService.getPostLikes(postId, isLikes);
    }
}
