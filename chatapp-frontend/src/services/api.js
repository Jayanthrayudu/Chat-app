import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { getToken, clearAuthStorage } from "../utils/storage";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every outgoing request that has one.
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A single place other modules can register a callback for "session died,
// please redirect to /login". AuthContext sets this on mount.
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuthStorage();
      if (typeof onUnauthorized === "function") {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
