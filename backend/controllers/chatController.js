// FILE: controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get list of users the current user has chatted with (connections)
// @route   GET /api/chats/users
const getChatUsers = async (req, res) => {
  try {
    // Get user with populated connections
    const user = await User.findById(req.user._id).populate(
      'connections',
      'name profilePic email bio'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // For each connection, get the latest message
    const chatUsers = await Promise.all(
      (user.connections || []).map(async (conn) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, receiver: conn._id },
            { sender: conn._id, receiver: req.user._id },
          ],
        })
          .sort({ createdAt: -1 })
          .select('content createdAt read sender');

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          sender: conn._id,
          receiver: req.user._id,
          read: false,
        });

        return {
          ...conn.toObject(),
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageAt: lastMessage ? lastMessage.createdAt : null,
          unreadCount,
        };
      })
    );

    // Sort by last message time (most recent first)
    chatUsers.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    res.status(200).json({
      success: true,
      data: chatUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching chat users',
      error: error.message,
    });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/chats/messages/:userId?limit=50
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 }) // Oldest first for chat display
      .limit(limit)
      .populate('sender', 'name profilePic')
      .populate('receiver', 'name profilePic');

    // Mark received messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages',
      error: error.message,
    });
  }
};

module.exports = { getChatUsers, getMessages };
