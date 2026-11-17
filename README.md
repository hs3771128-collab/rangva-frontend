# Rangva — Frontend

**Rangva** is a Pakistani hybrid store that sells **fashion** (clothing, footwear, accessories) and **beauty** (skincare, makeup, haircare, fragrance) in one unified storefront — with a fully Pakistani checkout: PKR pricing, cash on delivery, JazzCash / Easypaisa / bank transfer / card, and province + city based addresses.

> فیشن اور خوبصورتی

## Tech stack

| Tool | Purpose |
| --- | --- |
| React 19 + Vite | UI and dev server |
| Redux + redux-thunk | State and API actions |
| React Router | Routing |
| Tailwind CSS v4 | Styling (`src/index.css` theme tokens) |
| Axios | API client (`src/api/api.js`) |
| React Hook Form | Forms and validation |
| MUI | Data grid, pagination, small primitives |

## Getting started

```bash
npm install
cp .env.example .env     # then adjust URLs if needed
npm run dev              # http://localhost:5173
```

Backend must run on `http://localhost:8080` (see the `rangva-backend` repo).

### Environment variables

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_BACK_END_URL` | `http://localhost:8080` | Spring Boot API base URL |
| `VITE_FRONTEND_URL` | `http://localhost:5173` | Storefront URL |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server (5173) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Features

- **Unified catalogue** — one mixed grid with a Department toggle: All / Fashion / Beauty.
- **Advanced filters** — keyword search, category, brand, price band, size chips, sort by newest or price.
- **Product detail page** — gallery, variants (size / shade / volume), stock awareness, quantity picker, rating breakdown, review list and "write a review" form, related products.
- **Wishlist** — save and remove products, per user.
- **Cart** — variant aware, quantity limits, delivery fee logic (free over Rs. 3,000, else Rs. 199).
- **3-step checkout** — Address → Payment → Review, with a sticky summary bar and order placement.
- **Pakistani addresses** — provinces, city suggestions, area, `03XXXXXXXXX` phone validation, country fixed to Pakistan.
- **Pakistani payments** — Cash on Delivery (default), JazzCash, Easypaisa, Bank Transfer, Card.
- **Order confirmation** — COD vs prepaid messaging, itemised order with delivery fee.
- **Admin** — products (create/update with brand, department and variants), categories, orders, sellers.

## Project structure

```
src/
  api/            axios instance
  components/     storefront, checkout, cart, admin, shared UI
  hooks/          URL-driven product filtering
  store/          Redux actions + reducers
  utils/          PKR formatting, delivery rules, provinces, cities, payment methods
  index.css       Rangva design tokens and base styles
```

## Design language

Ivory `#FBF7F2` base, ink `#1C1A17` text, terracotta `#C05B45` accent, with sand, rose, sage and gold supporting tones. Display type is **Fraunces**, body text is **Inter**. The legacy `--color-custom-blue` token is remapped to terracotta so older components inherit the brand automatically.

## Delivery rules

| Condition | Fee |
| --- | --- |
| Subtotal ≥ Rs. 3,000 | Free |
| Subtotal < Rs. 3,000 | Rs. 199 |

Mirrored in the backend so cart, checkout and order totals always agree.

## Notes

- Prices are stored as plain numbers and displayed with `formatPrice()` as `Rs. 2,190`.
- All product photos live in the backend `images/` folder and are served from `http://localhost:8080/images`.
