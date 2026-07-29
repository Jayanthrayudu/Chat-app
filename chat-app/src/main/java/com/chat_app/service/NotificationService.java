package com.chat_app.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public NotificationService() {
        // Future: Push notifications, email, in-app notifications logic
    }

    public void sendNotification(String userId, String message) {
        // Placeholder for future implementation
        System.out.println("Notification sent to " + userId + ": " + message);
    }
}