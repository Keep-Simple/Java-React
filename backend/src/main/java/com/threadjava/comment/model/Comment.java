package com.threadjava.comment.model;

import com.threadjava.commentReactions.model.CommentReaction;
import com.threadjava.db.BaseEntity;
import com.threadjava.post.model.Post;
import com.threadjava.users.model.User;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Data
@EqualsAndHashCode(callSuper=true)
@Entity
@Where(clause="deleted_at is null")
@Table(name = "comments")
public class Comment extends BaseEntity {
    @Column(name = "body", columnDefinition="TEXT")
    private String body;

    @Column(name = "deleted_at")
    private Date deletedAt;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "post_id")
    private Post post;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentReaction> reactions = new ArrayList<>();
}
