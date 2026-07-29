package com.chat_app.controller;

import com.chat_app.dto.request.ChatMessageRequest;
import com.chat_app.dto.response.MessageResponse;
import com.chat_app.service.MessageService;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            MessageService messageService,
            SimpMessagingTemplate messagingTemplate
    ) {

        this.messageService =
                messageService;

        this.messagingTemplate =
                messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            ChatMessageRequest request,
            Principal principal
    ) {
    	  System.out.println("===== WEBSOCKET MESSAGE RECEIVED =====");
    	  System.out.println(
    	            "Chat Room ID: "
    	                    + request.getChatRoomId()
    	    );

    	    System.out.println(
    	            "Content: "
    	                    + request.getContent()
    	    );

    	    System.out.println(
    	            "Message Type: "
    	                    + request.getMessageType()
    	    );

    	    System.out.println(
    	            "Principal: "
    	                    + principal
    	    );
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

        messagingTemplate.convertAndSend(
                "/topic/room/"
                        + request.getChatRoomId(),
                response
        );
    }
}