const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const REDEEM_THRESHOLD = Number(process.env.LOYALTY_REDEEM_THRESHOLD || 100);
const REDEEM_DISCOUNT_PERCENT = Number(process.env.LOYALTY_REDEEM_DISCOUNT_PERCENT || 10);
const POINTS_PER_CURRENCY_UNIT = Number(process.env.LOYALTY_POINTS_PER_CURRENCY_UNIT || 0.1); // 1 point per ₹10 spent

// @route   POST /api/order
// @access  Private/Customer
// Body: { items: [{ menuItemId, quantity }], redeemPoints: boolean }
//
// --- Unique feature: Loyalty & Rewards program ---
// Prices are ALWAYS recalculated server-side from the current MenuItem
// documents -- the client only sends item ids + quantities, never prices.
// If the customer opts in (redeemPoints: true) and has >= REDEEM_THRESHOLD
// loyalty points, a discount is automatically applied and points are
// deducted. New points are then earned on the final total.
const placeOrder = asyncHandler(async (req, res) => {
  const { items, redeemPoints } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must include at least one item' });
  }

  // Validate all menuItemIds are well-formed before hitting the DB
  for (const line of items) {
    if (!line.menuItemId || !mongoose.Types.ObjectId.isValid(line.menuItemId)) {
      return res.status(400).json({ success: false, message: `Invalid menu item id: ${line.menuItemId}` });
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Each item quantity must be an integer >= 1' });
    }
  }

  // Fetch all referenced menu items in one query
  const ids = items.map((line) => line.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: ids } });
  const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

  const orderItems = [];
  let subtotal = 0;

  for (const line of items) {
    const menuItem = menuItemMap.get(line.menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: `Menu item not found: ${line.menuItemId}` });
    }
    if (!menuItem.is_available) {
      return res.status(400).json({ success: false, message: `"${menuItem.name}" is currently unavailable` });
    }

    // Price is taken from the DB, never trusted from the client
    const lineTotal = menuItem.price * line.quantity;
    subtotal += lineTotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: line.quantity,
    });
  }
  subtotal = Math.round(subtotal * 100) / 100;

  // --- Loyalty discount logic ---
  let loyaltyDiscountApplied = 0;
  let loyaltyPointsRedeemed = 0;
  const user = await User.findById(req.user._id);

  if (redeemPoints === true && user.loyaltyPoints >= REDEEM_THRESHOLD) {
    loyaltyDiscountApplied = Math.round(subtotal * (REDEEM_DISCOUNT_PERCENT / 100) * 100) / 100;
    loyaltyPointsRedeemed = REDEEM_THRESHOLD;
  }

  const total_price = Math.round((subtotal - loyaltyDiscountApplied) * 100) / 100;
  const loyaltyPointsEarned = Math.floor(total_price * POINTS_PER_CURRENCY_UNIT);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subtotal,
    loyaltyDiscountApplied,
    loyaltyPointsRedeemed,
    loyaltyPointsEarned,
    total_price,
    status: 'Pending',
    statusHistory: [{ status: 'Pending' }],
  });

  // Update the user's points balance: subtract redeemed, add earned
  user.loyaltyPoints = user.loyaltyPoints - loyaltyPointsRedeemed + loyaltyPointsEarned;
  await user.save();

  res.status(201).json({
    success: true,
    order,
    loyalty: {
      pointsRedeemed: loyaltyPointsRedeemed,
      pointsEarned: loyaltyPointsEarned,
      newBalance: user.loyaltyPoints,
    },
  });
});

// @route   GET /api/my-orders
// @access  Private/Customer
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ created_at: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @route   GET /api/order/:id
// @access  Private (owner or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.status(200).json({ success: true, order });
});

// @route   GET /api/orders
// @query   ?status=<Pending|Preparing|Out for delivery|Delivered>
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const orders = await Order.find(filter).populate('user', 'name email').sort({ created_at: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @route   PUT /api/order/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const VALID_STATUSES = Order.ORDER_STATUSES;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  order.statusHistory.push({ status });
  await order.save();

  res.status(200).json({ success: true, order });
});

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
