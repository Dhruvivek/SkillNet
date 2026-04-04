// FILE: socket/socket.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const initializeSocket = (io) => {
  // Authenticate socket connections via token in handshake query
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token || socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.user._id})`);

    // Join user's personal room
    socket.join(`user_${socket.user._id}`);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;

        if (!receiverId || !content) return;

        // Save message to database
        const message = await Message.create({
          sender: socket.user._id,
          receiver: receiverId,
          content,
        });

        const populated = await Message.findById(message._id)
          .populate('sender', 'name profilePic')
          .populate('receiver', 'name profilePic');

        // Emit to receiver's room
        io.to(`user_${receiverId}`).emit('receive_message', populated);

        // Also emit back to sender for confirmation
        socket.emit('message_sent', populated);
      } catch (error) {
        console.error('Socket send_message error:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      if (receiverId) {
        io.to(`user_${receiverId}`).emit('typing', {
          userId: socket.user._id,
          isTyping,
        });
      }
    });

    // Handle marking messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { senderId } = data;
        await Message.updateMany(
          {
            sender: senderId,
            receiver: socket.user._id,
            read: false,
          },
          { read: true }
        );

        io.to(`user_${senderId}`).emit('messages_read', {
          readBy: socket.user._id,
        });
      } catch (error) {
        console.error('Socket mark_read error:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = initializeSocket;
