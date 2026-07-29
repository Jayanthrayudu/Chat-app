const isProd = import.meta.env.PROD;

// In production (Docker/Nginx build), always use relative paths so
// requests go through Nginx's reverse proxy. In local dev, fall back
// to the explicit .env values (or localhost defaults) since there's
// no Nginx in front of the Vite dev server.
export const API_BASE_URL = isProd
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const WS_URL = isProd
  ? "/ws"
  : import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

export const TOKEN_STORAGE_KEY = "chat_app_jwt";
export const USER_STORAGE_KEY = "chat_app_user";

export const MESSAGE_TYPES = {
  TEXT: "TEXT",
};

export const CONNECTION_STATUS = {
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  RECONNECTING: "RECONNECTING",
};