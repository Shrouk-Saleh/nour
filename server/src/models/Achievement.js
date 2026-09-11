const mongoose = require('mongoose');

// Definitions are static (seeded once). Unlock state lives per-achievement.
const AchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    key: { type: String, required: true }, // e.g. "first-step"
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🏆' },
    goal: { type: Number, default: 1 }, // target value for progress-based achievements
    metric: {
      type: String,
      enum: ['tasksCompleted', 'streak', 'stars', 'perfectWeeks', 'daysActive'],
      required: true,
    },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

AchievementSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', AchievementSchema);
