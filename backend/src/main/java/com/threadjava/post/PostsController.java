package com.threadjava.post;


import com.threadjava.post.dto.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
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
    public List<PostListDto> getListOfPosts(@RequestParam(defaultValue="0") Integer from,
                                 @RequestParam(defaultValue="10") Integer count,
                                 @RequestParam(required = false) UUID userId,
                                 @RequestParam(required = false) boolean inverted,
                                 @RequestParam(required = false) boolean isLikeFilter) {
        return postsService.getPosts(from, count, userId, inverted, isLikeFilter);
    }

    @GetMapping("/{id}")
    public PostDetailsDto getPostById(@PathVariable UUID id) {
        return postsService.getPostById(id);
    }

    @PostMapping
    public PostCreationResponseDto addNewPost(@RequestBody PostCreationDto postDto) {
        postDto.setUserId(getUserId());
        var item = postsService.create(postDto);
        template.convertAndSend("/topic/new_post", item);
        return item;
    }

    @PutMapping("/update")
    public void updatePost(@RequestBody PostUpdateDto postDto) {
        if(getUserId().equals(postDto.getUserId()))
        postsService.updateBody(postDto);
    }

    @PutMapping("/softDelete/{id}")
    public void softDeletePost(@PathVariable UUID id) {
        postsService.softDelete(id, new Date());
    }
}
