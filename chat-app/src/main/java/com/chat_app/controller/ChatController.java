//package com.chat_app.controller;
//
//import com.chat_app.dto.request.CreateChatRoomRequest;
//import com.chat_app.dto.response.ChatRoomResponse;
//import com.chat_app.service.ChatService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/chats")
//@CrossOrigin(origins = "http://localhost:5173")
//public class ChatController {
//
//    private final ChatService chatService;
//
//    public ChatController(ChatService chatService) {
//        this.chatService = chatService;
//    }
//
//    @PostMapping
//    public ResponseEntity<ChatRoomResponse> createChatRoom(@RequestBody CreateChatRoomRequest request) {
//        ChatRoomResponse response = chatService.createChatRoom(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping
//    public ResponseEntity<List<ChatRoomResponse>> getUserChats() {
//        List<ChatRoomResponse> chats = chatService.getUserChatRooms("currentUserId"); // Replace with real user id later
//        return ResponseEntity.ok(chats);
//    }
//}