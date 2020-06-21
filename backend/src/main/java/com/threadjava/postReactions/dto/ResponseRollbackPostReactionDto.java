package com.threadjava.postReactions.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ResponseRollbackPostReactionDto {
    private UUID postId;
    private Boolean rollbackLike;
    private UUID userId;
}
