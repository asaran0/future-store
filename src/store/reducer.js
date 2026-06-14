/**
 * GLOBAL STORE — Redux-style reducer
 * State shape:
 *   cart, wishlist, user, products, categories,
 *   ui, filters, orders, theme, admin
 */

import { ACTIVE_THEME } from "../theme/themes";

export const initialState = {
  cart:       [],
  wishlist:   [],
  user:       null,
  products:   { data: [], loading: false, error: null },
  categories: { data: [], loading: false, error: null },
  ui: {
    cartOpen:     false,
    notification: null,
    authModal:    null,
  },
  filters: { category: "all", sort: "featured", search: "" },
  orders:  [],
  theme:   ACTIVE_THEME,
  admin: {
    // selected product in admin product detail view
    selectedProduct: null,
  },
};

export function appReducer(state, action) {
  switch (action.type) {

    // ── PRODUCTS ──────────────────────────────────────────────
    case "PRODUCTS_LOADING":
      return { ...state, products: { ...state.products, loading: true, error: null } };
    case "PRODUCTS_SUCCESS":
      return { ...state, products: { data: action.payload, loading: false, error: null } };
    case "PRODUCTS_ERROR":
      return { ...state, products: { ...state.products, loading: false, error: action.payload } };

    // Prepend a newly created product to the list
    case "PRODUCT_CREATED":
      return {
        ...state,
        products: { ...state.products, data: [action.payload, ...state.products.data] },
        ui: { ...state.ui, notification: { type: "success", msg: `Product "${action.payload.name}" created!` } },
      };

    // Add variant to a product already in state
    case "VARIANT_ADDED": {
      const { productId, variant } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          data: state.products.data.map((p) =>
            p.id === productId
              ? { ...p, ProductVariants: [...(p.ProductVariants || []), variant] }
              : p
          ),
        },
        ui: { ...state.ui, notification: { type: "success", msg: `Variant "${variant.variant_name}" added!` } },
      };
    }

    // Add media to a product already in state
    case "MEDIA_ADDED": {
      const { productId, media } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          data: state.products.data.map((p) =>
            p.id === productId
              ? { ...p, ProductMedia: [...(p.ProductMedia || []), media] }
              : p
          ),
        },
        ui: { ...state.ui, notification: { type: "success", msg: "Media added!" } },
      };
    }

    // ── CATEGORIES ────────────────────────────────────────────
    case "CATEGORIES_LOADING":
      return { ...state, categories: { ...state.categories, loading: true, error: null } };
    case "CATEGORIES_SUCCESS":
      return { ...state, categories: { data: action.payload, loading: false, error: null } };
    case "CATEGORIES_ERROR":
      return { ...state, categories: { ...state.categories, loading: false, error: action.payload } };

    case "CATEGORY_CREATED":
      return {
        ...state,
        categories: { ...state.categories, data: [...state.categories.data, action.payload] },
        ui: { ...state.ui, notification: { type: "success", msg: `Category "${action.payload.name}" created!` } },
      };

    // ── CART ──────────────────────────────────────────────────
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      return {
        ...state,
        cart: existing
          ? state.cart.map((i) => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.cart, { ...action.payload, qty: 1 }],
        ui: { ...state.ui, notification: { type: "success", msg: `${action.payload.name} added to cart` } },
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };

    // ── WISHLIST ──────────────────────────────────────────────
    case "TOGGLE_WISHLIST": {
      const inWish = state.wishlist.find((i) => i.id === action.payload.id);
      return {
        ...state,
        wishlist: inWish
          ? state.wishlist.filter((i) => i.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }

    // ── FILTERS ───────────────────────────────────────────────
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    // ── UI ────────────────────────────────────────────────────
    case "TOGGLE_CART":
      return { ...state, ui: { ...state.ui, cartOpen: !state.ui.cartOpen } };
    case "OPEN_AUTH_MODAL":
      return { ...state, ui: { ...state.ui, authModal: action.payload } };
    case "CLOSE_AUTH_MODAL":
      return { ...state, ui: { ...state.ui, authModal: null } };
    case "SHOW_NOTIFICATION":
      return { ...state, ui: { ...state.ui, notification: action.payload } };
    case "CLEAR_NOTIFICATION":
      return { ...state, ui: { ...state.ui, notification: null } };

    // ── AUTH ──────────────────────────────────────────────────
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        ui: {
          ...state.ui,
          authModal: null,
          notification: { type: "success", msg: `Welcome back, ${action.payload.first_name || action.payload.email}!` },
        },
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        ui: {
          ...state.ui,
          authModal: null,
          notification: { type: "success", msg: `Account created! Welcome, ${action.payload.first_name}!` },
        },
      };
    case "LOGOUT":
      return {
        ...state,
        user: null, cart: [], wishlist: [],
        ui: { ...state.ui, notification: { type: "success", msg: "Signed out successfully." } },
      };

    // ── ORDERS ────────────────────────────────────────────────
    case "PLACE_ORDER": {
      const order = {
        id:     `ORD-${Date.now()}`,
        items:  state.cart,
        date:   new Date().toISOString(),
        status: "processing",
        total:  state.cart.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0),
      };
      return {
        ...state,
        cart: [], orders: [...state.orders, order],
        ui: { ...state.ui, cartOpen: false, notification: { type: "success", msg: "Order placed successfully!" } },
      };
    }

    // ── ADMIN ─────────────────────────────────────────────────
    case "ADMIN_SELECT_PRODUCT":
      return { ...state, admin: { ...state.admin, selectedProduct: action.payload } };

    // ── THEME ─────────────────────────────────────────────────
    case "SET_THEME":
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}
