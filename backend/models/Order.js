const mongoose = require('mongoose');

const ORDER_STATUSES = ['Pending', 'Preparing', 'Out for delivery', 'Delivered'];

// Embedded sub-document for each line item in an order.
// We snapshot the item name and price at order time so historical orders
// stay accurate even if the menu item is later edited or deleted.
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// Tracks every status change with a timestamp, so customers/admins can see
// a full timeline of the order (part of the demo-friendly UX).
const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'An order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    // --- Unique feature: Loyalty & Rewards program ---
    loyaltyDiscountApplied: {
      type: Number, // amount deducted, in currency units
      default: 0,
    },
    loyaltyPointsRedeemed: {
      type: Number,
      default: 0,
    },
    loyaltyPointsEarned: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'Pending',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: 'Pending' }],
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

orderSchema.statics.ORDER_STATUSES = ORDER_STATUSES;

module.exports = mongoose.model('Order', orderSchema);
