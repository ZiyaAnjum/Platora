require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// --- Core middleware ---
app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// --- Connect to MongoDB ---
connectDB();

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Platform API is running',
    docs: 'See README.md for full API documentation',
  });
});

// --- Routes ---
// Mounted flat under /api to match the requested endpoint spec:
// POST /api/signup, POST /api/login, POST /api/menu, GET /api/menu,
// PUT /api/menu/:id, DELETE /api/menu/:id, POST /api/order,
// GET /api/my-orders, GET /api/orders, PUT /api/order/:id/status, etc.
app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
