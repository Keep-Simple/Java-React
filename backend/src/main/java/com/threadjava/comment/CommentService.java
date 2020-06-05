package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.post.PostsRepository;
import com.threadjava.users.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        return CommentMapper.MAPPER.commentToCommentDetailsDto(postCreated);
    }
}
