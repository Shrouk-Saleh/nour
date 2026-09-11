const mongoose = require('mongoose');

const TASK_TYPES = [
  'study',
  'online-class',
  'offline-class',
  'review',
  'problem-solving',
  'break',
  'meal',
  'preparation',
  'sleep',
];

// Task types that count toward study progress, XP and stars
const COUNTABLE_TYPES = ['study', 'online-class', 'offline-class', 'review', 'problem-solving'];

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    day: {
      type: String,
      enum: DAYS,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 60,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    type: {
      type: String,
      enum: TASK_TYPES,
      required: true,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
      max: 500,
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
      max: 500,
    },
    order: {
      type: Number,
      default: 0,
    },
    completedDates: {
      // list of "YYYY-MM-DD" strings on which this recurring task was completed
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

TaskSchema.index({ day: 1, startTime: 1 });

TaskSchema.methods.isCountable = function isCountable() {
  return COUNTABLE_TYPES.includes(this.type);
};

TaskSchema.statics.TASK_TYPES = TASK_TYPES;
TaskSchema.statics.COUNTABLE_TYPES = COUNTABLE_TYPES;
TaskSchema.statics.DAYS = DAYS;

module.exports = mongoose.model('Task', TaskSchema);
