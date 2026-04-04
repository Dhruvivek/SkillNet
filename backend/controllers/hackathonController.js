// FILE: controllers/hackathonController.js
const Hackathon = require('../models/Hackathon');

// @desc    Create a hackathon team
// @route   POST /api/hackathon/create
const createHackathon = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    const hackathon = await Hackathon.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      createdBy: req.user._id,
      members: [req.user._id], // Creator auto-added
      status: 'recruiting',
    });

    const populated = await Hackathon.findById(hackathon._id)
      .populate('createdBy', 'name profilePic')
      .populate('members', 'name profilePic');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating hackathon',
      error: error.message,
    });
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathon
const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('createdBy', 'name profilePic')
      .populate('members', 'name profilePic')
      .populate('invites.user', 'name profilePic')
      .populate('applications.user', 'name profilePic')
      .sort({ createdAt: -1 });

    // Transform for frontend — map to Team shape
    const transformed = hackathons.map(h => {
      const obj = h.toObject();
      // Check if current user has an invite
      const userInvite = obj.invites.find(
        inv => inv.user && inv.user._id.toString() === req.user._id.toString()
      );
      // Check if current user applied
      const userApplication = (obj.applications || []).find(
        app => app.user && app.user._id.toString() === req.user._id.toString()
      );
      return {
        ...obj,
        id: obj._id,
        name: obj.title,
        event: obj.description,
        lookingFor: obj.requiredSkills,
        inviteStatus: userInvite ? userInvite.status : 'none',
        applicationStatus: userApplication ? userApplication.status : 'none',
        isMember: obj.members.some(m => m._id.toString() === req.user._id.toString()),
        isCreator: obj.createdBy._id.toString() === req.user._id.toString(),
      };
    });

    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching hackathons',
      error: error.message,
    });
  }
};

// @desc    Get current user's hackathons
// @route   GET /api/hackathon/my
const getMyHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({
      $or: [
        { createdBy: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate('createdBy', 'name profilePic')
      .populate('members', 'name profilePic')
      .sort({ createdAt: -1 });

    const transformed = hackathons.map(h => ({
      ...h.toObject(),
      id: h._id,
      name: h.title,
      event: h.description,
      lookingFor: h.requiredSkills,
    }));

    res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching your hackathons',
      error: error.message,
    });
  }
};

// @desc    Invite user to hackathon
// @route   POST /api/hackathon/invite/:hackathonId/:userId
const inviteUser = async (req, res) => {
  try {
    const { hackathonId, userId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
      });
    }

    // Only creator can invite
    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team creator can invite members',
      });
    }

    // Check if already invited
    const existingInvite = hackathon.invites.find(
      inv => inv.user.toString() === userId
    );
    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: 'User already invited',
      });
    }

    // Check if already a member
    if (hackathon.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    hackathon.invites.push({ user: userId, status: 'pending' });
    await hackathon.save();

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error sending invite',
      error: error.message,
    });
  }
};

// @desc    Respond to hackathon invite (accept/reject)
// @route   POST /api/hackathon/respond/:hackathonId/:inviteId
const respondToInvite = async (req, res) => {
  try {
    const { hackathonId, inviteId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "accept" or "reject"',
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
      });
    }

    const invite = hackathon.invites.id(inviteId);
    if (!invite) {
      return res.status(404).json({
        success: false,
        message: 'Invite not found',
      });
    }

    // Ensure the invite is for the current user
    if (invite.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This invite is not for you',
      });
    }

    invite.status = action === 'accept' ? 'accepted' : 'rejected';

    if (action === 'accept') {
      // Add user to members
      if (!hackathon.members.includes(req.user._id)) {
        hackathon.members.push(req.user._id);
      }
    }

    await hackathon.save();

    res.status(200).json({
      success: true,
      message: `Invite ${action}ed successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error responding to invite',
      error: error.message,
    });
  }
};

// @desc    Apply to join a hackathon
// @route   POST /api/hackathon/apply/:hackathonId
const applyToHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    if (hackathon.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member' });
    }

    const existingApplication = hackathon.applications.find(
      app => app.user.toString() === req.user._id.toString()
    );
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied' });
    }

    hackathon.applications.push({ user: req.user._id, status: 'pending' });
    await hackathon.save();

    res.status(200).json({ success: true, message: 'Application sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error applying', error: error.message });
  }
};

// @desc    Respond to an application (accept/reject)
// @route   POST /api/hackathon/respond-application/:hackathonId/:applicationId
const respondToApplication = async (req, res) => {
  try {
    const { hackathonId, applicationId } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be "accept" or "reject"' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only creator can manage applications' });
    }

    const application = hackathon.applications.id(applicationId);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = action === 'accept' ? 'accepted' : 'rejected';

    if (action === 'accept' && !hackathon.members.includes(application.user)) {
      hackathon.members.push(application.user);
    }
    await hackathon.save();

    res.status(200).json({ success: true, message: `Application ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error responding to application', error: error.message });
  }
};

module.exports = {
  createHackathon,
  getAllHackathons,
  getMyHackathons,
  inviteUser,
  respondToInvite,
  applyToHackathon,
  respondToApplication,
};
