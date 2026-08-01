package com.chat_app.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageResponse {

    private UUID id;

    private UUID chatRoomId;

    private UUID senderId;

    private String senderUsername;

    private String content;

    private String messageType;

    private String status;

    private LocalDateTime createdAt;

    public MessageResponse(
            UUID id,
            UUID chatRoomId,
            UUID senderId,
            String senderUsername,
            String content,
            String messageType,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.messageType = messageType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getChatRoomId() {
        return chatRoomId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public String getContent() {
        return content;
    }

    public String getMessageType() {
        return messageType;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setChatRoomId(UUID chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}