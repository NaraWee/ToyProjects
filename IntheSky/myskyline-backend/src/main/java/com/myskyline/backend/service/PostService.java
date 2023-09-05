package com.myskyline.backend.service;

import com.myskyline.backend.domain.Post;
import com.myskyline.backend.handler.exception.NotFoundException;
import com.myskyline.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Post createPost(Post post) {
        Post resultPost = postRepository.save(post);

        if(resultPost == null || resultPost.getPostId() <= 0) {
            throw new NotFoundException("Error while registering.");
        }

        return resultPost;
    }

    public List<Post> getUserPostList(int userId) {
        List<Post> postList =  postRepository.findByUserIdAll(userId);

        if(postList == null || postList.isEmpty()) {
            throw new NotFoundException("No Data.");
        }

        return postList;
    }

    public List<Post> getPostRandom(int limit) {
        List<Post> randomPostList =  postRepository.getPostRandom(limit);

        if(randomPostList == null || randomPostList.isEmpty()) {
            throw new NotFoundException("No Data.");
        }

        return randomPostList;
    }

    public Post getPostInfo(int postId) {
        Post post = postRepository.findById(postId).get();

        if(post == null) {
            throw new NotFoundException("No Data.");
        }

        return post;
    }

    public void deletePost(int postId) {
        postRepository.deleteById(postId);
    }
}
