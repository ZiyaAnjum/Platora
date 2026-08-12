const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const {
  createMenuItem,
  getMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const router = express.Router();

const menuValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category')
    .isIn(MenuItem.CATEGORIES)
    .withMessage(`Category must be one of: ${MenuItem.CATEGORIES.join(', ')}`),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('description').optional().isString().isLength({ max: 500 }),
  body('image_url').optional().isString(),
  body('is_available').optional().isBoolean(),
];

// Public routes
router.get('/menu', getMenu);
router.get('/menu/:id', getMenuItemById);

// Admin-only routes
router.post('/menu', protect, adminOnly, menuValidationRules, validate, createMenuItem);
router.put('/menu/:id', protect, adminOnly, updateMenuItem);
router.delete('/menu/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
