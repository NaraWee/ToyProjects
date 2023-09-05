package com.myskyline.backend.service;


import com.myskyline.backend.domain.User;
import com.myskyline.backend.dto.UserRequestDto;
import com.myskyline.backend.dto.UserResponseDto;
import com.myskyline.backend.handler.exception.NotFoundException;
import com.myskyline.backend.interceptor.JwtTokenUtil;
import com.myskyline.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public UserResponseDto createAndSaveToken(UserRequestDto userRequestDto) {
        var user = findUser(userRequestDto.getUserId());
    	if(user == null) {
    		throw new NotFoundException("User not found");
    	}
        if(!passwordEncoder.matches(userRequestDto.getPassword(),user.getUserPassword())){
          throw new NotFoundException("User not found");
        }

      return setResponse(user);
    }

    public UserResponseDto signup(UserRequestDto userRequestDto) {
		User user = findUser(userRequestDto.getUserId());

		if(user != null) {
			throw new IllegalArgumentException("Existed email address");
		}
		if(!isValidEmail(userRequestDto.getUserId())) {
			throw new IllegalArgumentException("Not an email format");
		}

        user = setEntity(userRequestDto);

        return setResponse(userRepository.save(user));
	}

    public User findUser(String userEmail) {
        return userRepository.findByUserEmail(userEmail);
    }

    private UserResponseDto setResponse(User user){
        return user.toDto();
    }

    private User setEntity(UserRequestDto userRequestDto) {
       var user = userRequestDto.toEntity();
        user.setUserPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        user.setRegisterDate(LocalDateTime.now());
        user.setUserToken(jwtTokenUtil.generateToken(userRequestDto, secretKey));

        return user;
    }

    private boolean isValidEmail(String email) {
        String emailRegexString = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.compile(emailRegexString).matcher(email).matches();
    }
}
