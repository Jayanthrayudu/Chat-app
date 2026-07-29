package com.chat_app.websocket;

public class TypingMessage {
    private String chatRoomId;
    private String senderId;
    private String senderUsername;
    private boolean isTyping;

    public TypingMessage(String chatRoomId, String senderId, String senderUsername, boolean isTyping) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.isTyping = isTyping;
    }

    // Getters and Setters
    public String getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(String chatRoomId) { this.chatRoomId = chatRoomId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public boolean isTyping() { return isTyping; }
    public void setTyping(boolean typing) { isTyping = typing; }
}