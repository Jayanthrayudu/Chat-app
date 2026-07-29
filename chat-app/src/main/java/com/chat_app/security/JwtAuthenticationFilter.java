package com.chat_app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
    		
    	
        String authHeader =
                request.getHeader("Authorization");

        if (
                authHeader == null ||
                !authHeader.startsWith("Bearer ")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            String jwt =
                    authHeader.substring(7);

            String username =
                    jwtService.extractUsername(jwt);
            System.out.println(
                    "Authenticated user: " + username
            );
            
            

            if (
                    username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null
            ) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);
                
                System.out.println(
                        "JWT AUTHENTICATION SUCCESS: "
                                + userDetails.getUsername()
                );

                if (
                        jwtService.isTokenValid(
                                jwt,
                                userDetails.getUsername()
                        )
                ) {

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);
                }
            }

        } catch (Exception exception) {

            System.out.println(
                    "Invalid JWT: "
                            + exception.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}