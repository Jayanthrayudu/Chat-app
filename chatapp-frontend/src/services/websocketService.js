import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL, CONNECTION_STATUS } from "../utils/constants";

/**
 * Thin wrapper around a single STOMP client instance.
 *
 * This module intentionally holds module-level (singleton) state rather
 * than being re-instantiated per component, so that React re-renders,
 * StrictMode double-invocation, and room switches never spin up more
 * than one underlying WebSocket connection.
 */
let client = null;
let currentRoomSubscription = null;
let currentRoomId = null;
let pendingSubscribeCallback = null;
let statusListeners = new Set();
let hasConnectedBefore = false;

function emitStatus(status) {
  statusListeners.forEach((listener) => listener(status));
}

export function onStatusChange(listener) {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

/**
 * Connects to the backend STOMP endpoint, authenticating with the JWT.
 * Safe to call multiple times - if a client already exists and is
 * active, this is a no-op.
 */
export function connect(token) {
  if (!token) {
    return;
  }

  if (client && client.active) {
    // Already connected/connecting - do not create a second connection.
    return;
  }

  emitStatus(hasConnectedBefore ? CONNECTION_STATUS.RECONNECTING : CONNECTION_STATUS.CONNECTING);

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      hasConnectedBefore = true;
      emitStatus(CONNECTION_STATUS.CONNECTED);

      // If a room was selected before the connection finished, subscribe now.
      if (currentRoomId && pendingSubscribeCallback) {
        subscribeInternal(currentRoomId, pendingSubscribeCallback);
      }
    },

    onDisconnect: () => {
      emitStatus(CONNECTION_STATUS.DISCONNECTED);
    },

    onWebSocketClose: () => {
      emitStatus(CONNECTION_STATUS.RECONNECTING);
    },

    onStompError: (frame) => {
      // Typically surfaces auth failures (invalid/expired JWT) or broker errors.
      console.error("STOMP protocol error:", frame.headers?.message, frame.body);
      emitStatus(CONNECTION_STATUS.DISCONNECTED);
    },

    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
    },
  });

  client.activate();
}

/**
 * Disconnects and fully tears down the STOMP client. Call on logout or
 * app unmount.
 */
export function disconnect() {
  if (currentRoomSubscription) {
    try {
      currentRoomSubscription.unsubscribe();
    } catch {
      /* connection may already be closed */
    }
    currentRoomSubscription = null;
  }
  currentRoomId = null;
  pendingSubscribeCallback = null;
  hasConnectedBefore = false;

  if (client) {
    client.deactivate();
    client = null;
  }
  emitStatus(CONNECTION_STATUS.DISCONNECTED);
}

function subscribeInternal(roomId, onMessage) {
  if (!client || !client.connected) return;

  currentRoomSubscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
    try {
      const parsed = JSON.parse(message.body);
      onMessage(parsed);
    } catch (err) {
      console.error("Failed to parse incoming message:", err);
    }
  });
}

/**
 * Subscribes to a room's topic, automatically unsubscribing from any
 * previously subscribed room first so we never hold duplicate
 * subscriptions.
 */
export function subscribeToRoom(roomId, onMessage) {
  if (currentRoomSubscription) {
    try {
      currentRoomSubscription.unsubscribe();
    } catch {
      /* noop */
    }
    currentRoomSubscription = null;
  }

  currentRoomId = roomId;
  pendingSubscribeCallback = onMessage;

  if (client && client.connected) {
    subscribeInternal(roomId, onMessage);
  }
  // If not connected yet, onConnect() will call subscribeInternal once the
  // handshake completes, using the pendingSubscribeCallback above.
}

export function unsubscribeFromRoom() {
  if (currentRoomSubscription) {
    try {
      currentRoomSubscription.unsubscribe();
    } catch {
      /* noop */
    }
    currentRoomSubscription = null;
  }
  currentRoomId = null;
  pendingSubscribeCallback = null;
}

/**
 * Publishes a chat message. Never includes senderId/senderUsername -
 * the backend derives the sender from the authenticated Principal.
 */
export function sendMessageWs(chatRoomId, content, messageType = "TEXT") {
  if (!client || !client.connected) {
    throw new Error("WebSocket is not connected");
  }
  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      chatRoomId,
      content,
      messageType,
    }),
  });
}

export function isConnected() {
  return Boolean(client && client.connected);
}
