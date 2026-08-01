package com.chat_app.mapper;

import com.chat_app.dto.response.MessageResponse;
import com.chat_app.model.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getChatRoom().getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getContent(),
                message.getMessageType(),
                message.getStatus().name(),
                message.getCreatedAt()
        );
    }
}