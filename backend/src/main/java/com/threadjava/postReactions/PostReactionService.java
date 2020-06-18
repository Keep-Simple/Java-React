package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.ExtendedResponsePostReactionDto;
import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.threadjava.auth.TokenService.getUserId;

@Service
public class PostReactionService {
    private final PostReactionsRepository postReactionsRepository;

    public PostReactionService(PostReactionsRepository postReactionsRepository) {
        this.postReactionsRepository = postReactionsRepository;
    }

    public Optional<ResponsePostReactionDto> setReaction(ReceivedPostReactionDto postReactionDto) {

        var reaction = postReactionsRepository.getPostReaction(getUserId(), postReactionDto.getPostId());

        if (reaction.isPresent()) {
            var react = reaction.get();
            if (react.getIsLike() == postReactionDto.getIsLike()) {
                postReactionsRepository.deleteById(react.getId());
                return Optional.empty();
            } else {
                // == return unchanged in case of trying set both reactions ==
                return Optional.of(PostReactionMapper.MAPPER.reactionToPostReactionDto(react));
            }
        } else {
            var postReaction = PostReactionMapper.MAPPER.dtoToPostReaction(postReactionDto);
            var result = postReactionsRepository.save(postReaction);
            return Optional.of(PostReactionMapper.MAPPER.reactionToPostReactionDto(result));
        }
    }

    public List<ExtendedResponsePostReactionDto> getPostLikes(UUID postId, boolean isLikes) {
        if (isLikes)
            return postReactionsRepository.getPostLikes(postId);
        return postReactionsRepository.getPostDislikes(postId);
    }
}
