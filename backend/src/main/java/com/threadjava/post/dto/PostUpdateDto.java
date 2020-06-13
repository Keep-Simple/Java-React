package com.threadjava.post.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PostUpdateDto {
    private UUID id;
    private UUID userId;
    private String body;
    private UUID imageId;
}
