// FILE: routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer,
} = require('../controllers/questionController');

// All routes require authentication
router.use(protect);

// POST /api/questions
router.post('/', createQuestion);

// GET /api/questions?tag=&page=&search=
router.get('/', getQuestions);

// GET /api/questions/:id
router.get('/:id', getQuestionById);

// POST /api/questions/:id/answer
router.post('/:id/answer', addAnswer);

// POST /api/questions/:id/upvote
router.post('/:id/upvote', upvoteQuestion);

// POST /api/answers/:id/upvote — mounted here but path uses 'answers' prefix
router.post('/answers/:id/upvote', upvoteAnswer);

module.exports = router;
