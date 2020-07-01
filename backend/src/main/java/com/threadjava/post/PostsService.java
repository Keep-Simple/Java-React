package com.threadjava.post;

import com.threadjava.comment.CommentRepository;
import com.threadjava.post.dto.*;
import com.threadjava.post.model.Post;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostsService {
    private final PostsRepository postsCrudRepository;
    private final CommentRepository commentRepository;

    public PostsService(PostsRepository postsCrudRepository, CommentRepository commentRepository) {
        this.postsCrudRepository = postsCrudRepository;
        this.commentRepository = commentRepository;
    }

    public List<PostListDto> getPosts(Integer from, Integer count, UUID userId, boolean inverted, boolean isLikeFilter) {
        var pageable = PageRequest.of(from / count, count);

        List<PostListQueryResult> resultList = null;

        if (inverted) {
            resultList = postsCrudRepository.findAllExceptOne(userId, pageable);
        }

        if (isLikeFilter) {
            resultList = postsCrudRepository.findPostsWithUserReaction(userId, pageable);
        }

        if (resultList == null) {
            resultList = postsCrudRepository.findAllPosts(userId, pageable);
        }

         return resultList
                 .stream()
                 .map(PostMapper.MAPPER::postListToPostListDto)
                 .collect(Collectors.toList());
    }

    public PostDetailsDto getPostById(UUID id) {
        var post = postsCrudRepository.findPostById(id)
                .map(PostMapper.MAPPER::postToPostDetailsDto)
                .orElseThrow();

        var comments = commentRepository.findAllByPostId(id)
                .stream()
                .map(PostMapper.MAPPER::fetchedCommentToPostCommentDto)
                .collect(Collectors.toList());

        post.setComments(comments);

        return post;
    }

    public PostCreationResponseDto create(PostCreationDto postDto) {
        Post post = PostMapper.MAPPER.postDetailsDtoToPost(postDto);
        Post postCreated = postsCrudRepository.save(post);
        return PostMapper.MAPPER.postToPostCreationResponseDto(postCreated);
    }

    public void updateBody(PostUpdateDto post) {
        postsCrudRepository.setPostBodyById(post.getBody(), post.getId());
    }

    public void softDelete(UUID id, Date date) {
        postsCrudRepository.softDeletePostById(id, date);
    }
}
