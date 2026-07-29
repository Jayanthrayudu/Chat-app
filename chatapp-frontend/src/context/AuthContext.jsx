import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";
import { registerUnauthorizedHandler } from "../services/api";
import { disconnect as disconnectWs } from "../services/websocketService";
import {
  getToken,
  setToken as persistToken,
  clearAuthStorage,
  getStoredUser,
  setStoredUser,
} from "../utils/storage";

export const AuthContext = createContext(null);

function decodeUserFromToken(token) {
  try {
    const payload = jwtDecode(token);
    // JWT validation always happens server-side; this is purely for
    // showing a display name/avatar without an extra round trip.
    return {
      username: payload.sub || payload.username || null,
      exp: payload.exp || null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    disconnectWs();
    clearAuthStorage();
    setTokenState(null);
    setUser(null);
  }, []);

  // Wire the axios 401 interceptor to our logout + redirect handling.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      disconnectWs();
      clearAuthStorage();
      setTokenState(null);
      setUser(null);
    });
  }, []);

  // On mount, restore session from localStorage if a token is present.
  useEffect(() => {
    const existingToken = getToken();
    if (existingToken) {
      const decoded = decodeUserFromToken(existingToken);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        // Expired JWT - clear it rather than pretending the user is logged in.
        clearAuthStorage();
        setTokenState(null);
        setUser(null);
      } else {
        setTokenState(existingToken);
        setUser((prev) => prev || decoded);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    const jwt = await authService.login(username, password);
    const decoded = decodeUserFromToken(jwt);
    persistToken(jwt);
    setStoredUser(decoded);
    setTokenState(jwt);
    setUser(decoded);
    return jwt;
  }, []);

  const register = useCallback(async (username, password, email) => {
    setError(null);
    return authService.register(username, password, email);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      error,
      login,
      register,
      logout,
      setError,
    }),
    [token, user, isLoading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
