//package com.chat_app.service;
//
//import com.chat_app.model.User;
//import com.chat_app.repository.UserRepository;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserDetailsServiceImpl
//        implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    public UserDetailsServiceImpl(
//            UserRepository userRepository
//    ) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(
//            String usernameOrEmail
//    ) throws UsernameNotFoundException {
//
//        User user = userRepository
//                .findByUsername(usernameOrEmail)
//                .or(() -> userRepository.findByEmail(
//                        usernameOrEmail
//                ))
//                .orElseThrow(() ->
//                        new UsernameNotFoundException(
//                                "User not found: "
//                                        + usernameOrEmail
//                        )
//                );
//
//        return org.springframework.security.core.userdetails.User
//                .withUsername(user.getUsername())
//                .password(user.getPassword())
//                .authorities("USER")
//                .build();
//    }
//}