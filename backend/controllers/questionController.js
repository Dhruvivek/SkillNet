// FILE: controllers/questionController.js
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Helper: transform question for frontend
const transformQuestion = (question, userId) => {
  const q = question.toObject ? question.toObject() : question;
  return {
    ...q,
    id: q._id,
    upvotes: q.upvotes ? q.upvotes.length : 0,
    upvoted: q.upvotes ? q.upvotes.some(id => id.toString() === userId.toString()) : false,
    answers: Array.isArray(q.answers) ? q.answers.length : 0,
    content: q.description, // Frontend expects 'content' field
    author: q.askedBy,
    timeAgo: getTimeAgo(q.createdAt),
    views: Math.floor(Math.random() * 500) + 50, // Placeholder until views tracking is added
  };
};

// Helper: transform answer for frontend
const transformAnswer = (answer, userId) => {
  const a = answer.toObject ? answer.toObject() : answer;
  return {
    ...a,
    id: a._id,
    upvotes: a.upvotes ? a.upvotes.length : 0,
    upvoted: a.upvotes ? a.upvotes.some(id => id.toString() === userId.toString()) : false,
    author: a.answeredBy,
    time: getTimeAgo(a.createdAt),
  };
};

// Helper: compute relative time
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

// @desc    Create a question
// @route   POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    const question = await Question.create({
      title,
      description,
      tags: tags || [],
      askedBy: req.user._id,
    });

    const populated = await Question.findById(question._id)
      .populate('askedBy', 'name profilePic');

    res.status(201).json({
      success: true,
      data: transformQuestion(populated, req.user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating question',
      error: error.message,
    });
  }
};

// @desc    Get all questions (paginated, filterable by tag)
// @route   GET /api/questions?tag=&page=&search=
const getQuestions = async (req, res) => {
  try {
    const { tag, page = 1, search } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const filter = {};
    if (tag) {
      filter.tags = { $in: [new RegExp(tag, 'i')] };
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .populate('askedBy', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const transformed = questions.map(q => transformQuestion(q, req.user._id));

    res.status(200).json({
      success: true,
      data: transformed,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching questions',
      error: error.message,
    });
  }
};

// @desc    Get single question with answers
// @route   GET /api/questions/:id
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('askedBy', 'name profilePic')
      .populate({
        path: 'answers',
        populate: { path: 'answeredBy', select: 'name profilePic' },
        options: { sort: { createdAt: -1 } },
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const q = question.toObject();
    const transformedAnswers = (q.answers || []).map(a => transformAnswer(a, req.user._id));

    res.status(200).json({
      success: true,
      data: {
        ...q,
        id: q._id,
        upvotes: q.upvotes ? q.upvotes.length : 0,
        upvoted: q.upvotes ? q.upvotes.some(id => id.toString() === req.user._id.toString()) : false,
        content: q.description,
        author: q.askedBy,
        timeAgo: getTimeAgo(q.createdAt),
        views: Math.floor(Math.random() * 500) + 50,
        answersCount: transformedAnswers.length,
        answers: transformedAnswers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching question',
      error: error.message,
    });
  }
};

// @desc    Add answer to a question
// @route   POST /api/questions/:id/answer
const addAnswer = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Answer content is required',
      });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const answer = await Answer.create({
      content,
      question: question._id,
      answeredBy: req.user._id,
    });

    // Add answer ref to question
    question.answers.push(answer._id);
    await question.save();

    const populated = await Answer.findById(answer._id)
      .populate('answeredBy', 'name profilePic');

    res.status(201).json({
      success: true,
      data: transformAnswer(populated, req.user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding answer',
      error: error.message,
    });
  }
};

// @desc    Toggle upvote on question
// @route   POST /api/questions/:id/upvote
const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const userId = req.user._id;
    const index = question.upvotes.findIndex(id => id.toString() === userId.toString());

    if (index === -1) {
      // Add upvote
      question.upvotes.push(userId);
    } else {
      // Remove upvote (toggle)
      question.upvotes.splice(index, 1);
    }

    await question.save();

    res.status(200).json({
      success: true,
      data: {
        upvotes: question.upvotes.length,
        upvoted: index === -1, // Was added = now upvoted
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error upvoting question',
      error: error.message,
    });
  }
};

// @desc    Toggle upvote on answer
// @route   POST /api/answers/:id/upvote
const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    const userId = req.user._id;
    const index = answer.upvotes.findIndex(id => id.toString() === userId.toString());

    if (index === -1) {
      answer.upvotes.push(userId);
    } else {
      answer.upvotes.splice(index, 1);
    }

    await answer.save();

    res.status(200).json({
      success: true,
      data: {
        upvotes: answer.upvotes.length,
        upvoted: index === -1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error upvoting answer',
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  upvoteQuestion,
  upvoteAnswer,
};
