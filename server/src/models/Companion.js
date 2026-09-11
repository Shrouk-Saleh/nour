const mongoose = require('mongoose');

const CompanionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },

    name: { type: String, default: 'Sprout', trim: true, maxlength: 30 },
    animalType: { type: String, default: 'dog' },
    level: { type: Number, default: 1, min: 1, max: 5 },
    currentXp: { type: Number, default: 0, min: 0 }, // XP within current level
    xpToNextLevel: { type: Number, default: 100, min: 1 },
    foodBalance: { type: Number, default: 0, min: 0 },

    mood: {
      type: String,
      enum: ['sleepy', 'okay', 'happy', 'excited', 'celebrating'],
      default: 'sleepy',
    },

    equippedCosmetics: { type: [String], default: [] },
    
    garden: {
      waterDrops: { type: Number, default: 0, min: 0 },
      plantStage: { type: Number, default: 0, min: 0, max: 3 }, // 0: seed, 1: sprout, 2: young, 3: mature
      growthPoints: { type: Number, default: 0, min: 0 },
      harvests: { type: Number, default: 0, min: 0 },
      flowerCollection: { type: [String], default: [] }, // array of flower IDs collected
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Companion', CompanionSchema);
