package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDeleteDto;
import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.CommentUpdateDto;
import com.threadjava.post.PostsRepository;
import com.threadjava.users.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UsersRepository usersRepository;
    private final PostsRepository postsRepository;

    public CommentService(CommentRepository commentRepository, UsersRepository usersRepository, PostsRepository postsRepository) {
        this.commentRepository = commentRepository;
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
    }

    public CommentDetailsDto getCommentById(UUID id) {
        return commentRepository.findById(id)
                .map(CommentMapper.MAPPER::commentToCommentDetailsDto)
                .orElseThrow();
    }

    public CommentDetailsDto create(CommentSaveDto commentDto) {
        var comment = CommentMapper.MAPPER.commentSaveDtoToModel(commentDto);
        var postCreated = commentRepository.save(comment);

        var post = postsRepository.findPostById(postCreated.getPost().getId());
        var result = CommentMapper.MAPPER.commentToCommentDetailsDto(postCreated);
        result.setPostUserId(post.get().getUser().getId());
        return result;
    }

    public void update(CommentUpdateDto commentDto) {
        commentRepository.updateComment(commentDto.getId(), commentDto.getBody());
    }

    public void softDelete(UUID id, Date date) {
        commentRepository.softDeleteCommentById(id, date);
    }


}
