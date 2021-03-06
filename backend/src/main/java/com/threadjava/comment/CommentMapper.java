package com.threadjava.comment;

import com.threadjava.comment.dto.CommentDetailsDto;
import com.threadjava.comment.dto.CommentSaveDto;
import com.threadjava.comment.dto.NotificationCommentDto;
import com.threadjava.comment.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper MAPPER = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "user.avatar", target = "user.image")
    @Mapping(source = "post.user.id", target = "postUserId")
    @Mapping(target = "likeCount", ignore = true)
    @Mapping(target = "dislikeCount", ignore = true)
    CommentDetailsDto commentToCommentDetailsDto(Comment comment);

    @Mapping(source = "postId", target = "post.id")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "reactions", ignore = true)
    Comment commentSaveDtoToModel(CommentSaveDto commentDto);


    @Mapping(source = "id", target = "commentId")
    @Mapping(source = "user.id", target = "userId")
    NotificationCommentDto detailsToNotificationDto(CommentDetailsDto comment);
}
