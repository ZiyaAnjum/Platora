> A matching frontend (`restaurant-frontend`) is available — see its README for setup. It expects this API running on `http://localhost:5000` by default.

# Restaurant Platform API

A backend for a restaurant platform: customers browse the menu and place orders, admins manage the menu and order queue. Built with **Node.js, Express, MongoDB (Mongoose), JWT auth, and bcrypt**.

## ✨ Standout feature: Loyalty & Rewards Program

Every order automatically earns the customer **loyalty points** (1 point per $10 spent, configurable). Once a customer accumulates enough points (default: 100), they can opt in to redeem them on their **next order** for an automatic 10% discount — no coupon codes, no manual admin work. The discount, points redeemed, and points earned are all calculated **server-side** and returned with every order, and the running balance is visible via `GET /api/profile`. Every order also keeps a **status timeline** (`statusHistory`) showing exactly when it moved from Pending → Preparing → Out for delivery → Delivered.

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- `express-validator` for request validation

## Folder Structure

```
restaurant-backend/
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   ├── User.js               # name, email, password, role, loyaltyPoints
│   ├── MenuItem.js           # name, category, price, description, image_url, is_available
│   └── Order.js              # user, items[], subtotal, loyalty fields, total_price, status, statusHistory
├── middleware/
│   ├── auth.js                # protect (JWT) + adminOnly (role check)
│   ├── validate.js            # express-validator result handler
│   └── errorHandler.js        # centralized error + 404 handler
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   └── orderController.js
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   └── orderRoutes.js
├── utils/
│   └── asyncHandler.js        # wraps async routes, forwards errors to next()
├── server.js                  # app entry point
├── .env.example
└── package.json
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/restaurant_platform
   JWT_SECRET=replace_this_with_a_long_random_secret_string
   JWT_EXPIRES_IN=7d
   LOYALTY_POINTS_PER_CURRENCY_UNIT=0.1
   LOYALTY_REDEEM_THRESHOLD=100
   LOYALTY_REDEEM_DISCOUNT_PERCENT=10
   ```

3. **Start MongoDB** (locally via `mongod`, or use a MongoDB Atlas connection string in `MONGO_URI`)

4. **Run the server**
   ```bash
   npm start        # production
   npm run dev       # development, with nodemon auto-reload
   ```

   Server starts at `http://localhost:5000`.

---

## API Documentation

All endpoints are prefixed with `/api`. All request/response bodies are JSON. Protected routes require:

```
Authorization: Bearer <jwt_token>
```

### Auth

#### `POST /api/signup`
Create a new account (customer by default).

Request:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "customer"
}
```
Response `201`:
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": "66b1f2...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "loyaltyPoints": 0,
    "createdAt": "2026-08-10T12:00:00.000Z"
  }
}
```

#### `POST /api/login`
Request:
```json
{ "email": "jane@example.com", "password": "secret123" }
```
Response `200`: same shape as signup (`token` + `user`).

#### `GET /api/profile` *(protected)*
Returns the logged-in user's profile, including current `loyaltyPoints` balance.

---

### Menu

#### `GET /api/menu` *(public)*
Query params (all optional): `search` (name substring), `category` (`Starter` | `Main Course` | `Dessert` | `Drinks`), `available` (`true`/`false`).

Example: `GET /api/menu?category=Main Course&search=pasta`

Response `200`:
```json
{
  "success": true,
  "count": 1,
  "items": [
    {
      "_id": "66b1f2...",
      "name": "Spaghetti Carbonara",
      "category": "Main Course",
      "price": 14.5,
      "description": "Classic Roman pasta with pancetta and pecorino",
      "image_url": "",
      "is_available": true
    }
  ]
}
```

#### `GET /api/menu/:id` *(public)* — single item

#### `POST /api/menu` *(admin only)*
Request:
```json
{
  "name": "Tiramisu",
  "category": "Dessert",
  "price": 7.5,
  "description": "Coffee-soaked ladyfingers with mascarpone",
  "image_url": "https://example.com/tiramisu.jpg",
  "is_available": true
}
```
Response `201`: `{ "success": true, "item": { ... } }`

#### `PUT /api/menu/:id` *(admin only)*
Body: any subset of `name`, `category`, `price`, `description`, `image_url`, `is_available`.

#### `DELETE /api/menu/:id` *(admin only)*
Response `200`: `{ "success": true, "message": "Menu item deleted", "item": { ... } }`

---

### Orders

#### `POST /api/order` *(customer, protected)*
Prices are **always** computed server-side from the current menu — the client only sends item ids and quantities.

Request:
```json
{
  "items": [
    { "menuItemId": "66b1f2...", "quantity": 2 },
    { "menuItemId": "66b1f3...", "quantity": 1 }
  ],
  "redeemPoints": true
}
```
Response `201`:
```json
{
  "success": true,
  "order": {
    "_id": "66b201...",
    "user": "66b1f0...",
    "items": [
      { "menuItem": "66b1f2...", "name": "Spaghetti Carbonara", "price": 14.5, "quantity": 2 },
      { "menuItem": "66b1f3...", "name": "Tiramisu", "price": 7.5, "quantity": 1 }
    ],
    "subtotal": 36.5,
    "loyaltyDiscountApplied": 3.65,
    "loyaltyPointsRedeemed": 100,
    "loyaltyPointsEarned": 3,
    "total_price": 32.85,
    "status": "Pending",
    "statusHistory": [{ "status": "Pending", "changedAt": "2026-08-10T12:05:00.000Z" }],
    "created_at": "2026-08-10T12:05:00.000Z"
  },
  "loyalty": { "pointsRedeemed": 100, "pointsEarned": 3, "newBalance": 3 }
}
```

#### `GET /api/my-orders` *(customer, protected)*
Returns the logged-in user's own orders, newest first.

#### `GET /api/order/:id` *(protected — owner or admin)*
Single order with full details and status timeline.

#### `GET /api/orders` *(admin only)*
Optional query: `?status=Preparing`. Returns all orders across all customers, each populated with basic user info — the admin order queue.

#### `PUT /api/order/:id/status` *(admin only)*
Request:
```json
{ "status": "Preparing" }
```
Valid statuses: `Pending`, `Preparing`, `Out for delivery`, `Delivered`. Each update appends an entry to the order's `statusHistory`.

---

## Error Format

All errors follow a consistent shape:
```json
{ "success": false, "message": "Human-readable error message" }
```
Validation errors additionally include an `errors` array with `{ field, message }` per invalid field.

## Notes on Design Choices

- **Server-authoritative pricing**: `total_price` is never accepted from the client; it's recomputed from the live `MenuItem.price` values on every order.
- **Order line-item snapshots**: each order item stores the `name`/`price` at the time of purchase, so edits to the menu later don't rewrite order history.
- **Role-based middleware**: `protect` verifies the JWT and loads `req.user`; `adminOnly` is a second, composable middleware for admin-restricted routes.
- **Loyalty program**: entirely server-side and opt-in per order (`redeemPoints: true`), so a customer never loses points on an order where they didn't ask to redeem.
