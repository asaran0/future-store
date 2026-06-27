/**
 * STORE CONTEXT + ASYNC THUNKS
 * All API calls are made here. Components only dispatch actions or call named thunks.
 *
 * Data strategy:
 *  - Always fetch from live API first
 *  - On error: set products/categories/industries .error — UI layer decides to show
 *    fallback static data or an error banner (never silently swapped here)
 *  - Static fallback data lives in /data/foxfury.js and is used ONLY when .error is set
 */
import { createContext, useContext, useReducer, useEffect } from "react";
import { appReducer, initialState } from "./reducer";
import { login, register, logout as logoutSvc } from "../services/authService";
import {
  getProducts, getCategories, getIndustries,
  createProduct, createCategory, createIndustry,
  addVariant, addMedia,
  assignIndustryToProduct,
  updateStockBalance, reserveStock, shipReservedStock, getVariantStock,
  getWarehouses, createWarehouse,
} from "../services/productService";
import { TokenStore } from "../services/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {

    // ── AUTH ──────────────────────────────────────────────────
    login: async (creds) => {
      try {
        const data = await login(creds);
        // Backend login returns { message, accessToken, refreshToken }
        // Decode user info from the JWT payload
        const user = parseJWT(data.accessToken) || { email: creds.email, first_name: creds.email.split("@")[0] };
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { ok: true };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    register: async (formData) => {
      try {
        // POST /api/auth/register → { message, user }
        const regData = await register(formData);
        // Auto-login after registration
        const loginData = await login({ email: formData.email, password: formData.password });
        const user = regData.user || parseJWT(loginData.accessToken) || {
          email: formData.email,
          first_name: formData.firstName,
          last_name:  formData.lastName,
        };
        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        return { ok: true };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    logout: async () => {
      await logoutSvc(); // calls POST /api/auth/logout, clears tokens
      dispatch({ type: "LOGOUT" });
    },

    // ── PRODUCTS — GET /api/products ──────────────────────────
    fetchProducts: async () => {
      dispatch({ type: "PRODUCTS_LOADING" });
      try {
        const data = await getProducts();
        dispatch({ type: "PRODUCTS_SUCCESS", payload: Array.isArray(data) ? data : [] });
      } catch (err) {
        dispatch({ type: "PRODUCTS_ERROR", payload: err.message });
      }
    },

    // ── PRODUCTS — POST /api/products ─────────────────────────
    createProduct: async (payload) => {
      try {
        const product = await createProduct(payload);
        dispatch({ type: "PRODUCT_CREATED", payload: product });
        return { ok: true, data: product };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── VARIANTS — POST /api/products/:id/variants ────────────
    addVariant: async (productId, payload) => {
      try {
        const variant = await addVariant(productId, payload);
        dispatch({ type: "VARIANT_ADDED", payload: { productId, variant } });
        return { ok: true, data: variant };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── MEDIA — POST /api/products/:id/media ──────────────────
    addMedia: async (productId, payload) => {
      try {
        const media = await addMedia(productId, payload);
        dispatch({ type: "MEDIA_ADDED", payload: { productId, media } });
        return { ok: true, data: media };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── CATEGORIES — GET /api/categories ─────────────────────
    fetchCategories: async () => {
      dispatch({ type: "CATEGORIES_LOADING" });
      try {
        const data = await getCategories();
        dispatch({ type: "CATEGORIES_SUCCESS", payload: Array.isArray(data) ? data : [] });
      } catch (err) {
        dispatch({ type: "CATEGORIES_ERROR", payload: err.message });
      }
    },

    // ── CATEGORIES — POST /api/categories (auth required) ─────
    createCategory: async (payload) => {
      try {
        const cat = await createCategory(payload);
        dispatch({ type: "CATEGORY_CREATED", payload: cat });
        return { ok: true, data: cat };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── INDUSTRIES — GET /api/industry ────────────────────────
    // Response shape: { success: true, data: Industry[] }
    fetchIndustries: async () => {
      dispatch({ type: "INDUSTRIES_LOADING" });
      try {
        const res = await getIndustries();
        // Unwrap { success, data } envelope
        const data = res?.data || res || [];
        dispatch({ type: "INDUSTRIES_SUCCESS", payload: Array.isArray(data) ? data : [] });
      } catch (err) {
        dispatch({ type: "INDUSTRIES_ERROR", payload: err.message });
      }
    },

    // ── INDUSTRIES — POST /api/industry ───────────────────────
    // Response shape: { success: true, data: Industry }
    createIndustry: async (payload) => {
      try {
        const res = await createIndustry(payload);
        const industry = res?.data || res;
        dispatch({ type: "INDUSTRY_CREATED", payload: industry });
        return { ok: true, data: industry };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── ASSIGN — POST /api/assign ─────────────────────────────
    // body: { productId, industryId }
    // Response: { success, data: ProductIndustry }
    assignIndustry: async (productId, industryId) => {
      try {
        const res = await assignIndustryToProduct(productId, industryId);
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "success", msg: "Industry assigned to product!" } });
        return { ok: true, data: res?.data || res };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    // ── INVENTORY ─────────────────────────────────────────────
    // POST /api/inventory/update  body: { variant_id, warehouse_id, qty_available, qty_reserved }
    updateStock: async (payload) => {
      try {
        const res = await updateStockBalance(payload);
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "success", msg: "Stock updated." } });
        return { ok: true, data: res };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },
    // POST /api/inventory/reserve  body: { variant_id, warehouse_id, quantity }
    reserveStock: async (payload) => {
      try {
        const res = await reserveStock(payload);
        return { ok: true, data: res };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },
    // POST /api/inventory/ship  body: { variant_id, warehouse_id, quantity }
    shipStock: async (payload) => {
      try {
        const res = await shipReservedStock(payload);
        return { ok: true, data: res };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },
    // GET /api/inventory/variant/:variantId
    getVariantStock: async (variantId) => {
      try {
        const res = await getVariantStock(variantId);
        return { ok: true, data: res };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },

    // ── WAREHOUSES ────────────────────────────────────────────
    fetchWarehouses: async () => {
      try {
        const res = await getWarehouses();
        dispatch({ type: "WAREHOUSES_SUCCESS", payload: Array.isArray(res) ? res : [] });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    createWarehouse: async (payload) => {
      try {
        const res = await createWarehouse(payload);
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "success", msg: `Warehouse "${res.name}" created!` } });
        return { ok: true, data: res };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },
  };

  // ── Session expiry listener ───────────────────────────────
  useEffect(() => {
    const h = () => dispatch({ type: "LOGOUT" });
    window.addEventListener("auth:logout", h);
    return () => window.removeEventListener("auth:logout", h);
  }, []);

  // ── Restore session from stored JWT on page load ──────────
  useEffect(() => {
    const token = TokenStore.getAccess();
    if (token) {
      const user = parseJWT(token);
      if (user) dispatch({ type: "LOGIN_SUCCESS", payload: user });
    }
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

// ── JWT payload decoder (no signature validation needed client-side) ──
function parseJWT(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    // Backend signs: { id, email, user_type }
    return {
      id:         payload.id,
      email:      payload.email,
      user_type:  payload.user_type,
      first_name: payload.first_name || payload.email?.split("@")[0] || "User",
      last_name:  payload.last_name  || "",
    };
  } catch {
    return null;
  }
}
