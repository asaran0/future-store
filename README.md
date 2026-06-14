# N.JEY FUTURE STORE v2.0

Enterprise React e-commerce with full backend API integration.

---

## Quick Start

```bash
npm install
npm start          # http://localhost:3001
```

> Make sure your backend is running at `http://localhost:3000`

---

## Project Structure

```
future-store/
├── public/
│   └── index.html
└── src/
    ├── App.js                        ← Root — wires store + page router
    ├── index.js                      ← ReactDOM entry
    │
    ├── services/
    │   ├── api.js                    ← Base HTTP client (token attach, auto-refresh, 401 handling)
    │   ├── authService.js            ← register(), login(), logout(), isAuthenticated()
    │   └── productService.js         ← getProducts(), getCategories(), createProduct(), etc.
    │
    ├── store/
    │   ├── reducer.js                ← All Redux-style actions + state shape (comments inline)
    │   └── StoreContext.js           ← Context provider + useStore() + async action thunks
    │
    ├── theme/
    │   └── themes.js                 ← 3 themes (dark/cyber/light) + injectStyles()
    │
    ├── components/
    │   ├── GlobalStyles.jsx          ← All CSS injected via JS (zero CSS files needed)
    │   ├── Navbar.jsx                ← Nav + theme switcher + auth buttons
    │   ├── AuthModal.jsx             ← Login/Register modal with tabs + validation
    │   ├── CartDrawer.jsx            ← Slide-in cart with qty controls + order placement
    │   ├── ProductCard.jsx           ← API-shaped product card + skeleton loader
    │   └── Notification.jsx          ← Auto-dismiss toast
    │
    └── pages/
        ├── HomePage.jsx              ← Hero + features + featured products (live from API)
        ├── ShopPage.jsx              ← Full catalog with API categories + search/sort/filter
        ├── WishlistPage.jsx          ← Saved items + add-all-to-cart
        └── OrdersPage.jsx            ← Order history (placed locally)
```

---

## API Endpoints Used

| # | Method | Endpoint                              | Used In              |
|---|--------|---------------------------------------|----------------------|
| 1 | POST   | `/api/auth/register`                  | AuthModal (Register) |
| 2 | POST   | `/api/auth/login`                     | AuthModal (Login)    |
| 3 | GET    | `/api/categories`                     | ShopPage filter pills|
| 4 | GET    | `/api/products`                       | HomePage + ShopPage  |

> Other endpoints (add category, add product, add variant, add media) are available
> in `productService.js` — wire them into admin pages as needed.

---

## Changing the API Base URL

Open `src/services/api.js` and update:

```js
export const BASE_URL = "http://localhost:3000/api";
//                       ↑ change this for staging/production
```

---

## Auth Flow

1. User clicks **SIGN IN** or **REGISTER** in navbar → opens `AuthModal`
2. On successful register → auto-logs in (calls `/login` internally)
3. JWT `accessToken` + `refreshToken` stored in `sessionStorage`
4. Every API request attaches `Authorization: Bearer <accessToken>` automatically
5. On 401 → client silently tries to refresh via `/api/auth/refresh`
6. On failed refresh → fires `auth:logout` event → store clears user state
7. On page reload → token parsed from `sessionStorage`, user restored from JWT payload

---

## Switching Themes

**Default** — edit `src/theme/themes.js`:
```js
export const ACTIVE_THEME = "dark"; // "dark" | "cyber" | "light"
```

**At runtime** — click the 3 colour dots in the navbar.

**Add a custom theme** — add a new key to the `THEMES` object and a colour dot in
`Navbar.jsx`'s `THEME_COLORS` map.

---

## State Shape (store/reducer.js)

```js
{
  cart:       CartItem[],
  wishlist:   Product[],
  user:       null | { id, email, first_name, last_name, user_type },
  products:   { data: Product[], loading: boolean, error: string|null },
  categories: { data: Category[], loading: boolean, error: string|null },
  ui:         { cartOpen, notification, authModal },
  filters:    { category: "all"|<id>, sort: string, search: string },
  orders:     Order[],
  theme:      "dark"|"cyber"|"light"
}
```

## Dispatching Actions

```js
import { useStore } from "./store/StoreContext";

const { state, dispatch, actions } = useStore();

// Async thunks (call API then dispatch)
await actions.login({ email, password });
await actions.register({ email, password, firstName, lastName, userType });
actions.logout();
await actions.fetchProducts();
await actions.fetchCategories();

// Sync dispatches
dispatch({ type: "ADD_TO_CART",      payload: product });
dispatch({ type: "TOGGLE_WISHLIST",  payload: product });
dispatch({ type: "SET_FILTER",       payload: { category: "id", search: "q" } });
dispatch({ type: "SET_THEME",        payload: "cyber" });
dispatch({ type: "OPEN_AUTH_MODAL",  payload: "login" });   // or "register"
dispatch({ type: "CLOSE_AUTH_MODAL" });
dispatch({ type: "PLACE_ORDER" });
```

---

## Admin Panel (v3 addition)

### Access
Sign in → click the **⚙** gear icon in the navbar → Admin Panel

### Pages

| Page | Route key | What you can do |
|------|-----------|-----------------|
| Dashboard | `admin-dashboard` | Store stats, recent products, category overview |
| Categories | `admin-categories` | Add root categories, add subcategories, view all |
| Products | `admin-products` | Add products, search/filter, click Manage → |
| Product Detail | `admin-product-detail` | Add variants (SKU/color/price), add media URLs |

### New store actions (all wired to your backend)

```js
// Create category     → POST /api/categories
await actions.createCategory({ name, slug, parent_id? });

// Create product      → POST /api/products
await actions.createProduct({ sku, slug, name, description, category_id, brand });

// Add variant         → POST /api/products/:id/variants
await actions.addVariant(productId, { sku, variant_name, color, msrp, cost });

// Add media           → POST /api/products/:id/media
await actions.addMedia(productId, { url, media_type, is_primary });
```

### New reducer actions
```
PRODUCT_CREATED      — prepends new product to products.data
VARIANT_ADDED        — appends variant to the product in state
MEDIA_ADDED          — appends media to the product in state
CATEGORY_CREATED     — appends new category to categories.data
ADMIN_SELECT_PRODUCT — sets state.admin.selectedProduct for detail view
```
