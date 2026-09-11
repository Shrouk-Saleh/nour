const Progress = require('../models/Progress');
const Task = require('../models/Task');
const { asyncHandler } = require('../middleware/errorHandler');
const { isoDate } = require('../utils/gameLogic');

async function findOrCreate(userId) {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) progress = await Progress.create({ user: userId });
  return progress;
}

// GET /api/progress
const getProgress = asyncHandler(async (req, res) => {
  const progress = await findOrCreate(req.user._id);

  const today = isoDate();
  const allTasks = await Task.find({ user: req.user._id });
  const countable = allTasks.filter((t) => t.isCountable());

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayTasks = countable.filter((t) => t.day === todayName);
  const todayDone = todayTasks.filter((t) => t.completedDates.includes(today)).length;

  const weekDone = progress.weeklyQuestProgress;

  res.json({
    success: true,
    data: {
      progress,
      today: {
        date: today,
        day: todayName,
        totalTasks: todayTasks.length,
        completedTasks: todayDone,
        percent: todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0,
      },
      weeklyQuest: {
        target: progress.weeklyQuestTarget,
        progress: weekDone,
        claimed: progress.weeklyQuestClaimed,
      },
    },
  });
});

// PUT /api/progress  (settings-style updates: reset, spend stars, etc.)
const updateProgress = asyncHandler(async (req, res) => {
  const progress = await findOrCreate(req.user._id);
  const allowed = ['weeklyQuestTarget', 'ownedShopItems', 'equippedShopItems', 'starsSpent', 'totalStars', 'displayName'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) progress[key] = req.body[key];
  });
  await progress.save();
  res.json({ success: true, data: progress });
});

// POST /api/progress/reset-today
const resetToday = asyncHandler(async (req, res) => {
  const progress = await findOrCreate(req.user._id);
  const today = isoDate();
  const log = progress.dailyLogs.find((d) => d.date === today);

  if (log) {
    progress.totalXp = Math.max(0, progress.totalXp - log.xpEarned);
    progress.totalStars = Math.max(0, progress.totalStars - log.starsEarned);
    progress.totalTasksCompleted = Math.max(0, progress.totalTasksCompleted - log.completedTaskIds.length);
    progress.weeklyQuestProgress = Math.max(0, progress.weeklyQuestProgress - log.completedTaskIds.length);

    await Task.updateMany(
      { _id: { $in: log.completedTaskIds }, user: req.user._id },
      { $pull: { completedDates: today } }
    );

    progress.dailyLogs = progress.dailyLogs.filter((d) => d.date !== today);
  }

  await progress.save();
  res.json({ success: true, data: progress });
});

// POST /api/progress/reset-all
const resetAll = asyncHandler(async (req, res) => {
  await Progress.deleteOne({ user: req.user._id });
  await Task.updateMany({ user: req.user._id }, { $set: { completedDates: [] } });
  const fresh = await Progress.create({ user: req.user._id });
  res.json({ success: true, data: fresh });
});

module.exports = { getProgress, updateProgress, resetToday, resetAll };
