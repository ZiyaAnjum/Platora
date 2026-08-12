# Foglia — Restaurant Frontend

A clean, distinctive React frontend for the [restaurant-backend](../restaurant-backend) API. Customers browse a printed-style menu and build an order on a **kitchen docket**; admins manage the menu and work an order queue.

## Design

- **Palette** — ink `#24301F`, paper `#FAF6EE`, linen `#F1EAD9`, forest `#3C5233`, brass `#B98B2A`, brick `#9C4B3F`.
- **Type** — Fraunces (display), Public Sans (body), IBM Plex Mono (prices, order numbers, the docket).
- **Signature element** — the cart is styled as a real kitchen order docket: a perforated paper ticket in monospace. Menu rows use dot-leader lines to the price, like a printed menu card.

## Setup

1. Make sure the backend (`restaurant-backend`) is running — see its README. By default it listens on `http://localhost:5000`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if your backend runs somewhere other than `http://localhost:5000/api`.

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`.

5. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## Pages

| Route | Access | Description |
|---|---|---|
| `/menu` | Public | Search + filter the menu by category, add items to the docket |
| `/login`, `/signup` | Public | Auth — sign up as a customer or admin |
| `/my-orders` | Customer | Order history with status timelines |
| `/orders/:id` | Owner or admin | Full receipt: items, subtotal, loyalty discount, total, timeline |
| `/admin/menu` | Admin | Add, edit, delete menu items; toggle availability |
| `/admin/orders` | Admin | Order queue — filter by status, advance each order's status |

## How it talks to the backend

All requests go through `src/lib/api.js`, which reads `VITE_API_BASE_URL` and attaches the JWT (stored in `localStorage`) to authenticated requests. No prices are computed client-side for the final charge — the docket shows a live estimate, but the server (`POST /order`) recomputes everything from the current menu, exactly as the backend README describes.

## Notes

- The backend already ships with `cors` enabled, so the Vite dev server (port 5173) can call it directly with no proxy needed.
- The cart persists to `localStorage` so it survives a page refresh, but is cleared automatically after an order is placed.
