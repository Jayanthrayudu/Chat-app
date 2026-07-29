package com.chat_app.controller;

import com.chat_app.dto.request.LoginRequest;
import com.chat_app.dto.request.RegisterRequest;
import com.chat_app.dto.response.AuthResponse;
import com.chat_app.dto.response.UserResponse;
import com.chat_app.service.AuthService;
import com.chat_app.service.UserService;
import com.chat_app.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(
            AuthService authService,
            UserService userService
    ) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
    	System.out.println("LOGIN CONTROLLER REACHED");
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {

        String username =
                SecurityUtils.getCurrentUsername();

        UserResponse currentUser =
                userService.getUserByUsername(username);

        return ResponseEntity.ok(currentUser);
    }
}