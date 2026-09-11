const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const Progress = require('../models/Progress');
const Companion = require('../models/Companion');
const Achievement = require('../models/Achievement');
const House = require('../models/House');
const { buildSeedTasks, ACHIEVEMENT_DEFINITIONS } = require('../utils/seedData');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Seed user's exact schedule and data
      const tasks = buildSeedTasks(user._id);
      await Task.insertMany(tasks);

      await Progress.create({ user: user._id, displayName: user.name });
      await Companion.create({ user: user._id });
      await House.create({ user: user._id });

      const achievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        user: user._id
      }));
      await Achievement.insertMany(achievements);

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
