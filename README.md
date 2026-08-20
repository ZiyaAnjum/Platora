### FOGLIA

## 📌 Overview

Foglia is a portfolio-ready restaurant ordering system: a JWT-secured REST API paired with a React frontend styled around a real restaurant device — the kitchen order docket. Customers sign up, browse a searchable menu, place an order, and track it from **Pending → Preparing → Out for delivery → Delivered**. Admins manage the menu and work the order queue in real time.

### 🌟 Key Features

- **Role-based auth** — JWT login/signup for customers and admins, with route-level access control
- **Live menu** — search by name, filter by category, admin CRUD with availability toggles
- **Server-authoritative ordering** — totals are always recalculated from live menu prices, never trusted from the client
- **Order tracking** — full status timeline visible to both customer and admin
- **Loyalty & Rewards program** — customers earn points on every order and can redeem them for an automatic discount
- **Admin order queue** — filter by status, advance orders as the kitchen works through them
- **INR pricing** — all prices shown in ₹ throughout the app

```

## 🛠️ Tech Stack

### Frontend

| React | Vite | Tailwind CSS | React Router |
|---|---|---|---|
| 

![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

 | 

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

 | 

![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

 | 

![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

 |

### Backend

| Node.js | Express | MongoDB | Mongoose | JWT | bcrypt |
|---|---|---|---|---|---|
| 

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

 | 

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

 | 

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

 | 

![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

 | 

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

 | 

![bcrypt](https://img.shields.io/badge/bcrypt-338833?style=for-the-badge)

 |

## 🗂️ Project Structure

```
.
├── restaurant-backend/        # REST API
│   ├── config/                  # MongoDB connection
│   ├── models/                  # User, MenuItem, Order (Mongoose schemas)
│   ├── middleware/               # JWT auth, admin guard, validation, error handling
│   ├── controllers/              # Route logic (auth, menu, orders)
│   ├── routes/                   # Express routers
│   ├── utils/                    # asyncHandler helper
│   ├── server.js                 # App entry point
│   └── README.md                 # Backend setup + full API docs
│
└── restaurant-frontend/       # React client
    ├── src/
    │   ├── components/            # Navbar, order docket (cart), menu rows, status timeline
    │   ├── context/                 # Auth + cart state
    │   ├── pages/                    # Menu, login/signup, orders, admin views
    │   └── lib/api.js                 # Fetch wrapper around the backend
    └── README.md                  # Frontend setup + design notes
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (local `mongod` or a free MongoDB Atlas cluster)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/foglia.git
cd foglia
```

### 2. Backend setup

```bash
cd restaurant-backend
npm install
cp .env.example .env
```

Fill in `restaurant-backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_platform
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
LOYALTY_POINTS_PER_CURRENCY_UNIT=0.1
LOYALTY_REDEEM_THRESHOLD=100
LOYALTY_REDEEM_DISCOUNT_PERCENT=10
```

```bash
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../restaurant-frontend
npm install
cp .env.example .env
```

Fill in `restaurant-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```
App runs at `http://localhost:5173`.

### 4. Try it out

1. Sign up an **admin** account, log in, and add a few dishes under **Manage menu**.
2. Sign up a separate **customer** account, browse the menu, and place an order.
3. Switch back to the admin account's **Order queue** to move the order through its statuses and watch the customer's **My orders** page update live.

## 📖 API Overview

Full request/response examples live in [`restaurant-backend/README.md`](./restaurant-backend/README.md).

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/signup` | Public |
| POST | `/api/login` | Public |
| GET | `/api/profile` | Logged in |
| GET | `/api/menu` | Public |
| POST | `/api/menu` | Admin |
| PUT | `/api/menu/:id` | Admin |
| DELETE | `/api/menu/:id` | Admin |
| POST | `/api/order` | Customer |
| GET | `/api/my-orders` | Customer |
| GET | `/api/order/:id` | Owner or admin |
| GET | `/api/orders` | Admin |
| PUT | `/api/order/:id/status` | Admin |

## 🎨 Design Notes

The frontend's identity is built around a real restaurant device: the kitchen order docket. The cart is styled as a perforated paper ticket in monospace type, and menu rows use dot-leader lines to the price — like an actual printed menu card. Full palette and typography details are in [`restaurant-frontend/README.md`](./restaurant-frontend/README.md).

## 🗺️ Roadmap Ideas

- Image upload instead of pasting an external image URL
- Real payment integration (Razorpay/Stripe) instead of a simulated checkout
- Email/SMS notifications on order status changes
- Admin analytics dashboard (best sellers, revenue by day)
- Pagination on menu and order history endpoints



## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.



<div align="center">

Made with 🍃 for the table.

</div>
```
