package com.threadjava.comment.dto;

import com.threadjava.users.dto.UserDto;
import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentDetailsDto {
    private UUID id;
    private String body;
    private long likeCount;
    private long dislikeCount;
    private UserDto user;
    private UUID postId;
}
