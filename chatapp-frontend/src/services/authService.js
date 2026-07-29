import api from "./api";

/**
 * POST /api/auth/login
 * Request:  { username, password }
 * Response: { token: "<JWT>" }
 *
 * ASSUMPTION: your backend's login response field is exactly "token".
 * If it differs (e.g. "accessToken"), update the destructure below.
 */
export async function login(usernameOrEmail, password) {
  const response = await api.post("/auth/login", {
    usernameOrEmail,
    password,
  });

  return response.data.token;
}

/**
 * POST /api/auth/register
 *
 * ASSUMPTION: since the exact registration contract wasn't specified,
 * this sends the common { username, password, email } shape. Adjust the
 * body/response handling here once you confirm your backend's actual
 * registration endpoint and fields.
 */
export async function register(username, password, email) {
  const response = await api.post("/auth/register", { username, password, email });
  return response.data;
}
