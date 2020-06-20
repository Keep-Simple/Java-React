package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import com.threadjava.comment.model.Comment;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;
import static com.threadjava.auth.TokenService.getUserId;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public CommentDetailsDto get(@PathVariable UUID id) {
        return commentService.getCommentById(id);
    }

    @PostMapping
    public CommentDetailsDto post(@RequestBody CommentSaveDto commentDto) {
        commentDto.setUserId(getUserId());
        return commentService.create(commentDto);
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
