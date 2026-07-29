package com.chat_app.service;

import com.chat_app.dto.request.LoginRequest;
import com.chat_app.dto.request.RegisterRequest;
import com.chat_app.dto.response.AuthResponse;
import com.chat_app.mapper.UserMapper;
import com.chat_app.model.User;
import com.chat_app.repository.UserRepository;
import com.chat_app.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user =
                userMapper.toEntity(request, encodedPassword);

        userRepository.save(user);

        String token =
                jwtService.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                "Registration successful"
        );
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(
                        request.getUsernameOrEmail()
                ))
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials")
                );

        String token =
                jwtService.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                "Login successful"
        );
    }
}