/**
 * BASE API CLIENT  — FoxFury Backend
 * Base URL: http://localhost:5000/api
 *
 * Handles:
 *  - JWT Bearer token attachment on every request
 *  - Automatic token refresh via POST /api/auth/refresh-token on 401
 *  - Network-level failures (server down, CORS) with clear error messages
 *  - Throws structured { message, status } — never silent fallbacks here
 */

export const BASE_URL = "http://localhost:3000/api/v1";

// ── Token storage (sessionStorage — cleared on tab close) ─────
export const TokenStore = {
  getAccess:  () => sessionStorage.getItem("ff_access"),
  getRefresh: () => sessionStorage.getItem("ff_refresh"),
  set: (access, refresh) => {
    sessionStorage.setItem("ff_access", access);
    if (refresh) sessionStorage.setItem("ff_refresh", refresh);
  },
  clear: () => {
    sessionStorage.removeItem("ff_access");
    sessionStorage.removeItem("ff_refresh");
  },
};

// ── Core fetch wrapper ────────────────────────────────────────
async function request(path, options = {}, retry = true) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = TokenStore.getAccess();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    // Network error — server down, no internet, CORS preflight failed
    throw {
      message: "Cannot reach the server. Make sure the FoxFury backend is running on localhost:5000.",
      status: 0,
    };
  }

  // 401 → try refresh once, then force logout
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, options, false);
    TokenStore.clear();
    window.dispatchEvent(new Event("auth:logout"));
    throw { message: "Session expired. Please sign in again.", status: 401 };
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const b = await res.json();
      msg = b.message || b.error || msg;
    } catch (_) {}
    throw { message: msg, status: res.status };
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Token refresh — POST /api/auth/refresh-token ──────────────
async function tryRefresh() {
  const rt = TokenStore.getRefresh();
  if (!rt) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const d = await res.json();
    // refresh-token endpoint returns only { accessToken }
    TokenStore.set(d.accessToken, rt);
    return true;
  } catch {
    return false;
  }
}

// ── Public API ────────────────────────────────────────────────
export const api = {
  get:    (path, opts)       => request(path, { method: "GET",    ...opts }),
  post:   (path, body, opts) => request(path, { method: "POST",   body: JSON.stringify(body), ...opts }),
  put:    (path, body, opts) => request(path, { method: "PUT",    body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts) => request(path, { method: "PATCH",  body: JSON.stringify(body), ...opts }),
  delete: (path, opts)       => request(path, { method: "DELETE", ...opts }),
};
