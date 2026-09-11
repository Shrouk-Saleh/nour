const mongoose = require('mongoose');

// Single-user simplified progress document.
// Kept extensible: everything is keyed so a `userId` field could be added later
// without changing the shape of the data.
const DailyLogSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    completedTaskIds: { type: [String], default: [] },
    xpEarned: { type: Number, default: 0 },
    starsEarned: { type: Number, default: 0 },
    perfectDay: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    displayName: { type: String, default: '', trim: true, maxlength: 40 },

    totalXp: { type: Number, default: 0, min: 0 },
    totalStars: { type: Number, default: 0, min: 0 },
    starsSpent: { type: Number, default: 0, min: 0 },

    currentStreak: { type: Number, default: 0, min: 0 },
    bestStreak: { type: Number, default: 0, min: 0 },
    lastStudyDate: { type: String, default: null }, // "YYYY-MM-DD"

    weeklyQuestTarget: { type: Number, default: 30, min: 1 },
    weeklyQuestProgress: { type: Number, default: 0, min: 0 },
    weeklyQuestWeekStart: { type: String, default: null }, // "YYYY-MM-DD" (Saturday)
    weeklyQuestClaimed: { type: Boolean, default: false },

    totalTasksCompleted: { type: Number, default: 0, min: 0 },

    dailyLogs: { type: [DailyLogSchema], default: [] },

    ownedShopItems: { type: [String], default: [] },
    equippedShopItems: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', ProgressSchema);
