const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    shape: { type: String, default: 'cottage' },
    roof: { type: String, default: 'triangle' },
    door: { type: String, default: 'classic' },
    windows: { type: String, default: 'square' },
    colorScheme: { type: String, default: 'wood' },
    decorations: { type: [String], default: [] },
    dogAccessories: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('House', houseSchema);
