package com.threadjava.post.dto;


import com.threadjava.image.model.Image;
import com.threadjava.postReactions.model.PostReaction;
import com.threadjava.users.model.User;
import lombok.*;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostListQueryResult {
    public UUID id;
    public String body;
    public long likeCount;
    public long dislikeCount;
    public long commentCount;
    public Date createdAt;
    public Image image;
    public User user;
}
