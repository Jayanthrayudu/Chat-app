package com.chat_app.websocket;

import java.time.LocalDateTime;

public class ChatMessage {

    private String chatRoomId;
    private String senderId;
    private String senderUsername;
    private String content;
    private String messageType;
    private LocalDateTime timestamp;

    public ChatMessage() {
    }

    public ChatMessage(
            String chatRoomId,
            String senderId,
            String senderUsername,
            String content,
            String messageType
    ) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.messageType =
                messageType != null
                        ? messageType
                        : "TEXT";

        this.timestamp = LocalDateTime.now();
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}