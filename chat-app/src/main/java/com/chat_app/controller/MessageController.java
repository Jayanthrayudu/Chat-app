package com.chat_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat_app.dto.request.ChatMessageRequest;
import com.chat_app.dto.response.MessageResponse;
import com.chat_app.service.MessageService;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(
            MessageService messageService
    ) {
        this.messageService =
                messageService;
    }

    @PostMapping("/{chatRoomId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable String chatRoomId,
            @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        /*
         * The chatRoomId comes from the URL.
         *
         * We put it into the request DTO
         * before sending it to the service.
         */
        request.setChatRoomId(
                java.util.UUID.fromString(
                        chatRoomId
                )
        );

        MessageResponse response =
                messageService.sendMessage(
                        request,
                        username
                );

        return ResponseEntity.ok(
                response
        );
    }

    @GetMapping("/{chatRoomId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable String chatRoomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        return ResponseEntity.ok(
                messageService.getMessagesByChatRoomPaged(
                        chatRoomId,
                        page,
                        size
                )
        );
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageResponse> updateMessage(
            @PathVariable String messageId,
            @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        MessageResponse response =
                messageService.updateMessage(
                        messageId,
                        request,
                        username
                );

        return ResponseEntity.ok(
                response
        );
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable String messageId,
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        messageService.deleteMessage(
                messageId,
                username
        );

        return ResponseEntity.noContent()
                .build();
    }
}