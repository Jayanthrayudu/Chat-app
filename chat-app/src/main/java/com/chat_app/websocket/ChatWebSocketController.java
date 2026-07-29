//package com.chat_app.websocket;
//
//import com.chat_app.dto.request.ChatMessageRequest;
//import com.chat_app.dto.response.MessageResponse;
//import com.chat_app.service.MessageService;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class ChatWebSocketController {
//
//    private final MessageService messageService;
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public ChatWebSocketController(
//            MessageService messageService,
//            SimpMessagingTemplate messagingTemplate
//    ) {
//        this.messageService = messageService;
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @MessageMapping("/chat.send")
//    public void sendMessage(
//            ChatMessage message
//    ) {
//
//        ChatMessageRequest request =
//                new ChatMessageRequest(
//                        message.getContent(),
//                        message.getMessageType()
//                );
//
//        MessageResponse savedMessage =
//                messageService.sendMessage(
//                        request,
//                        message.getSenderId(),
//                        message.getChatRoomId()
//                );
//
//        messagingTemplate.convertAndSend(
//                "/topic/room/"
//                        + message.getChatRoomId(),
//                savedMessage
//        );
//    }
//}