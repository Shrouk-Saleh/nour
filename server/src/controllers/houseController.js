const House = require('../models/House');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/house
const getHouse = asyncHandler(async (req, res) => {
  let house = await House.findOne({ user: req.user._id });
  if (!house) house = await House.create({ user: req.user._id });
  res.json({ success: true, data: house });
});

// PUT /api/house
const updateHouse = asyncHandler(async (req, res) => {
  let house = await House.findOne({ user: req.user._id });
  if (!house) house = await House.create({ user: req.user._id });

  const allowed = ['shape', 'roof', 'door', 'windows', 'colorScheme', 'decorations', 'dogAccessories'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) house[key] = req.body[key];
  });
  
  await house.save();
  res.json({ success: true, data: house });
});

module.exports = { getHouse, updateHouse };
