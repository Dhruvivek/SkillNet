// FILE: controllers/connectionController.js
const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc    Send connection request
// @route   POST /api/connections/send/:userId
const sendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    // Can't connect to yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself',
      });
    }

    // Check target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if connection already exists (in either direction)
    const existing = await Connection.findOne({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Connection already ${existing.status}`,
      });
    }

    const connection = await Connection.create({
      from: req.user._id,
      to: userId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent',
      data: connection,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error sending connection request',
      error: error.message,
    });
  }
};

// @desc    Accept connection request
// @route   POST /api/connections/accept/:connectionId
const acceptRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    // Only the recipient can accept
    if (connection.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request',
      });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Connection already ${connection.status}`,
      });
    }

    connection.status = 'accepted';
    await connection.save();

    // Add each user to the other's connections array
    await User.findByIdAndUpdate(connection.from, {
      $addToSet: { connections: connection.to },
    });
    await User.findByIdAndUpdate(connection.to, {
      $addToSet: { connections: connection.from },
    });

    res.status(200).json({
      success: true,
      message: 'Connection accepted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error accepting connection',
      error: error.message,
    });
  }
};

// @desc    Reject connection request
// @route   POST /api/connections/reject/:connectionId
const rejectRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    // Only the recipient can reject
    if (connection.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request',
      });
    }

    connection.status = 'rejected';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection rejected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error rejecting connection',
      error: error.message,
    });
  }
};

// @desc    Get all accepted connections for current user
// @route   GET /api/connections
const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { from: req.user._id, status: 'accepted' },
        { to: req.user._id, status: 'accepted' },
      ],
    })
      .populate('from', 'name profilePic email skills bio')
      .populate('to', 'name profilePic email skills bio');

    // Return the other user in each connection
    const result = connections.map(conn => {
      const otherUser = conn.from._id.toString() === req.user._id.toString()
        ? conn.to
        : conn.from;
      return {
        connectionId: conn._id,
        user: otherUser,
        connectedAt: conn.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching connections',
      error: error.message,
    });
  }
};

// @desc    Get pending incoming connection requests
// @route   GET /api/connections/pending
const getPending = async (req, res) => {
  try {
    const pending = await Connection.find({
      to: req.user._id,
      status: 'pending',
    })
      .populate('from', 'name profilePic email skills bio')
      .sort({ createdAt: -1 });

    const result = pending.map(conn => ({
      connectionId: conn._id,
      user: conn.from,
      requestedAt: conn.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching pending requests',
      error: error.message,
    });
  }
};

module.exports = { sendRequest, acceptRequest, rejectRequest, getConnections, getPending };
