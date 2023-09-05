package com.myskyline.backend.handler;

import com.myskyline.backend.dto.ApiResponse;
import com.myskyline.backend.handler.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> notFoundException(Exception ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.ofError(404, ex.getMessage()));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> illegalArgumentException(Exception ex){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.ofError(409, ex.getMessage()));
    }
}
