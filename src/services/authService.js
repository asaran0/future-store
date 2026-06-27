/**
 * AUTH SERVICE
 * Maps to /api/auth/* endpoints in the FoxFury backend.
 *
 * Endpoints:
 *   POST /api/auth/register      → { message, user }
 *   POST /api/auth/login         → { message, accessToken, refreshToken }
 *   POST /api/auth/logout        → requires Bearer + { refreshToken } in body
 *   POST /api/auth/refresh-token → { accessToken }
 */
import { api, TokenStore } from "./api";

/**
 * Register a new user.
 * Backend expects: email, password, first_name, last_name, user_type
 */
export async function register(data) {
  return api.post("/auth/register", {
    email:      data.email,
    password:   data.password,
    first_name: data.firstName,
    last_name:  data.lastName,
    user_type:  data.userType || "retail",
  });
}

/**
 * Login — stores both tokens in sessionStorage on success.
 * Returns { message, accessToken, refreshToken }
 */
export async function login(creds) {
  const data = await api.post("/auth/login", {
    email:    creds.email,
    password: creds.password,
  });
  TokenStore.set(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Logout — invalidates the session on the server (requires valid token).
 * Falls back gracefully if backend is unreachable.
 */
export async function logout() {
  const rt = TokenStore.getRefresh();
  try {
    if (rt) {
      // Backend requires refreshToken in body + Bearer header (handled by api.post)
      await api.post("/auth/logout", { refreshToken: rt });
    }
  } catch (_) {
    // Ignore network errors on logout — still clear local tokens
  } finally {
    TokenStore.clear();
    window.dispatchEvent(new Event("auth:logout"));
  }
}

export const isAuthenticated = () => Boolean(TokenStore.getAccess());
