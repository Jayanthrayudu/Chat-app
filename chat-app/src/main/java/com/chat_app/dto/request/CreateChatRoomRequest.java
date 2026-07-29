package com.chat_app.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public class CreateChatRoomRequest {

    private String name;

    private List<UUID> participantIds;

    @JsonProperty("isGroup")
    private boolean isGroup = false;

    public CreateChatRoomRequest() {
    }

    public CreateChatRoomRequest(
            String name,
            List<UUID> participantIds,
            boolean isGroup
    ) {
        this.name = name;
        this.participantIds = participantIds;
        this.isGroup = isGroup;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UUID> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(
            List<UUID> participantIds
    ) {
        this.participantIds = participantIds;
    }

    @JsonProperty("isGroup")
    public boolean isGroup() {
        return isGroup;
    }

    @JsonProperty("isGroup")
    public void setGroup(
            boolean isGroup
    ) {
        this.isGroup = isGroup;
    }
}