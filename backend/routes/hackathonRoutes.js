// FILE: routes/hackathonRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createHackathon,
  getAllHackathons,
  getMyHackathons,
  inviteUser,
  respondToInvite,
  applyToHackathon,
  respondToApplication,
} = require('../controllers/hackathonController');

// All routes require authentication
router.use(protect);

// POST /api/hackathon/create
router.post('/create', createHackathon);

// GET /api/hackathon
router.get('/', getAllHackathons);

// GET /api/hackathon/my
router.get('/my', getMyHackathons);

// POST /api/hackathon/invite/:hackathonId/:userId
router.post('/invite/:hackathonId/:userId', inviteUser);

// POST /api/hackathon/respond/:hackathonId/:inviteId
router.post('/respond/:hackathonId/:inviteId', respondToInvite);

// POST /api/hackathon/apply/:hackathonId
router.post('/apply/:hackathonId', applyToHackathon);

// POST /api/hackathon/respond-application/:hackathonId/:applicationId
router.post('/respond-application/:hackathonId/:applicationId', respondToApplication);

module.exports = router;
