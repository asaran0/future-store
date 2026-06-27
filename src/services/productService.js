/**
 * PRODUCT & CATEGORY & INDUSTRY SERVICE
 * Maps to all product/category/industry/inventory/warehouse endpoints.
 *
 * ── PRODUCTS (/api/products) ─────────────────────────────────
 *   GET    /api/products                      → Product[]
 *   POST   /api/products                      → Product
 *   GET    /api/products/:id                  → Product
 *   PUT    /api/products/:id                  → Product
 *   DELETE /api/products/:id                  → void
 *   POST   /api/products/:productId/variants  → ProductVariant
 *   POST   /api/products/:productId/media     → ProductMedia
 *
 * ── CATEGORIES (/api/categories) ─────────────────────────────
 *   GET    /api/categories                    → Category[]   (with SubCategories[])
 *   POST   /api/categories                    → Category     (auth required)
 *   PUT    /api/categories/:id                → Category     (auth required)
 *   DELETE /api/categories/:id                → void         (auth required)
 *
 * ── INDUSTRIES (/api/industry) ───────────────────────────────
 *   GET    /api/industry                      → { success, data: Industry[] }
 *   POST   /api/industry                      → { success, data: Industry }
 *   GET    /api/industry/:id                  → { success, data: Industry }
 *   PUT    /api/industry/:id                  → { success, data: Industry }
 *   DELETE /api/industry/:id                  → { success, message }
 *   GET    /api/industry/:industryId/products → { success, industry, totalProducts, products[] }
 *
 * ── PRODUCT ↔ INDUSTRY (/api/assign) ─────────────────────────
 *   POST   /api/assign                        → { success, data: ProductIndustry }
 *     body: { productId, industryId }
 *
 * ── INVENTORY (/api/inventory) ───────────────────────────────
 *   POST   /api/inventory/update              → update stock balance
 *   POST   /api/inventory/reserve             → reserve stock
 *   POST   /api/inventory/ship                → ship reserved stock
 *   GET    /api/inventory/variant/:variantId  → stock logs for a variant
 *
 * ── WAREHOUSES (/api/warehouses) ─────────────────────────────
 *   GET    /api/warehouses                    → Warehouse[]
 *   POST   /api/warehouses                    → Warehouse
 */
import { api } from "./api";

// ── Products ──────────────────────────────────────────────────
export const getProducts        = ()                     => api.get("/products");
export const getProductById     = (id)                   => api.get(`/products/${id}`);
export const createProduct      = (data)                 => api.post("/products", data);
export const updateProduct      = (id, data)             => api.put(`/products/${id}`, data);
export const deleteProduct      = (id)                   => api.delete(`/products/${id}`);
export const addVariant         = (productId, data)      => api.post(`/products/${productId}/variants`, data);
export const addMedia           = (productId, data)      => api.post(`/products/${productId}/media`, data);

// ── Categories ────────────────────────────────────────────────
export const getCategories      = ()                     => api.get("/categories");
export const createCategory     = (data)                 => api.post("/categories", data);
export const updateCategory     = (id, data)             => api.put(`/categories/${id}`, data);
export const deleteCategory     = (id)                   => api.delete(`/categories/${id}`);

// ── Industries ────────────────────────────────────────────────
// NOTE: all industry endpoints return { success: bool, data: ... }
export const getIndustries      = ()                     => api.get("/industry");
export const getIndustryById    = (id)                   => api.get(`/industry/${id}`);
export const createIndustry     = (data)                 => api.post("/industry", data);
export const updateIndustry     = (id, data)             => api.put(`/industry/${id}`, data);
export const deleteIndustry     = (id)                   => api.delete(`/industry/${id}`);
// Returns { success, industry, totalProducts, products[] }
export const getProductsByIndustry = (industryId)        => api.get(`/industry/${industryId}/products`);

// ── Product ↔ Industry assignment ────────────────────────────
// body: { productId, industryId }
export const assignIndustryToProduct = (productId, industryId) =>
  api.post("/assign", { productId, industryId });

// ── Inventory (Stock) ─────────────────────────────────────────
export const updateStockBalance = (data)                 => api.post("/inventory/update",  data);
export const reserveStock       = (data)                 => api.post("/inventory/reserve", data);
export const shipReservedStock  = (data)                 => api.post("/inventory/ship",    data);
export const getVariantStock    = (variantId)            => api.get(`/inventory/variant/${variantId}`);

// ── Warehouses ────────────────────────────────────────────────
export const getWarehouses      = ()                     => api.get("/warehouses");
export const createWarehouse    = (data)                 => api.post("/warehouses", data);

// ── Helpers ───────────────────────────────────────────────────
/** Returns the URL of the primary (or first) product image, or null */
export const getPrimaryImage = (product) => {
  if (!product?.ProductMedia?.length) return null;
  const primary = product.ProductMedia.find((m) => m.is_primary);
  return (primary || product.ProductMedia[0])?.url || null;
};

/** Returns the lowest MSRP across all variants, or null */
export const getStartingPrice = (product) => {
  if (!product?.ProductVariants?.length) return null;
  const prices = product.ProductVariants.map((v) => parseFloat(v.msrp || 0)).filter((n) => n > 0);
  return prices.length ? Math.min(...prices) : null;
};
