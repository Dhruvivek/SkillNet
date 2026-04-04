// FILE: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, searchUsers, getUserById } = require('../controllers/userController');

// All routes require authentication
router.use(protect);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// GET /api/users/search?skill=&branch=&year=&q=
router.get('/search', searchUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

module.exports = router;
