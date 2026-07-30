package com.chat_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());

        HttpStatus status = resolveStatus(ex.getMessage());
        body.put("status", status.value());

        return ResponseEntity.status(status).body(body);
    }

    /*
     * Maps known error message patterns to a more specific HTTP status.
     * Anything unrecognized falls back to 400 Bad Request, which is still
     * far more useful to the frontend than the previous default 500.
     */
    private HttpStatus resolveStatus(String message) {
        if (message == null) {
            return HttpStatus.BAD_REQUEST;
        }

        String lower = message.toLowerCase();

        if (lower.contains("already taken") || lower.contains("already registered")) {
            return HttpStatus.CONFLICT; // 409
        }

        if (lower.contains("invalid credentials")) {
            return HttpStatus.UNAUTHORIZED; // 401
        }

        if (lower.contains("not found")) {
            return HttpStatus.NOT_FOUND; // 404
        }

        if (lower.contains("only") || lower.contains("cannot")) {
            return HttpStatus.FORBIDDEN; // 403 — permission-style messages
        }

        return HttpStatus.BAD_REQUEST; // 400 — sensible default
    }
}