package com.chat_app.controller;

import com.chat_app.dto.request.CreateChatRoomRequest;
import com.chat_app.dto.response.ChatRoomResponse;
import com.chat_app.service.ChatService;
import com.chat_app.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat-rooms")
public class ChatRoomController {

    private final ChatService chatService;

    public ChatRoomController(
            ChatService chatService
    ) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatRoomResponse>
    createChatRoom(
            @RequestBody CreateChatRoomRequest request
    ) {

        String currentUsername =
                SecurityUtils.getCurrentUsername();

        ChatRoomResponse response =
                chatService.createChatRoom(
                        request,
                        currentUsername
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ChatRoomResponse>>
    getUserChatRooms() {

        String currentUsername =
                SecurityUtils.getCurrentUsername();

        return ResponseEntity.ok(
                chatService.getUserChatRooms(
                        currentUsername
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatRoomResponse>
    getChatRoomById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                chatService.getChatRoomById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteChatRoom(
            @PathVariable String id
    ) {
        String currentUsername =
                SecurityUtils.getCurrentUsername();

        chatService.deleteChatRoom(
                id,
                currentUsername
        );

        return ResponseEntity.noContent()
                .build();
    }
    
    @PostMapping("/private/{userId}")
    public ResponseEntity<ChatRoomResponse> createOrGetPrivateChat(
            @PathVariable String userId
    ) {
        String currentUsername =
                SecurityUtils.getCurrentUsername();

        return ResponseEntity.ok(
                chatService.createOrGetPrivateChat(
                        currentUsername,
                        userId
                )
        );
    }
    
    @PostMapping("/{id}/participants")
    public ResponseEntity<ChatRoomResponse> addParticipants(
            @PathVariable String id,
            @RequestBody List<UUID> userIds
    ) {
        String currentUsername = SecurityUtils.getCurrentUsername();

        ChatRoomResponse response =
                chatService.addParticipants(id, userIds, currentUsername);

        return ResponseEntity.ok(response);
    }
    
    
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<ChatRoomResponse> leaveGroup(
            @PathVariable String id
    ) {
        String currentUsername = SecurityUtils.getCurrentUsername();
        return ResponseEntity.ok(
                chatService.leaveGroup(id, currentUsername)
        );
    }

    @DeleteMapping("/{id}/participants/{userId}")
    public ResponseEntity<ChatRoomResponse> removeMember(
            @PathVariable String id,
            @PathVariable UUID userId
    ) {
        String currentUsername = SecurityUtils.getCurrentUsername();
        return ResponseEntity.ok(
                chatService.removeMember(id, userId, currentUsername)
        );
    }
    
    
}