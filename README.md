# FoxFury Lighting Solutions — Store v5

Enterprise React e-commerce fully integrated with the FoxFury backend API.

---

## Quick Start

```bash
# 1. Start the FoxFury backend
cd FFBackend-main
npm install && npm start        # runs on http://localhost:3000

# 2. Start the frontend (new terminal)
cd foxfury-store
npm install
npm start                       # runs on http://localhost:3001
```

---

## API Endpoints Integrated

### Auth  — `/api/auth/*`
| Method | Endpoint | Used In |
|--------|----------|---------|
| POST | `/api/auth/register` | Register form |
| POST | `/api/auth/login` | Login form — stores accessToken + refreshToken |
| POST | `/api/auth/logout` | Sign out button |
| POST | `/api/auth/refresh-token` | Auto-called on 401 to refresh session |

### Products — `/api/products/*`
| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | `/api/products` | Home featured + Shop grid |
| POST | `/api/products` | Admin → Add Product |
| POST | `/api/products/:id/variants` | Admin → Product Detail → Add Variant |
| POST | `/api/products/:id/media` | Admin → Product Detail → Add Media |

### Categories — `/api/categories`
| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | `/api/categories` | Shop sidebar + Admin Categories |
| POST | `/api/categories` | Admin → Add Category / Subcategory |

### Industries — `/api/industry/*`
| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | `/api/industry` | Home industries grid + Shop sidebar |
| POST | `/api/industry` | Admin → Industries → Create |
| GET | `/api/industry/:id/products` | Shop → filter by industry |

### Assign — `/api/assign`
| Method | Endpoint | Used In |
|--------|----------|---------|
| POST | `/api/assign` | Admin → Industries → Assign product |

### Inventory — `/api/inventory/*`
| Method | Endpoint | Used In |
|--------|----------|---------|
| POST | `/api/inventory/update` | Admin → Inventory → Update Stock |
| POST | `/api/inventory/reserve` | Admin → Inventory → Reserve Stock |
| POST | `/api/inventory/ship` | Admin → Inventory → Ship Stock |
| GET | `/api/inventory/variant/:id` | Admin → Inventory → Lookup |

### Warehouses — `/api/warehouses`
| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | `/api/warehouses` | Admin → Inventory sidebar |
| POST | `/api/warehouses` | Admin → Create Warehouse |

---

## Error Handling Strategy

- **API down / network error** → clear error banner shown, static fallback data displayed
- **401 Unauthorized** → auto token refresh attempted, then force logout
- **4xx / 5xx** → exact server error message shown in UI
- **No silent fallbacks** — every error is visible to the user with a Retry button

---

## File Structure

```
src/
├── services/
│   ├── api.js              ← Base HTTP client (token attach, auto-refresh, network errors)
│   ├── authService.js      ← register, login, logout, refresh-token
│   └── productService.js   ← all product, category, industry, inventory, warehouse calls
├── store/
│   ├── reducer.js          ← cart, wishlist, products, categories, industries, warehouses, ui
│   └── StoreContext.js     ← async thunks for every API endpoint
├── theme/
│   └── themes.js           ← black (default) · dark · cyber · light
├── data/
│   └── foxfury.js          ← static fallback data (shown ONLY when API errors)
├── components/
│   ├── GlobalStyles.jsx    ← all CSS (preview-image matched dark theme)
│   ├── Navbar.jsx          ← announcement bar + dropdowns + 4-theme switcher
│   ├── AuthModal.jsx       ← login / register tabs
│   ├── CartDrawer.jsx      ← slide-in cart
│   ├── ProductCard.jsx     ← product card + skeleton
│   ├── Notification.jsx    ← toast
│   └── admin/
│       ├── AdminLayout.jsx ← sidebar nav (Dashboard·Products·Categories·Industries·Inventory)
│       └── AdminFields.jsx ← form primitives
└── pages/
    ├── HomePage.jsx        ← hero (matches preview) · industries (API) · products (API) · banner · testimonials
    ├── ShopPage.jsx        ← industry sidebar (API) · category filter (API) · product grid (API)
    ├── WishlistPage.jsx
    ├── OrdersPage.jsx
    └── admin/
        ├── DashboardPage.jsx    ← stats from all APIs
        ├── CategoriesPage.jsx   ← create category/subcategory
        ├── ProductsPage.jsx     ← create product, list all
        ├── ProductDetailPage.jsx← add variants + media
        ├── IndustriesPage.jsx   ← create industry, assign products
        └── InventoryPage.jsx    ← warehouses + stock update/reserve/ship/lookup
```

---

## Themes

Click the 4 coloured dots in the navbar, or set default in `src/theme/themes.js`:
```js
export const ACTIVE_THEME = "black"; // "black" | "dark" | "cyber" | "light"
```
