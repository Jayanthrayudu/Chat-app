package com.chat_app.util;

public class ValidationUtils {

    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    public static boolean isValidUsername(String username) {
        if (username == null) return false;
        return username.length() >= 3 && username.length() <= 30;
    }

    private ValidationUtils() {}
}