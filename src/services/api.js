/**
 * API CLIENT
 * ─────────────────────────────────────────────────────────────
 * Central HTTP client for all backend calls.
 * - Attaches Authorization header from stored accessToken
 * - Auto-refreshes token on 401 using refreshToken
 * - All methods throw a normalised { message, status } error
 *
 * Change BASE_URL to point at your server.
 */

export const BASE_URL = "http://localhost:3000/api";

// ── Token helpers (sessionStorage = cleared on tab close) ────
export const TokenStore = {
  getAccess:   () => sessionStorage.getItem("accessToken"),
  getRefresh:  () => sessionStorage.getItem("refreshToken"),
  setTokens:   (access, refresh) => {
    sessionStorage.setItem("accessToken",  access);
    if (refresh) sessionStorage.setItem("refreshToken", refresh);
  },
  clear:       () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  },
};

// ── Core fetch wrapper ───────────────────────────────────────
async function request(path, options = {}, retry = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = TokenStore.getAccess();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Token expired → try refresh once
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, options, false);
    TokenStore.clear();
    window.dispatchEvent(new Event("auth:logout"));
    throw { message: "Session expired. Please log in again.", status: 401 };
  }

  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      errMsg = body.message || body.error || errMsg;
    } catch (_) {}
    throw { message: errMsg, status: res.status };
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

async function tryRefresh() {
  const refreshToken = TokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    TokenStore.setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch (_) {
    return false;
  }
}

// ── Exported methods ─────────────────────────────────────────
export const api = {
  get:    (path, opts)         => request(path, { method: "GET", ...opts }),
  post:   (path, body, opts)   => request(path, { method: "POST",   body: JSON.stringify(body), ...opts }),
  put:    (path, body, opts)   => request(path, { method: "PUT",    body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts)   => request(path, { method: "PATCH",  body: JSON.stringify(body), ...opts }),
  delete: (path, opts)         => request(path, { method: "DELETE", ...opts }),
};
