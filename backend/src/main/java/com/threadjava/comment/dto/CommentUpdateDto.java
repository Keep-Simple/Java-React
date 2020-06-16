package com.threadjava.comment.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentUpdateDto {
    private UUID id;
    private String body;
    private UserShortDto user;
}
