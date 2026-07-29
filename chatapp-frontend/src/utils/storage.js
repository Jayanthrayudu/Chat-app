import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./constants";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // localStorage unavailable (private browsing, etc.) - fail silently,
    // the user will simply be logged out on refresh.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* noop */
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function clearAuthStorage() {
  clearToken();
  clearStoredUser();
}
