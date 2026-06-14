/**
 * AUTH SERVICE
 * Wraps /api/auth/* endpoints.
 */

import { api, TokenStore } from "./api";

/**
 * Register a new user.
 * @param {{ email, password, first_name, last_name, user_type }} data
 * @returns {{ message, user }}
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
 * Login and persist tokens.
 * @param {{ email, password }} creds
 * @returns {{ message, accessToken, refreshToken, user? }}
 */
export async function login(creds) {
  const data = await api.post("/auth/login", {
    email:    creds.email,
    password: creds.password,
  });
  TokenStore.setTokens(data.accessToken, data.refreshToken);
  return data;
}

/** Remove tokens and fire logout event. */
export function logout() {
  TokenStore.clear();
  window.dispatchEvent(new Event("auth:logout"));
}

/** True if an accessToken is currently stored. */
export function isAuthenticated() {
  return Boolean(TokenStore.getAccess());
}
