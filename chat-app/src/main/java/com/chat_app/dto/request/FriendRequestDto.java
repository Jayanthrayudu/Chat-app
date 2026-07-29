package com.chat_app.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class FriendRequestDto {
    private UUID receiverId;

	public UUID getReceiverId() {
		return receiverId;
	}

	public void setReceiverId(UUID receiverId) {
		this.receiverId = receiverId;
	}
}