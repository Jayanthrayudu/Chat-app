package com.chat_app.dto.response;

public class AuthResponse {

    private String token;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            String username,
            String fullName,
            String avatarUrl,
            String message
    ) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}