package com.hustlink.backend.features.feed.service;

import com.hustlink.backend.features.authentication.model.User;
import com.hustlink.backend.features.authentication.repository.UserRepository;
import com.hustlink.backend.features.feed.dto.PostDto;
import com.hustlink.backend.features.feed.model.Comment;
import com.hustlink.backend.features.feed.model.Post;
import com.hustlink.backend.features.feed.repository.CommentRepository;
import com.hustlink.backend.features.feed.repository.PostRepository;
import com.hustlink.backend.features.networking.model.Connection;
import com.hustlink.backend.features.networking.model.Status;
import com.hustlink.backend.features.networking.repository.ConnectionRepository;
import com.hustlink.backend.features.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final CommentRepository commentRepository;

    private final NotificationService notificationService;

    public Post createPost(PostDto postDto, Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = new Post(postDto.getContent(), author);
        post.setPicture(postDto.getPicture());
        return postRepository.save(post);
    }

    public Post editPost(Long postId, Long userId, PostDto postDto) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!post.getAuthor().equals(user)) {
            throw new IllegalArgumentException("You are not allowed to edit this post");
        }
        post.setContent(postDto.getContent());
        post.setPicture(postDto.getPicture());
        return postRepository.save(post);
    }

    public List<Post> getFeedPost(Long authenticatedUserId) {
        List<Connection> connections = connectionRepository.findByAuthorIdAndStatusOrRecipientIdAndStatus(
                authenticatedUserId, Status.ACCEPTED, authenticatedUserId, Status.ACCEPTED
        );


        Set<Long> connectedUserIds = connections.stream()
                .map(connection -> connection.getAuthor().getId().equals(authenticatedUserId)
                        ? connection.getRecipient().getId()
                        : connection.getAuthor().getId())
                .collect(Collectors.toSet());


        return postRepository.findByAuthorIdInOrderByCreationDateDesc(connectedUserIds);
    }

    public List<Post> getAllPost() {
        return postRepository.findAllByOrderByCreationDateDesc();
    }

    public Post getPost(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!post.getAuthor().equals(user)) {
            throw new IllegalArgumentException("You are not allowed to delete this post");
        }
        postRepository.delete(post);
    }

    public List<Post> getPostByUserId(Long userId) {
        return postRepository.findByAuthorId(userId);
    }

    public Post likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (post.getLikes().contains(user)) {
            post.getLikes().remove(user);
        } else {
            post.getLikes().add(user);
            notificationService.sendLikeNotification(user, post.getAuthor(), post.getId());
        }
        Post savedPost = postRepository.save(post);
        notificationService.sendLikeToPost(post.getId(), savedPost.getLikes());
        return savedPost;
    }

    public Comment addComment(Long postId, Long userId, String content) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Comment comment = commentRepository.save(new Comment(post, user, content));
        notificationService.sendCommentNotification(user, post.getAuthor(), post.getId());
        notificationService.sendCommentToPost(post.getId(), comment);
        return comment;
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!comment.getAuthor().equals(user)) {
            throw new IllegalArgumentException("User is not the author of the comment");
        }
        commentRepository.delete(comment);
        notificationService.sendDeleteCommentToPost(comment.getPost().getId(), comment);
    }

    public Comment editComment(Long commentId, Long userId, String content) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!comment.getAuthor().equals(user)) {
            throw new IllegalArgumentException("You are not allowed to edit this comment");
        }
        comment.setContent(content);
        Comment savedComment = commentRepository.save(comment);
        notificationService.sendCommentToPost(savedComment.getPost().getId(), savedComment);
        return savedComment;
    }

    public List<Comment> getPostComments(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return post.getComments();
    }

    public Set<User> getPostLikes(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return post.getLikes();
    }
}
