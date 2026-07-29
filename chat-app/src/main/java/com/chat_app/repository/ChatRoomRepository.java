package com.chat_app.repository;

import com.chat_app.model.ChatRoom;
import com.chat_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository
        extends JpaRepository<ChatRoom, UUID> {

    /*
     * Get all chat rooms where the user is a participant.
     *
     * Rooms with the most recent message appear first.
     *
     * NULL lastMessageAt values are placed at the end.
     */
    @Query("""
            SELECT DISTINCT cp.chatRoom
            FROM ChatRoomParticipant cp
            WHERE cp.user = :user
            ORDER BY cp.chatRoom.lastMessageAt DESC NULLS LAST
            """)
    List<ChatRoom> findChatRoomsByUser(
            @Param("user") User user
    );


    /*
     * Find an existing private chat between exactly
     * these two users.
     *
     * SIZE(r.participants) = 2 ensures that a group or
     * corrupted room with additional participants is not
     * treated as a private chat.
     */
    @Query("""
            SELECT DISTINCT r
            FROM ChatRoom r
            JOIN r.participants p1
            JOIN r.participants p2
            WHERE r.isGroup = false
              AND p1.user.id = :user1Id
              AND p2.user.id = :user2Id
              AND SIZE(r.participants) = 2
            """)
    Optional<ChatRoom> findPrivateRoomBetweenUsers(
            @Param("user1Id") UUID user1Id,
            @Param("user2Id") UUID user2Id
    );

}