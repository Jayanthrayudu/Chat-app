package com.chat_app.mapper;
import com.chat_app.dto.response.ChatRoomResponse;
import com.chat_app.dto.response.UserResponse;
import com.chat_app.model.ChatRoom;
import com.chat_app.model.ChatRoomParticipant;
import com.chat_app.model.Message;
import org.springframework.stereotype.Component;
import java.util.List;
@Component
public class ChatRoomMapper {
    private final UserMapper userMapper;
    private final MessageMapper messageMapper;
    public ChatRoomMapper(
            UserMapper userMapper,
            MessageMapper messageMapper
    ) {
        this.userMapper = userMapper;
        this.messageMapper = messageMapper;
    }
    public ChatRoomResponse toResponse(
            ChatRoom chatRoom,
            Message lastMessage
    ) {
        List<UserResponse> participants =
                chatRoom.getParticipants()
                        .stream()
                        .map(ChatRoomParticipant::getUser)
                        .map(userMapper::toResponse)
                        .toList();
        return new ChatRoomResponse(
                chatRoom.getId(),
                chatRoom.getName(),
                chatRoom.isGroup(),
                chatRoom.getCreator() != null ? chatRoom.getCreator().getId() : null,
                chatRoom.getCreator() != null ? chatRoom.getCreator().getUsername() : null,
                chatRoom.getLastMessageAt(),
                participants,
                lastMessage != null ? messageMapper.toResponse(lastMessage) : null
        );   
    }
}