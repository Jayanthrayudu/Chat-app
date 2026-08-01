package com.chat_app.controller;

import com.chat_app.dto.request.ChatMessageRequest;
import com.chat_app.dto.response.MessageResponse;
import com.chat_app.service.ChatService;
import com.chat_app.service.MessageService;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;

    private final ChatService chatService;

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            MessageService messageService,
            ChatService chatService,
            SimpMessagingTemplate messagingTemplate
    ) {

        this.messageService =
                messageService;

        this.chatService =
                chatService;

        this.messagingTemplate =
                messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            ChatMessageRequest request,
            Principal principal
    ) {
        /*
         * The username comes from the authenticated JWT.
         *
         * We do NOT receive senderId
         * from the frontend.
         */
        String username =
                principal.getName();

        MessageResponse response =
                messageService.sendMessage(
                        request,
                        username
                );

        String roomId =
                request.getChatRoomId().toString();

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                response
        );

        /*
         * Notify every other participant of the room via their personal
         * queue, so their conversation list updates and shows a toast
         * even if they aren't currently viewing this room.
         */
        List<String> otherUsernames =
                chatService.getOtherParticipantUsernames(
                        roomId,
                        username
                );

        for (String otherUsername : otherUsernames) {
            messagingTemplate.convertAndSendToUser(
                    otherUsername,
                    "/queue/notifications",
                    response
            );
        }
    }
}