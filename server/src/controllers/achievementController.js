const Achievement = require('../models/Achievement');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/achievements
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ user: req.user._id }).sort({ goal: 1 });
  res.json({ success: true, data: achievements });
});

module.exports = { getAchievements };
