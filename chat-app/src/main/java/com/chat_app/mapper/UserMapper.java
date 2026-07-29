package com.chat_app.mapper;

import com.chat_app.dto.request.RegisterRequest;
import com.chat_app.dto.response.UserResponse;
import com.chat_app.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String encodedPassword) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setFullName(request.getFullName());
        return user;
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getStatus(),
                user.isOnline()
        );
    }
}