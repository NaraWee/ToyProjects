package com.myskyline.backend.controller;

import com.myskyline.backend.domain.Post;
import com.myskyline.backend.dto.ApiResponse;
import com.myskyline.backend.service.AmazonS3Service;
import com.myskyline.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final AmazonS3Service amazonS3Service;

    private final PostService postService;

    private String uploadDirName = "image";

    @PostMapping("/api/test/upload")
    public void testUpload(@RequestPart MultipartFile file) throws IOException {

        // 파일명 중복 방지를 위해 현재 날짜, 시간을 기준 파일명 수정
        String fileName = file.getOriginalFilename();
        int dateTimeInteger = (int) (new Date().getTime()/1000);
        fileName = dateTimeInteger + fileName;

        String dirName = "test";
        String filePath = dirName+"/"+fileName;

        // s3 image upload
        amazonS3Service.upload(file, dirName, filePath);

    }

    @GetMapping("/api/post/presignedurl")
    public ApiResponse<String> getPreSignedUrl(@RequestParam("tempPath") String tempPath) {
        return ApiResponse.of(200, "success", amazonS3Service.getPreSignedUrl(tempPath));
    }

    @PostMapping("/api/post/{fileName}")
    public ApiResponse<Post> createCopyPost(@RequestBody Post post, @PathVariable("fileName") String fileName, @RequestParam("tempPath") String tempPath) {
        String filePath = uploadDirName+"/"+fileName;
        String uploadUrl = amazonS3Service.copy(tempPath, uploadDirName, filePath);

        // db insert post
        post.setUploadPath(filePath);
        post.setUploadUrl(uploadUrl);
        return ApiResponse.of(200, "success", postService.createPost(post));
    }

    @GetMapping("/api/post/list/user")
    public ApiResponse<List<Post>> getUserPostList(@RequestParam("userId") int userId) {
        return ApiResponse.of(200, "success", postService.getUserPostList(userId));
    }

    @GetMapping("/api/public/post/random")
    public ApiResponse<List<Post>> getPostRandom(@RequestParam("limit") int limit) {
        return ApiResponse.of(200, "success", postService.getPostRandom(limit));
    }

    @DeleteMapping("/api/post/{postId}")
    public void deletePost(@PathVariable("postId") int postId) {

        Post postInfo = postService.getPostInfo(postId);
        amazonS3Service.delete(postInfo.getUploadPath());   // s3 image delete
        postService.deletePost(postId);     // db delete post

    }

}
