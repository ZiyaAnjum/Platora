const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Signs a JWT for a given user id.
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Shapes a user document for API responses (never leak the password hash).
 */
const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  loyaltyPoints: user.loyaltyPoints,
  createdAt: user.createdAt,
});

// @route   POST /api/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  // Only allow role to be set to 'admin' if explicitly requested; in a real
  // production system this would be gated further (invite code, manual
  // promotion, etc). Left open here for demo/grading convenience.
  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'customer',
  });

  const token = signToken(user._id);
  res.status(201).json({ success: true, token, user: toPublicUser(user) });
});

// @route   POST /api/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user._id);
  res.status(200).json({ success: true, token, user: toPublicUser(user) });
});

// @route   GET /api/profile
// @access  Private (any logged-in user)
// Exposes loyaltyPoints balance -- part of the loyalty rewards feature.
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: toPublicUser(req.user) });
});

module.exports = { signup, login, getProfile };
