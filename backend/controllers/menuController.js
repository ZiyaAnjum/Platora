const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');

// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, category, price, description, image_url, is_available } = req.body;

  const item = await MenuItem.create({
    name,
    category,
    price,
    description,
    image_url,
    is_available,
  });

  res.status(201).json({ success: true, item });
});

// @route   GET /api/menu
// @query   ?search=<name text>&category=<Starter|Main Course|Dessert|Drinks>&available=true
// @access  Public
const getMenu = asyncHandler(async (req, res) => {
  const { search, category, available } = req.query;
  const filter = {};

  if (search) {
    // Case-insensitive partial name match (search-by-name requirement)
    filter.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  if (available !== undefined) {
    filter.is_available = available === 'true';
  }

  const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
  res.status(200).json({ success: true, count: items.length, items });
});

// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.status(200).json({ success: true, item });
});

// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'description', 'image_url', 'is_available'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
    new: true, // return the updated document
    runValidators: true, // re-run schema validation on update
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  res.status(200).json({ success: true, item });
});

// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.status(200).json({ success: true, message: 'Menu item deleted', item });
});

module.exports = { createMenuItem, getMenu, getMenuItemById, updateMenuItem, deleteMenuItem };
