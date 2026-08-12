const mongoose = require('mongoose');

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Drinks'];

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    image_url: {
      type: String,
      trim: true,
      default: '',
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index to support name search (used by GET /menu?search=)
menuItemSchema.index({ name: 'text' });

menuItemSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('MenuItem', menuItemSchema);
