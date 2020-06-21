package com.threadjava.comment.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class NotificationCommentDto {
    private UUID postUserId;
    private UUID commentId;
    private UUID userId;
}
