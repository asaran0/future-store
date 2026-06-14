import { createContext, useContext, useReducer, useEffect } from "react";
import { appReducer, initialState } from "./reducer";
import { login, register, logout as logoutService } from "../services/authService";
import { getProducts, getCategories, createProduct, createCategory, addVariant, addMedia } from "../services/productService";
import { TokenStore } from "../services/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {

    // ── AUTH ────────────────────────────────────────────────
    login: async (creds) => {
      try {
        const data = await login(creds);
        const user = data.user || parseTokenPayload(data.accessToken);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { ok: true };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    register: async (formData) => {
      try {
        const regData = await register(formData);
        const loginData = await login({ email: formData.email, password: formData.password });
        const user = regData.user || parseTokenPayload(loginData.accessToken);
        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        return { ok: true };
      } catch (err) {
        dispatch({ type: "SHOW_NOTIFICATION", payload: { type: "error", msg: err.message } });
        return { ok: false, error: err.message };
      }
    },

    logout: () => {
      logoutService();
      dispatch({ type: "LOGOUT" });
    },

    // ── PRODUCTS ─────────────────────────────────────────────
    fetchProducts: async () => {
      dispatch({ type: "PRODUCTS_LOADING" });
      try {
        const data = await getProducts();
        dispatch({ type: "PRODUCTS_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "PRODUCTS_ERROR", payload: err.message });
      }
    },

    /** Admin: create new product via API */
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

    /** Admin: add variant to an existing product */
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

    /** Admin: add media to an existing product */
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

    // ── CATEGORIES ────────────────────────────────────────────
    fetchCategories: async () => {
      dispatch({ type: "CATEGORIES_LOADING" });
      try {
        const data = await getCategories();
        dispatch({ type: "CATEGORIES_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "CATEGORIES_ERROR", payload: err.message });
      }
    },

    /** Admin: create category or subcategory */
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
  };

  // Session expiry
  useEffect(() => {
    const handler = () => dispatch({ type: "LOGOUT" });
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  // Restore session from stored token
  useEffect(() => {
    const token = TokenStore.getAccess();
    if (token) {
      const user = parseTokenPayload(token);
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

function parseTokenPayload(token) {
  try {
    const b64  = token.split(".")[1];
    const json = JSON.parse(atob(b64.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id:         json.id,
      email:      json.email,
      user_type:  json.user_type,
      first_name: json.first_name || json.email?.split("@")[0] || "User",
      last_name:  json.last_name  || "",
    };
  } catch (_) {
    return null;
  }
}
