# FoxFury Lighting Solutions — Store v4

Modern React e-commerce redesign of foxfury.com with full backend API integration and admin panel.

---

## Quick Start

```bash
npm install
npm start          # http://localhost:3001
```

> Backend API must be running at `http://localhost:3000`

---

## What's New in v4 (FoxFury Rebrand)

### Brand & Content
- **FoxFury branding** — logo, colors (yellow `#f5c518` accent), typography (Rajdhani display font)
- **Announcement bar** — "Free Shipping On Orders Over $99" pinned above nav
- **Navigation** — HOME | SHOP BY INDUSTRY ▾ | PRODUCTS ▾ | RESOURCES ▾ | CONTACT ▾ | FIND A DEALER ▾
- **Dropdown menus** — hover/click dropdowns with icons and descriptions per nav item
- **4 Themes** — Dark (default) · FoxFury Gold · Cyber · Light

### Homepage
- **3-slide animated hero** — Scene Lighting / Forensics / First Responder slides with auto-rotate
- **Shop by Industry grid** — 7 industry cards (Fire/EMS, Law Enforcement, Forensics, Military, Industrial, Drones, Film)
- **Nomad® spotlight banner** — product feature section with animated rings
- **Testimonials** — 4 real FoxFury customer quotes
- **Features strip** — Ships in 24hr · Extended Warranty · Industry Certified · Expert Support

### Shop Page
- **Industry sidebar** — filter products by all 7 industries
- **Product type filter** — Scene Lights, Headlamps, Flashlights, Shield Lights, etc.
- **12 FoxFury products** — Nomad® 360, Command+, Taker B30, Phlox Forensic, T.E.D.D Drone, etc.

### API Integration (unchanged from v2/v3)
| Endpoint | Used For |
|---|---|
| `POST /api/auth/register` | Register form |
| `POST /api/auth/login` | Login form |
| `GET /api/categories` | Shop category pills |
| `GET /api/products` | Product grid (static fallback if empty) |
| `POST /api/categories` | Admin — add category |
| `POST /api/products` | Admin — add product |
| `POST /api/products/:id/variants` | Admin — add variant |
| `POST /api/products/:id/media` | Admin — add media |

---

## Project Structure

```
src/
├── App.js
├── index.js
├── data/
│   └── foxfury.js          ← All FoxFury content: nav, industries, products, hero, testimonials
├── services/
│   ├── api.js              ← Base HTTP client (JWT attach, auto-refresh)
│   ├── authService.js      ← register(), login(), logout()
│   └── productService.js   ← getProducts(), getCategories(), createProduct(), etc.
├── store/
│   ├── reducer.js          ← Redux-style reducer with all actions
│   └── StoreContext.js     ← Context provider + async action thunks
├── theme/
│   └── themes.js           ← dark / foxfury / cyber / light + injectStyles()
├── components/
│   ├── GlobalStyles.jsx    ← All CSS (ff- store classes + adm- admin classes)
│   ├── Navbar.jsx          ← FoxFury nav with dropdowns + announcement bar
│   ├── AuthModal.jsx       ← Login/Register modal
│   ├── CartDrawer.jsx      ← Slide-in cart drawer
│   ├── ProductCard.jsx     ← FoxFury product card + skeleton
│   ├── Notification.jsx    ← Auto-dismiss toast
│   └── admin/
│       ├── AdminLayout.jsx
│       └── AdminFields.jsx
└── pages/
    ├── HomePage.jsx        ← Hero · Industries · Featured · Nomad Banner · Testimonials · Footer
    ├── ShopPage.jsx        ← Industry sidebar + product type filter + product grid
    ├── WishlistPage.jsx
    ├── OrdersPage.jsx
    └── admin/
        ├── DashboardPage.jsx
        ├── CategoriesPage.jsx
        ├── ProductsPage.jsx
        └── ProductDetailPage.jsx
```

---

## Switching Themes

Click the **4 colour dots** in the top-right navbar at runtime, or set default in `src/theme/themes.js`:

```js
export const ACTIVE_THEME = "dark"; // "dark" | "foxfury" | "cyber" | "light"
```

## Admin Panel

Sign in → click **⚙** in navbar → Admin Panel  
Sidebar: **Dashboard** · **Products** · **Categories**
