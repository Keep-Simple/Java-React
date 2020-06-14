package com.threadjava.comment.dto;

import com.threadjava.users.dto.UserShortDto;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentDeleteDto {
    private UUID id;
    private UserShortDto user;
}
