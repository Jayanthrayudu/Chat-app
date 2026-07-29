package com.chat_app.repository;

import com.chat_app.model.FriendRequest;
import com.chat_app.model.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, UUID> {

    List<FriendRequest> findByReceiverIdAndStatus(UUID receiverId, FriendRequestStatus status);
    
    List<FriendRequest> findBySenderId(UUID senderId);
    
    boolean existsBySenderIdAndReceiverIdAndStatus(UUID senderId, UUID receiverId, FriendRequestStatus status);
}