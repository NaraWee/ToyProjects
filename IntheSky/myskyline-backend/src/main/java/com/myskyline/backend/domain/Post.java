package com.myskyline.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Data
@Entity(name = "Post")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;
    private String uploadUrl;
    private String uploadPath;
    private String isAccept;
    private String registerDate;
    private String postName;
    private String location;
    private int userId;
    private String isDel;
}
