const Task = require('../models/Task');
const Progress = require('../models/Progress');
const Companion = require('../models/Companion');
const Achievement = require('../models/Achievement');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { applyXp, moodFromPercent, isoDate, registerStudyDay } = require('../utils/gameLogic');

// GET /api/schedule?day=saturday
const getSchedule = asyncHandler(async (req, res) => {
  const { day } = req.query;
  const filter = { user: req.user._id };
  if (day) filter.day = day;
  const tasks = await Task.find(filter).sort({ day: 1, order: 1, startTime: 1 });
  res.json({ success: true, data: tasks });
});

// POST /api/schedule
const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: task });
});

// PUT /api/schedule/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ success: true, data: task });
});

// DELETE /api/schedule/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ success: true, data: { id: req.params.id } });
});

async function findOrCreateAll(userId) {
  let [progress, companion] = await Promise.all([
    Progress.findOne({ user: userId }),
    Companion.findOne({ user: userId }),
  ]);
  if (!progress) progress = await Progress.create({ userId });
  if (!companion) companion = await Companion.create({ userId });
  return { progress, companion };
}

async function checkAchievements(progress, userId) {
  const defs = await Achievement.find({ user: userId, unlocked: false });
  const unlockedNow = [];

  for (const ach of defs) {
    let value = 0;
    if (ach.metric === 'tasksCompleted') value = progress.totalTasksCompleted;
    if (ach.metric === 'streak') value = progress.currentStreak;
    if (ach.metric === 'stars') value = progress.totalStars;
    if (ach.metric === 'daysActive') value = progress.dailyLogs.length;
    if (ach.metric === 'perfectWeeks') value = progress.dailyLogs.filter((d) => d.perfectDay).length >= 7 ? 1 : 0;

    if (value >= ach.goal) {
      ach.unlocked = true;
      ach.unlockedAt = new Date();
      await ach.save();
      unlockedNow.push(ach);
    }
  }
  return unlockedNow;
}

// POST /api/schedule/:id/complete  { completed: true|false }
// This is the core "checklist -> game reaction" endpoint.
const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const completed = req.body.completed !== false; // default true
  const today = isoDate();
  const alreadyDone = task.completedDates.includes(today);

  const { progress, companion } = await findOrCreateAll(req.user._id);

  let foodGained = 0;
  let starsGained = 0;
  let leveledUp = false;
  let unlockedAchievements = [];

  if (completed && !alreadyDone) {
    task.completedDates.push(today);
    
    // Only countable tasks give food and water
    if (task.isCountable()) {
      foodGained = 1;
      companion.foodBalance += foodGained;
      if (!companion.garden) companion.garden = {};
      companion.garden.waterDrops = (companion.garden.waterDrops || 0) + 1;
    }
    
    starsGained = task.stars;

    progress.totalXp += 0; // Legacy field
    progress.totalStars += starsGained;
    progress.totalTasksCompleted += 1;
    progress.weeklyQuestProgress += 1;

    let log = progress.dailyLogs.find((d) => d.date === today);
    if (!log) {
      log = { date: today, completedTaskIds: [], xpEarned: 0, foodEarned: 0, starsEarned: 0, perfectDay: false };
      progress.dailyLogs.push(log);
    }
    log.completedTaskIds.push(String(task._id));
    log.foodEarned = (log.foodEarned || 0) + foodGained;
    log.starsEarned += starsGained;

    if (task.isCountable()) {
      registerStudyDay(progress, today);
    }

    // Check perfect day: all countable tasks for this day of week are complete today
    const dayTasks = await Task.find({ day: task.day, user: req.user._id });
    const countableTasks = dayTasks.filter((t) => t.isCountable());
    const allDone = countableTasks.every(
      (t) => String(t._id) === String(task._id) || t.completedDates.includes(today)
    );
    if (allDone && !log.perfectDay) {
      log.perfectDay = true;
      const bonusFood = 3;
      const bonusStars = 50;
      companion.foodBalance += bonusFood;
      progress.totalStars += bonusStars;
      log.foodEarned = (log.foodEarned || 0) + bonusFood;
      log.starsEarned += bonusStars;
      foodGained += bonusFood;
      starsGained += bonusStars;
    }

    if (progress.weeklyQuestProgress >= progress.weeklyQuestTarget && !progress.weeklyQuestClaimed) {
      progress.weeklyQuestClaimed = true;
      const weeklyFood = 5;
      companion.foodBalance += weeklyFood;
      progress.totalStars += 100;
      foodGained += weeklyFood;
      starsGained += 100;
    }

    unlockedAchievements = await checkAchievements(progress, req.user._id);
  } else if (!completed && alreadyDone) {
    task.completedDates = task.completedDates.filter((d) => d !== today);
    progress.totalTasksCompleted = Math.max(0, progress.totalTasksCompleted - 1);
    progress.weeklyQuestProgress = Math.max(0, progress.weeklyQuestProgress - 1);
    const log = progress.dailyLogs.find((d) => d.date === today);
    if (log) {
      log.completedTaskIds = log.completedTaskIds.filter((id) => id !== String(task._id));
      log.foodEarned = Math.max(0, (log.foodEarned || 0) - (task.isCountable() ? 1 : 0));
      log.starsEarned = Math.max(0, log.starsEarned - task.stars);
      log.perfectDay = false;
    }
    companion.foodBalance = Math.max(0, companion.foodBalance - (task.isCountable() ? 1 : 0));
    if (task.isCountable() && companion.garden) {
      companion.garden.waterDrops = Math.max(0, (companion.garden.waterDrops || 0) - 1);
    }
    progress.totalStars = Math.max(0, progress.totalStars - task.stars);
  }

  // Recompute today's completion percent for mood
  const dayTasksAll = await Task.find({ day: task.day, user: req.user._id });
  const countableAll = dayTasksAll.filter((t) => t.isCountable());
  const doneCountToday = countableAll.filter((t) => t.completedDates.includes(today)).length;
  const percentToday = countableAll.length ? Math.round((doneCountToday / countableAll.length) * 100) : 0;
  companion.mood = moodFromPercent(percentToday);

  await Promise.all([task.save(), progress.save(), companion.save()]);

  res.json({
    success: true,
    data: {
      task,
      progress,
      companion,
      foodGained,
      starsGained,
      leveledUp,
      unlockedAchievements,
      perfectDay: !!progress.dailyLogs.find((d) => d.date === today)?.perfectDay,
    },
  });
});

module.exports = { getSchedule, createTask, updateTask, deleteTask, completeTask };
