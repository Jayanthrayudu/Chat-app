package com.chat_app.service;

import com.chat_app.dto.request.CreateChatRoomRequest;
import com.chat_app.dto.response.ChatRoomResponse;
import com.chat_app.mapper.ChatRoomMapper;
import com.chat_app.model.ChatRoom;
import com.chat_app.model.ChatRoomParticipant;
import com.chat_app.model.Message;
import com.chat_app.model.User;
import com.chat_app.repository.ChatRoomParticipantRepository;
import com.chat_app.repository.ChatRoomRepository;
import com.chat_app.repository.MessageRepository;
import com.chat_app.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ChatRoomMapper chatRoomMapper;

    public ChatService(
            ChatRoomRepository chatRoomRepository,
            ChatRoomParticipantRepository participantRepository,
            UserRepository userRepository,
            MessageRepository messageRepository,
            ChatRoomMapper chatRoomMapper
    ) {
        this.chatRoomRepository = chatRoomRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.chatRoomMapper = chatRoomMapper;
    }

    // =====================================================
    // CREATE GROUP OR CHAT ROOM
    // =====================================================

    @Transactional
    public ChatRoomResponse createChatRoom(
            CreateChatRoomRequest request,
            String currentUsername
    ) {
        User creator =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );

        ChatRoom chatRoom = new ChatRoom();

        chatRoom.setName(request.getName());
        chatRoom.setGroup(request.isGroup());
        chatRoom.setCreator(creator);

        ChatRoom savedChatRoom =
                chatRoomRepository.save(chatRoom);

        // Add creator
        addParticipant(
                savedChatRoom,
                creator
        );

        // Add other participants
        if (request.getParticipantIds() != null) {

            for (UUID participantId :
                    request.getParticipantIds()) {

                User user =
                        userRepository
                                .findById(participantId)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Participant not found: "
                                                        + participantId
                                        )
                                );

                // Prevent creator from being added twice
                if (
                        !user.getId()
                                .equals(
                                        creator.getId()
                                )
                ) {
                    addParticipant(
                            savedChatRoom,
                            user
                    );
                }
            }
        }

        return buildChatRoomResponse(
                savedChatRoom
        );
    }

    // =====================================================
    // ADD PARTICIPANT
    // =====================================================

    private void addParticipant(
            ChatRoom chatRoom,
            User user
    ) {
        boolean alreadyExists =
                participantRepository
                        .existsByChatRoomAndUser(
                                chatRoom,
                                user
                        );

        if (alreadyExists) {
            return;
        }

        ChatRoomParticipant participant =
                new ChatRoomParticipant();

        participant.setChatRoom(chatRoom);
        participant.setUser(user);

        participantRepository.save(
                participant
        );
    }

    // =====================================================
    // GET USER CHAT ROOMS
    // =====================================================

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getUserChatRooms(
            String currentUsername
    ) {
        User user =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );

        return chatRoomRepository
                .findChatRoomsByUser(user)
                .stream()
                .map(this::buildChatRoomResponse)
                .toList();
    }

    // =====================================================
    // GET CHAT ROOM BY ID
    // =====================================================

    @Transactional(readOnly = true)
    public ChatRoomResponse getChatRoomById(
            String id
    ) {
        UUID roomId =
                UUID.fromString(id);

        ChatRoom chatRoom =
                chatRoomRepository
                        .findById(roomId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Chat room not found"
                                )
                        );

        return buildChatRoomResponse(
                chatRoom
        );
    }

    // =====================================================
    // DELETE CHAT ROOM
    // =====================================================

    @Transactional
    public void deleteChatRoom(
            String id,
            String currentUsername
    ) {
        UUID roomId =
                UUID.fromString(id);

        ChatRoom chatRoom =
                chatRoomRepository
                        .findById(roomId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Chat room not found"
                                )
                        );

        if (
                chatRoom.getCreator() == null ||
                        !chatRoom.getCreator()
                                .getUsername()
                                .equals(currentUsername)
        ) {
            throw new RuntimeException(
                    "Only the group creator can delete this chat room"
            );
        }

        chatRoomRepository.delete(
                chatRoom
        );
    }

    // =====================================================
    // CREATE OR GET PRIVATE CHAT
    // =====================================================

    @Transactional
    public ChatRoomResponse createOrGetPrivateChat(
            String currentUsername,
            String userId
    ) {
        UUID otherUserId =
                UUID.fromString(userId);

        User currentUser =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );

        User otherUser =
                userRepository
                        .findById(otherUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // Prevent self-chat
        if (
                currentUser
                        .getId()
                        .equals(
                                otherUser.getId()
                        )
        ) {
            throw new RuntimeException(
                    "You cannot create a chat with yourself"
            );
        }

        // Search for existing private room
        Optional<ChatRoom> existingRoom =
                chatRoomRepository
                        .findPrivateRoomBetweenUsers(
                                currentUser.getId(),
                                otherUser.getId()
                        );

        if (existingRoom.isPresent()) {

            return buildChatRoomResponse(
                    existingRoom.get()
            );
        }

        // Create new private room
        ChatRoom chatRoom =
                new ChatRoom();

        chatRoom.setName(
                otherUser.getFullName()
        );

        chatRoom.setGroup(
                false
        );

        chatRoom.setCreator(
                currentUser
        );

        ChatRoom savedRoom =
                chatRoomRepository.save(
                        chatRoom
                );

        // Add both users
        addParticipant(
                savedRoom,
                currentUser
        );

        addParticipant(
                savedRoom,
                otherUser
        );

        return buildChatRoomResponse(
                savedRoom
        );
    }

    // =====================================================
    // BUILD COMPLETE ROOM RESPONSE
    // =====================================================

    private ChatRoomResponse buildChatRoomResponse(
            ChatRoom chatRoom
    ) {
        Message lastMessage =
                messageRepository
                        .findTopByChatRoomIdOrderByCreatedAtDesc(
                                chatRoom.getId()
                        )
                        .orElse(null);

        return chatRoomMapper.toResponse(
                chatRoom,
                lastMessage
        );
    }
    
    @Transactional
    public ChatRoomResponse addParticipants(
            String roomId,
            List<UUID> userIds,
            String currentUsername
    ) {
        UUID id = UUID.fromString(roomId);

        ChatRoom chatRoom = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        if (!chatRoom.isGroup()) {
            throw new RuntimeException("Cannot add members to a private chat");
        }

        if (chatRoom.getCreator() == null ||
                !chatRoom.getCreator().getUsername().equals(currentUsername)) {
            throw new RuntimeException("Only the group creator can add members");
        }

        for (UUID userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            addParticipant(chatRoom, user);
        }

        return buildChatRoomResponse(chatRoom);
    }
    
    
    @Transactional
    public ChatRoomResponse leaveGroup(
            String roomId,
            String currentUsername
    ) {
        UUID id = UUID.fromString(roomId);

        ChatRoom chatRoom = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        if (!chatRoom.isGroup()) {
            throw new RuntimeException("Cannot leave a private chat");
        }

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (chatRoom.getCreator() != null &&
                chatRoom.getCreator().getId().equals(currentUser.getId())) {
            throw new RuntimeException("The group creator cannot leave. Delete the group instead.");
        }

        ChatRoomParticipant participant =
                participantRepository.findByChatRoomAndUser(chatRoom, currentUser)
                        .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        chatRoom.getParticipants().remove(participant);

        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        return buildChatRoomResponse(savedRoom);
    }

    @Transactional
    public ChatRoomResponse removeMember(
            String roomId,
            UUID memberUserId,
            String currentUsername
    ) {
        UUID id = UUID.fromString(roomId);

        ChatRoom chatRoom = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        if (!chatRoom.isGroup()) {
            throw new RuntimeException("Cannot remove members from a private chat");
        }

        if (chatRoom.getCreator() == null ||
                !chatRoom.getCreator().getUsername().equals(currentUsername)) {
            throw new RuntimeException("Only the group creator can remove members");
        }

        if (chatRoom.getCreator().getId().equals(memberUserId)) {
            throw new RuntimeException("The group creator cannot be removed");
        }

        User memberToRemove = userRepository.findById(memberUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoomParticipant participant =
                participantRepository.findByChatRoomAndUser(chatRoom, memberToRemove)
                        .orElseThrow(() -> new RuntimeException("That user is not a member of this group"));

        chatRoom.getParticipants().remove(participant);

        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        return buildChatRoomResponse(savedRoom);
    }
    
}