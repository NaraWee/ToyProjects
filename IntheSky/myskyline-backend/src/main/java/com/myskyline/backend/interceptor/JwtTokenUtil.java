package com.myskyline.backend.interceptor;

import com.myskyline.backend.dto.UserRequestDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenUtil {

    public String getUsernameFromToken(String token,String secretKey){
        var parer = Jwts.parserBuilder()
                .setSigningKey(Base64.getEncoder().encodeToString(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return parer.getSubject();
    }



    public String generateToken(UserRequestDto userRequestDto, String secretKey){
        var claims = Jwts.claims().setSubject(userRequestDto.getUserId());
        var now = new Date();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .signWith(SignatureAlgorithm.HS256,Base64.getEncoder().encodeToString(secretKey.getBytes()))
                .compact();
    }



}
