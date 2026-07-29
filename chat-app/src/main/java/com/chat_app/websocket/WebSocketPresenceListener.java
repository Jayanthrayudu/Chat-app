package com.chat_app.websocket;

import com.chat_app.model.User;
import com.chat_app.repository.UserRepository;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
public class WebSocketPresenceListener {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketPresenceListener(
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        setOnlineStatus(event.getUser(), true);
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        setOnlineStatus(accessor.getUser(), false);
    }

    private void setOnlineStatus(Principal principal, boolean online) {
        if (principal == null) {
            return;
        }

        String username = principal.getName();

        userRepository.findByUsername(username).ifPresent(user -> {
            user.setOnline(online);
            userRepository.save(user);

            messagingTemplate.convertAndSend(
                    "/topic/presence",
                    new PresenceEvent(user.getId(), username, online)
            );
        });
    }

    public record PresenceEvent(java.util.UUID userId, String username, boolean online) {}
}