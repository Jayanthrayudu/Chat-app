package com.chat_app.dto.response;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
public class ChatRoomResponse {
    private UUID id;
    private String name;
    private boolean isGroup;
    private UUID creatorId;
    private String creatorUsername;
    private LocalDateTime lastMessageAt;
    private List<UserResponse> participants;
    private MessageResponse lastMessage;
    public ChatRoomResponse(UUID id, String name, boolean isGroup,
                           UUID creatorId, String creatorUsername,
                           LocalDateTime lastMessageAt,
                           List<UserResponse> participants,
                           MessageResponse lastMessage) {
        this.id = id;
        this.name = name;
        this.isGroup = isGroup;
        this.creatorId = creatorId;
        this.creatorUsername = creatorUsername;
        this.lastMessageAt = lastMessageAt;
        this.participants = participants;
        this.lastMessage = lastMessage;
    }
    public UUID getId() { return id; }
    public String getName() { return name; }
    @JsonProperty("isGroup")
    public boolean isGroup() { return isGroup; }
    public UUID getCreatorId() { return creatorId; }
    public String getCreatorUsername() { return creatorUsername; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public List<UserResponse> getParticipants() { return participants; }
    public MessageResponse getLastMessage() { return lastMessage; }
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setGroup(boolean isGroup) { this.isGroup = isGroup; }
    public void setCreatorId(UUID creatorId) { this.creatorId = creatorId; }
    public void setCreatorUsername(String creatorUsername) { this.creatorUsername = creatorUsername; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public void setParticipants(List<UserResponse> participants) { this.participants = participants; }
    public void setLastMessage(MessageResponse lastMessage) { this.lastMessage = lastMessage; }
}