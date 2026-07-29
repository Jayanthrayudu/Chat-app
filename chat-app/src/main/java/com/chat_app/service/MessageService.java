package com.chat_app.service;

import com.chat_app.dto.request.ChatMessageRequest;
import com.chat_app.dto.response.MessageResponse;
import com.chat_app.mapper.MessageMapper;
import com.chat_app.model.ChatRoom;
import com.chat_app.model.Message;
import com.chat_app.model.MessageStatus;
import com.chat_app.model.User;
import com.chat_app.repository.ChatRoomRepository;
import com.chat_app.repository.MessageRepository;
import com.chat_app.repository.UserRepository;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@Service
public class MessageService {

    private final MessageRepository messageRepository;

    private final MessageMapper messageMapper;

    private final UserRepository userRepository;

    private final ChatRoomRepository chatRoomRepository;

    public MessageService(
            MessageRepository messageRepository,
            MessageMapper messageMapper,
            UserRepository userRepository,
            ChatRoomRepository chatRoomRepository
    ) {

        this.messageRepository =
                messageRepository;

        this.messageMapper =
                messageMapper;

        this.userRepository =
                userRepository;

        this.chatRoomRepository =
                chatRoomRepository;
    }

    /*
     * SEND MESSAGE
     *
     * username comes from the authenticated JWT.
     *
     * chatRoomId comes from the request.
     */
    @Transactional
    public MessageResponse sendMessage(
            ChatMessageRequest request,
            String username
    ) {

        /*
         * 1. Find authenticated sender
         */
        User sender =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender not found"
                                )
                        );

        /*
         * 2. Find chat room
         */
        ChatRoom chatRoom =
                chatRoomRepository
                        .findById(
                                request.getChatRoomId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Chat room not found"
                                )
                        );

        /*
         * 3. Create message
         */
        Message message =
                new Message();

        message.setContent(
                request.getContent()
        );

        message.setMessageType(
                request.getMessageType() != null
                        ? request.getMessageType()
                        : "TEXT"
        );

        message.setStatus(
                MessageStatus.SENT
        );

        message.setSender(
                sender
        );

        message.setChatRoom(
                chatRoom
        );

        /*
         * 4. Save message
         */
        Message savedMessage =
                messageRepository.save(
                        message
                );

        /*
         * 5. Convert entity to response DTO
         */
        return messageMapper.toResponse(
                savedMessage
        );
    }

    public List<MessageResponse> getMessagesByChatRoom(
            String chatRoomId
    ) {

        UUID roomId =
                UUID.fromString(
                        chatRoomId
                );

        return messageRepository
                .findByChatRoomIdOrderByCreatedAtAsc(
                        roomId
                )
                .stream()
                .map(
                        messageMapper::toResponse
                )
                .toList();
    }

    @Transactional
    public MessageResponse updateMessage(
            String messageId,
            ChatMessageRequest request,
            String username
    ) {

        Message message =
                messageRepository
                        .findById(
                                UUID.fromString(
                                        messageId
                                )
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found"
                                )
                        );

        User currentUser =
                userRepository
                        .findByUsername(
                                username
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (
                !message
                        .getSender()
                        .getId()
                        .equals(
                                currentUser.getId()
                        )
        ) {

            throw new RuntimeException(
                    "You can only edit your own messages"
            );
        }

        message.setContent(
                request.getContent()
        );

        if (
                request.getMessageType()
                        != null
        ) {

            message.setMessageType(
                    request.getMessageType()
            );
        }

        Message updatedMessage =
                messageRepository.save(
                        message
                );

        return messageMapper.toResponse(
                updatedMessage
        );
    }

    @Transactional
    public void deleteMessage(
            String messageId,
            String username
    ) {

        Message message =
                messageRepository
                        .findById(
                                UUID.fromString(
                                        messageId
                                )
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Message not found"
                                )
                        );

        User currentUser =
                userRepository
                        .findByUsername(
                                username
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (
                !message
                        .getSender()
                        .getId()
                        .equals(
                                currentUser.getId()
                        )
        ) {

            throw new RuntimeException(
                    "You can only delete your own messages"
            );
        }

        messageRepository.delete(
                message
        );
    }
    
    public Page<MessageResponse> getMessagesByChatRoomPaged(
            String chatRoomId,
            int page,
            int size
    ) {
        UUID roomId =
                UUID.fromString(
                        chatRoomId
                );

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        return messageRepository
                .findByChatRoomIdOrderByCreatedAtDesc(
                        roomId,
                        pageable
                )
                .map(
                        messageMapper::toResponse
                );
    }
}