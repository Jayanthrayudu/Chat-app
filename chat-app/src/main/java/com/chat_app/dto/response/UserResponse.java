package com.chat_app.dto.response;

import java.util.UUID;

public class UserResponse {
    private UUID id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String status;
    private boolean online;

    // Constructor for Mapper
    public UserResponse(UUID id, String username, String fullName, String avatarUrl, 
                       String status, boolean online) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.online = online;
    }

    // Getters
    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getStatus() { return status; }
    public boolean isOnline() { return online; }

    // Setters (optional)
    public void setId(UUID id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setStatus(String status) { this.status = status; }
    public void setOnline(boolean online) { this.online = online; }
}