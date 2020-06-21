package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;
import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final SimpMessagingTemplate template;

    public CommentController(CommentService commentService, SimpMessagingTemplate template) {
        this.commentService = commentService;
        this.template = template;
    }

    @GetMapping("/{id}")
    public CommentDetailsDto get(@PathVariable UUID id) {
        return commentService.getCommentById(id);
    }

    @PostMapping
    public CommentDetailsDto post(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        var item = commentService.create(commentDto);
        template.convertAndSend("/topic/new_comment", CommentMapper.MAPPER.detailsToNotificationDto(item));
        return item;
    }

    @PutMapping("/update")
    public void update(@RequestBody CommentUpdateDto commentDto) {
        if(getUserId().equals(commentDto.getUser().getId()))
            commentService.update(commentDto);
    }

    @PutMapping("/softDelete/{id}")
    public void delete(@PathVariable UUID id) {
        commentService.softDelete(id, new Date());
    }
}
