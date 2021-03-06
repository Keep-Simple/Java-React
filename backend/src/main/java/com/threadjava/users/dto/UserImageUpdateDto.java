package com.threadjava.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserImageUpdateDto {
    private UUID userId;
    private UUID imageId;
}
