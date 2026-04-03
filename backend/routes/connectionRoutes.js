// FILE: routes/connectionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections,
  getPending,
} = require('../controllers/connectionController');

// All routes require authentication
router.use(protect);

// POST /api/connections/send/:userId
router.post('/send/:userId', sendRequest);

// POST /api/connections/accept/:connectionId
router.post('/accept/:connectionId', acceptRequest);

// POST /api/connections/reject/:connectionId
router.post('/reject/:connectionId', rejectRequest);

// GET /api/connections
router.get('/', getConnections);

// GET /api/connections/pending
router.get('/pending', getPending);

module.exports = router;
