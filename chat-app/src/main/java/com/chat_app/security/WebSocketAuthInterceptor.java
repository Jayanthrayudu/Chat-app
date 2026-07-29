package com.chat_app.security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Component;

import org.springframework.messaging.support.MessageHeaderAccessor;

@Component
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public WebSocketAuthInterceptor(
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

    	StompHeaderAccessor accessor =
    	        MessageHeaderAccessor.getAccessor(
    	                message,
    	                StompHeaderAccessor.class
    	        );

        StompCommand command =
                accessor.getCommand();


        if (
                StompCommand.CONNECT.equals(command)
        ) {

            String authorizationHeader =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );

            System.out.println(
                    "Authorization Header Present: "
                            + (
                            authorizationHeader != null
                    )
            );

            if (
                    authorizationHeader == null
                    ||
                    !authorizationHeader.startsWith(
                            "Bearer "
                    )
            ) {

                throw new IllegalArgumentException(
                        "Missing or invalid Authorization header"
                );
            }

            String token =
                    authorizationHeader.substring(7);

            String username =
                    jwtService.extractUsername(
                            token
                    );

            System.out.println(
                    "Username: "
                            + username
            );

            if (
                    !jwtService.isTokenValid(
                            token,
                            username
                    )
            ) {

                throw new IllegalArgumentException(
                        "Invalid or expired JWT token"
                );
            }

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(
                                    username
                            );

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            accessor.setUser(authentication);

            System.out.println(
                    "Authentication set: "
                            + accessor.getUser()
            );

            /*
             * Important:
             * Explicitly return a new message containing
             * the modified STOMP headers.
             */
            return MessageBuilder
                    .createMessage(
                            message.getPayload(),
                            accessor.getMessageHeaders()
                    );
        }


        return message;
    }
}