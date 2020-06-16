package com.threadjava.commentReactions;

import com.threadjava.commentReactions.dto.ReceivedCommentReactionDto;
import com.threadjava.commentReactions.dto.ResponseCommentReactionDto;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.threadjava.auth.TokenService.getUserId;

@Service
public class CommentReactionService {
    private final CommentReactionsRepository commentReactionsRepository;

    public CommentReactionService(CommentReactionsRepository commentReactionsRepository) {
        this.commentReactionsRepository = commentReactionsRepository;
    }

    public Optional<ResponseCommentReactionDto> setCommentReaction(ReceivedCommentReactionDto commentReactionDto) {

        var reaction = commentReactionsRepository.getCommentReaction(getUserId(), commentReactionDto.getCommentId());

        if (reaction.isPresent()) {
            var react = reaction.get();
            if (react.getIsLike() == commentReactionDto.getIsLike()) {
                commentReactionsRepository.deleteById(react.getId());
                return Optional.empty();
            } else {
                // == return unchanged in case of trying set both reactions ==
                return Optional.of(CommentReactionMapper.MAPPER.reactionToCommentReactionDto(react));
            }
        } else {
            var postReaction = CommentReactionMapper.MAPPER.dtoToCommentReaction(commentReactionDto);
            var result = commentReactionsRepository.save(postReaction);
            return Optional.of(CommentReactionMapper.MAPPER.reactionToCommentReactionDto(result));
        }
    }
}
