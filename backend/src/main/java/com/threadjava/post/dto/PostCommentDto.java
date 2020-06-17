package com.threadjava.post.dto;

import com.threadjava.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentDto {
    private UUID id;
    private String body;
    private long likeCount;
    private long dislikeCount;
    private PostUserDto user;
    private Date createdAt;
}
