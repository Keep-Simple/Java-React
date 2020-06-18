package com.threadjava.postReactions.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtendedResponsePostReactionDto {
    private String username;
    private String imgLink;
    private Date createdAt;
    private UUID id;
}
