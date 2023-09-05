package com.myskyline.backend.domain;

import com.myskyline.backend.dto.UserResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String userEmail;

    private String userName;

    private String userPassword;

    private String userToken;

    private LocalDateTime registerDate;

    private Boolean isAgree;

    private boolean isDel;

    public UserResponseDto toDto(){
        return UserResponseDto.builder()
                .userId(userId)
                .token(userToken)
                .build();
    }
}
