// FILE: controllers/userController.js
const User = require('../models/User');
const Connection = require('../models/Connection');

// @desc    Get current user's profile
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', 'name profilePic');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'bio', 'branch', 'year', 'skills', 'interests', 'availability', 'profilePic', 'github', 'linkedin'];
    const updates = {};

    // Only pick allowed fields from request body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
};

// @desc    Search users by skill, branch, year
// @route   GET /api/users/search?skill=&branch=&year=&q=
const searchUsers = async (req, res) => {
  try {
    const { skill, branch, year, q } = req.query;
    const filter = { _id: { $ne: req.user._id } }; // Exclude self

    if (skill) {
      filter.skills = { $in: skill.split(',').map(s => new RegExp(s.trim(), 'i')) };
    }
    if (branch) {
      filter.branch = new RegExp(branch, 'i');
    }
    if (year) {
      filter.year = Number(year);
    }
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { skills: { $in: [new RegExp(q, 'i')] } },
        { bio: new RegExp(q, 'i') },
      ];
    }

    const users = await User.find(filter)
      .select('name email branch year skills bio profilePic connections availability')
      .limit(50);

    // For each user, check connection status with current user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const connection = await Connection.findOne({
          $or: [
            { from: req.user._id, to: user._id },
            { from: user._id, to: req.user._id },
          ],
        });

        return {
          ...user.toJSON(),
          connectionStatus: connection ? connection.status : 'none',
          connectionId: connection ? connection._id : null,
          connections: user.connections ? user.connections.length : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error searching users',
      error: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name profilePic');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check connection status with current user
    const connection = await Connection.findOne({
      $or: [
        { from: req.user._id, to: user._id },
        { from: user._id, to: req.user._id },
      ],
    });

    const userData = {
      ...user.toJSON(),
      connectionStatus: connection ? connection.status : 'none',
      connectionId: connection ? connection._id : null,
      connections: user.connections ? user.connections.length : 0,
    };

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: error.message,
    });
  }
};

module.exports = { getProfile, updateProfile, searchUsers, getUserById };
