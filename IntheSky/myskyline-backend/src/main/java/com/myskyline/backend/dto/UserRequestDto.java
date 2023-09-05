package com.myskyline.backend.dto;

import com.myskyline.backend.domain.User;
import lombok.*;

@Data
@NoArgsConstructor
public class UserRequestDto {
    private String userId;
    private String password;
    private String token;
    private boolean isAgree;

    @Builder
    public UserRequestDto(String userId, String password, String token, boolean isAgree) {
        this.userId = userId;
        this.password = password;
        this.token = token;
        this.isAgree = isAgree;

    }

    public User toEntity(){
        return User.builder()
                .userEmail(userId)
                .userPassword(password)
                .userToken(token)
                .isAgree(isAgree)
                .build();
    }





}
