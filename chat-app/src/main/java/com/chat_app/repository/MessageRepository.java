package com.chat_app.repository;
import com.chat_app.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface MessageRepository
        extends JpaRepository<Message, UUID> {
    /*
     * Load all messages for a conversation
     * from oldest to newest.
     */
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(
            UUID chatRoomId
    );

    /*
     * Load messages page by page,
     * newest first — used for pagination.
     */
    Page<Message> findByChatRoomIdOrderByCreatedAtDesc(
            UUID chatRoomId,
            Pageable pageable
    );

    /*
     * Get the latest message for the conversation.
     *
     * Used for:
     * - conversation preview
     * - "last message" in the sidebar
     */
    Optional<Message> findTopByChatRoomIdOrderByCreatedAtDesc(
            UUID chatRoomId
    );
}