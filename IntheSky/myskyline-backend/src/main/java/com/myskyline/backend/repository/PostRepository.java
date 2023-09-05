package com.myskyline.backend.repository;

import com.myskyline.backend.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query(value = "SELECT * FROM Post p WHERE p.userId=?1", nativeQuery = true)
    List<Post> findByUserIdAll(int userId);

    @Query(value = "SELECT * FROM Post p ORDER BY RAND() LIMIT ?1", nativeQuery = true)
    List<Post> getPostRandom(int limit);
}
