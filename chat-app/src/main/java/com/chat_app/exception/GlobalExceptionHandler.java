//package com.chat_app.exception;
//
//import com.chat_app.dto.response.ApiResponse;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<ApiResponse> handleResourceNotFound(ResourceNotFoundException ex) {
//        return new ResponseEntity<>(
//                new ApiResponse(ex.getMessage(), false),
//                HttpStatus.NOT_FOUND
//        );
//    }
//
//    @ExceptionHandler(UnauthorizedException.class)
//    public ResponseEntity<ApiResponse> handleUnauthorized(UnauthorizedException ex) {
//        return new ResponseEntity<>(
//                new ApiResponse(ex.getMessage(), false),
//                HttpStatus.UNAUTHORIZED
//        );
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//        ex.getBindingResult().getFieldErrors().forEach(error ->
//                errors.put(error.getField(), error.getDefaultMessage())
//        );
//
//        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex) {
//        return new ResponseEntity<>(
//                new ApiResponse("An unexpected error occurred: " + ex.getMessage(), false),
//                HttpStatus.INTERNAL_SERVER_ERROR
//        );
//    }
//}