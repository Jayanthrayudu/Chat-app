package com.chat_app.dto.request;

import java.util.UUID;

public class ChatMessageRequest {

    private UUID chatRoomId;

    private String content;

    private String messageType;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(
            UUID chatRoomId,
            String content,
            String messageType
    ) {
        this.chatRoomId = chatRoomId;
        this.content = content;
        this.messageType = messageType;
    }

    public UUID getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(UUID chatRoomId) {
        this.chatRoomId = chatRoomId;
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
}