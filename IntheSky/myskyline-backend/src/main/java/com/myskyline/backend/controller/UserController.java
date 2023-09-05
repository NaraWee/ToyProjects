package com.myskyline.backend.controller;

import com.myskyline.backend.dto.ApiResponse;
import com.myskyline.backend.dto.UserRequestDto;
import com.myskyline.backend.dto.UserResponseDto;
import com.myskyline.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @GetMapping("/info")
    public ApiResponse<String> getUserFromToken(HttpServletRequest request){
        var name = (String) request.getAttribute("name");

        return ApiResponse.of(
                200,
                "success",
                userService.findUser(name).getUserToken()
        );
    }

    @GetMapping("/public/healthcheck")
    public ResponseEntity<String> healthCheck(){
        return ResponseEntity.ok().body("healthy");
    }

    @PostMapping("/public/login")
    public ApiResponse<UserResponseDto> login(@RequestBody UserRequestDto userRequestDto){
        return ApiResponse.of(
                200,
                "success",
               userService.createAndSaveToken(userRequestDto)
        );
    }

    @PostMapping("/public/signup")
    public ApiResponse<UserResponseDto> signUp(@RequestBody UserRequestDto userRequestDto){

        return ApiResponse.of(
                200,
                "success",
                userService.signup(userRequestDto)
        );
    }

}
