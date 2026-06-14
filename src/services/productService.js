/**
 * PRODUCT & CATEGORY SERVICE
 * Wraps /api/products and /api/categories endpoints.
 */

import { api } from "./api";

// ── Categories ───────────────────────────────────────────────

/** GET /api/categories — returns flat list with SubCategories nested */
export const getCategories = () => api.get("/categories");

/**
 * POST /api/categories
 * @param {{ name, slug, parent_id? }} data
 */
export const createCategory = (data) => api.post("/categories", data);

// ── Products ─────────────────────────────────────────────────

/** GET /api/products — returns products with variants and media */
export const getProducts = () => api.get("/products");

/**
 * POST /api/products
 * @param {{ sku, slug, name, description, category_id, brand }} data
 */
export const createProduct = (data) => api.post("/products", data);

/**
 * POST /api/products/:id/variants
 * @param {string} productId
 * @param {{ sku, variant_name, color, msrp, cost }} data
 */
export const addVariant = (productId, data) =>
  api.post(`/products/${productId}/variants`, data);

/**
 * POST /api/products/:id/media
 * @param {string} productId
 * @param {{ url, media_type, is_primary }} data
 */
export const addMedia = (productId, data) =>
  api.post(`/products/${productId}/media`, data);

// ── Helpers ──────────────────────────────────────────────────

/** Returns only top-level categories (no parent_id) */
export const getRootCategories = async () => {
  const all = await getCategories();
  return all.filter((c) => !c.parent_id);
};

/** Returns the primary image URL for a product or a placeholder */
export const getPrimaryImage = (product) => {
  if (!product?.ProductMedia?.length) return null;
  const primary = product.ProductMedia.find((m) => m.is_primary);
  return (primary || product.ProductMedia[0])?.url || null;
};

/** Returns the lowest MSRP across all variants */
export const getStartingPrice = (product) => {
  if (!product?.ProductVariants?.length) return null;
  return Math.min(...product.ProductVariants.map((v) => parseFloat(v.msrp)));
};
