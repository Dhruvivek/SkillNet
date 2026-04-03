// FILE: routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChatUsers, getMessages } = require('../controllers/chatController');

// All routes require authentication
router.use(protect);

// GET /api/chats/users
router.get('/users', getChatUsers);

// GET /api/chats/messages/:userId?limit=50
router.get('/messages/:userId', getMessages);

module.exports = router;
