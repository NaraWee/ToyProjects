package com.myskyline.backend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Data
public class ApiResponse<T> {
    @NonNull
    private int statusCode;
    @NonNull
    private String message;
    private T data;


    public static <T> ApiResponse<T> of(int status, String message, T data){
        return new ApiResponse<>(status, message,data);
    }
    public static <T> ApiResponse<T> ofError(int status, String message){
        return new ApiResponse<>(status, message);
    }

}
