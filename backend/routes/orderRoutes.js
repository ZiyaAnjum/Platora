const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

// Customer routes
router.post(
  '/order',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('items.*.menuItemId').notEmpty().withMessage('Each item requires a menuItemId'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be an integer >= 1'),
    body('redeemPoints').optional().isBoolean(),
  ],
  validate,
  placeOrder
);

router.get('/my-orders', protect, getMyOrders);
router.get('/order/:id', protect, getOrderById);

// Admin routes
router.get('/orders', protect, adminOnly, getAllOrders);
router.put(
  '/order/:id/status',
  protect,
  adminOnly,
  [body('status').notEmpty().withMessage('status is required')],
  validate,
  updateOrderStatus
);

module.exports = router;
