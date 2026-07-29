package com.chat_app.service;

import com.chat_app.dto.response.UserResponse;
import com.chat_app.mapper.UserMapper;
import com.chat_app.model.User;
import com.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse getUserById(String id) {

        User user = userRepository.findById(
                UUID.fromString(id)
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        return userMapper.toResponse(user);
    }

    public UserResponse getUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return userMapper.toResponse(user);
    }

    public List<UserResponse> searchUsers(String username) {

        return userRepository
                .findByUsernameContainingIgnoreCase(username)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }
}