package com.chat_app.repository;
import com.chat_app.model.ChatRoom;
import com.chat_app.model.ChatRoomParticipant;
import com.chat_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface ChatRoomParticipantRepository
        extends JpaRepository<ChatRoomParticipant, UUID> {
    boolean existsByChatRoomAndUser(
            ChatRoom chatRoom,
            User user
    );
    List<ChatRoomParticipant> findByUser(User user);
    List<ChatRoomParticipant> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatRoomParticipant> findByChatRoomAndUser(
            ChatRoom chatRoom,
            User user
    );

    @Query("""
    	    SELECT p.chatRoom
    	    FROM ChatRoomParticipant p
    	    WHERE p.user = :user
    	""")
    	List<ChatRoom> findChatRoomsByUser(
    	        @Param("user") User user
    	);
}