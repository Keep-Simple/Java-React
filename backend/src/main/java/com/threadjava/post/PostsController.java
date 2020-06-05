package com.threadjava.post;


import com.threadjava.post.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/posts")
public class PostsController {
    private final PostsService postsService;
    private final SimpMessagingTemplate template;

    public PostsController(PostsService postsService, SimpMessagingTemplate template) {
        this.postsService = postsService;
        this.template = template;
    }

    @GetMapping
    public List<PostListDto> get(@RequestParam(defaultValue="0") Integer from,
                                 @RequestParam(defaultValue="10") Integer count,
                                 @RequestParam(required = false) UUID userId) {
        return postsService.getAllPosts(from, count, userId);
    }

    @GetMapping("/{id}")
    public PostDetailsDto get(@PathVariable UUID id) {
        return postsService.getPostById(id);
    }

    @PostMapping
    public PostCreationResponseDto post(@RequestBody PostCreationDto postDto) {
        postDto.setUserId(getUserId());
        var item = postsService.create(postDto);
        template.convertAndSend("/topic/new_post", item);
        return item;
    }
}
