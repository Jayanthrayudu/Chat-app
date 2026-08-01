import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as messageService from "../services/messageService";
import * as chatRoomsService from "../services/chatRoomsService";
import * as ws from "../services/websocketService";

import { useAuth } from "../hooks/useAuth";
import { useWebSocket } from "../hooks/useWebSocket";

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { status: connectionStatus } = useWebSocket();

  // =========================
  // ROOMS
  // =========================

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);
  const [creatingRoom, setCreatingRoom] = useState(false);

  // =========================
  // ACTIVE ROOM
  // =========================

  const [activeRoomId, setActiveRoomId] = useState(null);
  const activeRoomIdRef = useRef(null);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  // =========================
  // MESSAGES
  // =========================

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendError, setSendError] = useState(null);

  // =========================
  // MESSAGE PAGINATION
  // =========================

  const [messagePage, setMessagePage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);

  // =========================
  // NOTIFICATION TOASTS
  // =========================

  const [toasts, setToasts] = useState([]);

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // =========================
  // DUPLICATE MESSAGE TRACKING
  // =========================

  const seenMessageIds = useRef(new Set());

  // =========================
  // LOAD ROOMS
  // =========================

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    setRoomsError(null);

    try {
      const data = await chatRoomsService.getRooms();

      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      setRoomsError(
        error?.response?.data?.message ||
          "Could not load conversations."
      );
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  // =========================
  // CREATE GROUP
  // =========================

  const createGroup = useCallback(
    async (name, participantIds) => {
      setCreatingRoom(true);

      try {
        const newRoom = await chatRoomsService.createRoom(
          name,
          true,
          participantIds
        );

        setRooms((previousRooms) => [
          newRoom,
          ...previousRooms,
        ]);

        return newRoom;
      } finally {
        setCreatingRoom(false);
      }
    },
    []
  );

  // =========================
  // INCOMING WEBSOCKET MESSAGE (active room only)
  // =========================

  const handleIncomingMessage = useCallback(
    (incomingMessage) => {
      if (!incomingMessage?.id) {
        return;
      }

      setMessages((previousMessages) => {
        if (seenMessageIds.current.has(incomingMessage.id)) {
          return previousMessages;
        }

        seenMessageIds.current.add(incomingMessage.id);

        return [...previousMessages, incomingMessage];
      });

      // Update the room preview and bump it to the top of the list.
      setRooms((previousRooms) => {
        const updated = previousRooms.map((room) =>
          room.id === incomingMessage.chatRoomId
            ? {
                ...room,
                lastMessage: incomingMessage,
                lastMessageAt: incomingMessage.createdAt,
              }
            : room
        );

        const movedRoom = updated.find(
          (room) => room.id === incomingMessage.chatRoomId
        );
        if (!movedRoom) return updated;

        const rest = updated.filter(
          (room) => room.id !== incomingMessage.chatRoomId
        );
        return [movedRoom, ...rest];
      });
    },
    []
  );

  // =========================
  // PERSONAL NOTIFICATION (any room, including inactive ones)
  // =========================

  const handleNotification = useCallback((notification) => {
    if (!notification?.id) return;

    const isActiveRoom = notification.chatRoomId === activeRoomIdRef.current;

    setRooms((previousRooms) => {
      const updated = previousRooms.map((room) =>
        room.id === notification.chatRoomId
          ? {
              ...room,
              lastMessage: notification,
              lastMessageAt: notification.createdAt,
              unreadCount: isActiveRoom ? 0 : (room.unreadCount || 0) + 1,
            }
          : room
      );

      const movedRoom = updated.find(
        (room) => room.id === notification.chatRoomId
      );
      if (!movedRoom) return updated;

      const rest = updated.filter(
        (room) => room.id !== notification.chatRoomId
      );
      return [movedRoom, ...rest];
    });

    if (!isActiveRoom) {
      const toastId = `${notification.id}-${Date.now()}`;

      setToasts((prev) => [
        ...prev,
        {
          id: toastId,
          senderUsername: notification.senderUsername,
          content: notification.content,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 4000);
    }
  }, []);

  useEffect(() => {
    ws.setNotificationHandler(handleNotification);
  }, [handleNotification]);

  // =========================
  // SELECT ROOM
  // =========================

  const selectRoom = useCallback(
    async (roomId) => {
      if (!roomId) {
        return;
      }

      if (roomId === activeRoomId) {
        return;
      }

      setActiveRoomId(roomId);

      // Opening a room clears its unread count.
      setRooms((previousRooms) =>
        previousRooms.map((room) =>
          room.id === roomId ? { ...room, unreadCount: 0 } : room
        )
      );

      setMessages([]);

      setMessagesError(null);

      setSendError(null);

      setMessagesLoading(true);

      setMessagePage(0);

      setHasMoreMessages(true);

      seenMessageIds.current = new Set();

      /*
       * Subscribe immediately.
       *
       * If the WebSocket is already connected,
       * subscription happens immediately.
       *
       * If it is still connecting,
       * websocketService stores the room and
       * subscribes automatically inside onConnect().
       */
      ws.subscribeToRoom(
        roomId,
        handleIncomingMessage
      );

      try {
        const data =
          await messageService.getMessages(roomId, 0, 30);

        const safeContent = Array.isArray(data?.content)
          ? data.content
          : [];

        const chronological = [...safeContent].reverse();

        chronological.forEach((message) => {
          if (message.id) {
            seenMessageIds.current.add(
              message.id
            );
          }
        });

        setMessages(chronological);
        setHasMoreMessages(data?.last === false);
        setMessagePage(1);
      } catch (error) {
        setMessagesError(
          error?.response?.data?.message ||
            "Could not load messages for this conversation."
        );
      } finally {
        setMessagesLoading(false);
      }
    },
    [
      activeRoomId,
      handleIncomingMessage,
    ]
  );

  // =========================
  // LOAD OLDER MESSAGES (PAGINATION)
  // =========================

  const loadOlderMessages = useCallback(async () => {
    if (
      !activeRoomId ||
      !hasMoreMessages ||
      loadingOlderMessages
    ) {
      return;
    }

    setLoadingOlderMessages(true);

    try {
      const data = await messageService.getMessages(
        activeRoomId,
        messagePage,
        30
      );

      const safeContent = Array.isArray(data?.content)
        ? data.content
        : [];

      const chronological = [...safeContent].reverse();

      chronological.forEach((message) => {
        if (message.id) {
          seenMessageIds.current.add(message.id);
        }
      });

      setMessages((previousMessages) => [
        ...chronological,
        ...previousMessages,
      ]);

      setHasMoreMessages(data?.last === false);
      setMessagePage((previousPage) => previousPage + 1);
    } catch (error) {
      console.error(
        "Failed to load older messages:",
        error
      );
    } finally {
      setLoadingOlderMessages(false);
    }
  }, [
    activeRoomId,
    messagePage,
    hasMoreMessages,
    loadingOlderMessages,
  ]);

  // =========================
  // OPEN PRIVATE CHAT
  // =========================

  const openPrivateChat = useCallback(
    async (userId) => {
      setCreatingRoom(true);

      try {
        const room =
          await chatRoomsService.createOrGetPrivateChat(
            userId
          );

        setRooms((previousRooms) => {
          const exists =
            previousRooms.some(
              (existingRoom) =>
                existingRoom.id === room.id
            );

          if (exists) {
            return previousRooms.map(
              (existingRoom) =>
                existingRoom.id === room.id
                  ? {
                      ...existingRoom,
                      ...room,
                    }
                  : existingRoom
            );
          }

          return [
            room,
            ...previousRooms,
          ];
        });

        await selectRoom(room.id);

        return room;
      } finally {
        setCreatingRoom(false);
      }
    },
    [selectRoom]
  );

  // =========================
  // LOAD ROOMS AFTER LOGIN
  // =========================

  useEffect(() => {
    if (!isAuthenticated) {
      setRooms([]);

      setActiveRoomId(null);

      setMessages([]);

      setMessagesError(null);

      setSendError(null);

      setMessagePage(0);

      setHasMoreMessages(true);

      setToasts([]);

      seenMessageIds.current = new Set();

      ws.unsubscribeFromRoom();

      return;
    }

    loadRooms();
  }, [
    isAuthenticated,
    loadRooms,
  ]);

  // =========================
  // RE-SUBSCRIBE AFTER RECONNECT
  // =========================

  useEffect(() => {
    if (
      connectionStatus === "CONNECTED" &&
      activeRoomId
    ) {
      ws.subscribeToRoom(
        activeRoomId,
        handleIncomingMessage
      );
    }
  }, [
    connectionStatus,
    activeRoomId,
    handleIncomingMessage,
  ]);

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      ws.unsubscribeFromRoom();
    };
  }, []);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = useCallback(
    (content) => {
      const trimmedContent =
        content.trim();

      if (
        !trimmedContent ||
        !activeRoomId
      ) {
        return;
      }

      if (
        connectionStatus !== "CONNECTED"
      ) {
        setSendError(
          "Message could not be sent because the WebSocket is not connected."
        );

        return;
      }

      setSendError(null);

      try {
        ws.sendMessageWs(
          activeRoomId,
          trimmedContent,
          "TEXT"
        );
      } catch (error) {
        console.error(
          "Failed to send message:",
          error
        );

        setSendError(
          "Message could not be sent. Please check your connection."
        );
      }
    },
    [
      activeRoomId,
      connectionStatus,
    ]
  );

  // =========================
  // EDIT MESSAGE
  // =========================

  const editMessage = useCallback(
    async (
      messageId,
      newContent
    ) => {
      const trimmedContent =
        newContent.trim();

      if (!trimmedContent) {
        return;
      }

      const updatedMessage =
        await messageService.updateMessage(
          messageId,
          trimmedContent,
          "TEXT"
        );

      setMessages(
        (previousMessages) =>
          previousMessages.map(
            (message) =>
              message.id === messageId
                ? {
                    ...message,
                    ...updatedMessage,
                  }
                : message
          )
      );
    },
    []
  );

  // =========================
  // DELETE MESSAGE
  // =========================

  const removeMessage = useCallback(
    async (messageId) => {
      await messageService.deleteMessage(
        messageId
      );

      setMessages(
        (previousMessages) =>
          previousMessages.filter(
            (message) =>
              message.id !== messageId
          )
      );
    },
    []
  );

  // =========================
  // ACTIVE ROOM OBJECT
  // =========================

  const activeRoom = useMemo(() => {
    return (
      rooms.find(
        (room) =>
          room.id === activeRoomId
      ) || null
    );
  }, [
    rooms,
    activeRoomId,
  ]);

  // =========================
  // CLEAR ACTIVE ROOM
  // =========================

  const clearActiveRoom =
    useCallback(() => {
      setActiveRoomId(null);

      setMessages([]);

      setMessagesError(null);

      setSendError(null);

      setMessagePage(0);

      setHasMoreMessages(true);

      seenMessageIds.current = new Set();

      ws.unsubscribeFromRoom();
    }, []);

  // =========================
  // DELETE ROOM
  // =========================

  const deleteRoom = useCallback(
    async (roomId) => {
      await chatRoomsService.deleteRoom(roomId);

      setRooms((previousRooms) =>
        previousRooms.filter((room) => room.id !== roomId)
      );

      if (roomId === activeRoomId) {
        clearActiveRoom();
      }
    },
    [activeRoomId, clearActiveRoom]
  );

  const addMembers = useCallback(
    async (roomId, userIds) => {
      const updatedRoom = await chatRoomsService.addParticipants(roomId, userIds);

      setRooms((previousRooms) =>
        previousRooms.map((room) =>
          room.id === roomId ? { ...room, ...updatedRoom } : room
        )
      );

      return updatedRoom;
    },
    []
  );

  const leaveGroup = useCallback(
    async (roomId) => {
      await chatRoomsService.leaveGroup(roomId);

      setRooms((previousRooms) =>
        previousRooms.filter((room) => room.id !== roomId)
      );

      if (roomId === activeRoomId) {
        clearActiveRoom();
      }
    },
    [activeRoomId, clearActiveRoom]
  );

  const removeMember = useCallback(
    async (roomId, userId) => {
      const updatedRoom = await chatRoomsService.removeMember(roomId, userId);

      setRooms((previousRooms) =>
        previousRooms.map((room) =>
          room.id === roomId ? { ...room, ...updatedRoom } : room
        )
      );

      return updatedRoom;
    },
    []
  );

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = useMemo(
    () => ({
      // Rooms
      rooms,
      roomsLoading,
      roomsError,
      reloadRooms: loadRooms,

      // Group chats
      createGroup,
      creatingRoom,
      deleteRoom,
      addMembers,

      // Private chats
      openPrivateChat,

      // Active room
      activeRoomId,
      activeRoom,
      selectRoom,
      clearActiveRoom,

      // Messages
      messages,
      messagesLoading,
      messagesError,

      // Message pagination
      loadOlderMessages,
      hasMoreMessages,
      loadingOlderMessages,

      // Message actions
      sendMessage,
      sendError,
      editMessage,
      removeMessage,

      // WebSocket
      connectionStatus,

      // Group membership
      leaveGroup,
      removeMember,

      // Notifications
      toasts,
      dismissToast,
    }),
    [
      rooms,
      roomsLoading,
      roomsError,
      loadRooms,

      createGroup,
      creatingRoom,
      deleteRoom,
      addMembers,

      openPrivateChat,

      activeRoomId,
      activeRoom,
      selectRoom,
      clearActiveRoom,

      messages,
      messagesLoading,
      messagesError,

      loadOlderMessages,
      hasMoreMessages,
      loadingOlderMessages,

      sendMessage,
      sendError,
      editMessage,
      removeMessage,

      connectionStatus,

      leaveGroup,
      removeMember,

      toasts,
    ]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}