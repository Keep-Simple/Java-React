package com.threadjava.postReactions;

import com.threadjava.postReactions.dto.ReceivedPostReactionDto;
import com.threadjava.postReactions.dto.ResponsePostReactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostReactionService {
    @Autowired
    private PostReactionsRepository postReactionsRepository;

    public Optional<ResponsePostReactionDto> setReaction(ReceivedPostReactionDto postReactionDto, boolean isLike) {

        var reaction = postReactionsRepository.getPostReaction(postReactionDto.getUserId(), postReactionDto.getPostId());

        if (reaction.isPresent()) {
            var react = reaction.get();
            if (isLike && react.getIsLike() == postReactionDto.getIsLike() || !isLike && react.getIsDislike() == postReactionDto.getIsDislike()) {
                postReactionsRepository.deleteById(react.getId());
                return Optional.empty();
            } else {
                if(isLike) {
                    react.setIsLike(postReactionDto.getIsLike());
                } else {
                    react.setIsDislike(postReactionDto.getIsDislike());
                }
                var result = postReactionsRepository.save(react);
                return Optional.of(PostReactionMapper.MAPPER.reactionToPostReactionDto(result));
            }
        } else {
            var postReaction = PostReactionMapper.MAPPER.dtoToPostReaction(postReactionDto);
            var result = postReactionsRepository.save(postReaction);
            return Optional.of(PostReactionMapper.MAPPER.reactionToPostReactionDto(result));
        }
    }
}
