package com.myskyline.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponseDto {
    private int userId;
    private String token;

    @Builder
    public UserResponseDto(int userId, String token) {
        this.userId = userId;
        this.token = token;
    }
}
