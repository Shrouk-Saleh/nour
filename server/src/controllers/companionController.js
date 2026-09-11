const Companion = require('../models/Companion');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { applyXp } = require('../utils/gameLogic');
const { pickRandomFlower } = require('../constants/flowers');

async function findOrCreate(userId) {
  let companion = await Companion.findOne({ user: userId });
  if (!companion) companion = await Companion.create({ user: userId });
  return companion;
}

// GET /api/companion
const getCompanion = asyncHandler(async (req, res) => {
  const companion = await findOrCreate(req.user._id);
  res.json({ success: true, data: companion });
});

// PUT /api/companion  (rename, equip cosmetics, change animalType)
const updateCompanion = asyncHandler(async (req, res) => {
  const companion = await findOrCreate(req.user._id);
  const allowed = ['name', 'equippedCosmetics', 'animalType'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) companion[key] = req.body[key];
  });
  await companion.save();
  res.json({ success: true, data: companion });
});

// POST /api/companion/feed
const feedCompanion = asyncHandler(async (req, res) => {
  const companion = await findOrCreate(req.user._id);
  if (companion.foodBalance <= 0) {
    throw new ApiError(400, 'Not enough food to feed your pet!');
  }

  // Deduct food
  companion.foodBalance -= 1;

  // Apply XP (e.g. 25 XP per feed)
  const xpGained = 25;
  const xpResult = applyXp(companion, xpGained);

  await companion.save();

  res.json({
    success: true,
    data: companion,
    leveledUp: xpResult.leveledUp,
  });
});

// POST /api/companion/garden/water
const waterPlant = asyncHandler(async (req, res) => {
  const companion = await findOrCreate(req.user._id);
  
  if (!companion.garden) companion.garden = {};
  if (companion.garden.plantStage >= 3) {
    throw new ApiError(400, 'Plant is already fully grown! Time to harvest.');
  }
  if ((companion.garden.waterDrops || 0) <= 0) {
    throw new ApiError(400, 'Not enough water drops! Complete more study tasks.');
  }

  companion.garden.waterDrops -= 1;
  companion.garden.growthPoints = (companion.garden.growthPoints || 0) + 1;

  if (companion.garden.growthPoints >= 3) {
    companion.garden.growthPoints = 0;
    companion.garden.plantStage = (companion.garden.plantStage || 0) + 1;
  }

  companion.markModified('garden');
  await companion.save();
  res.json({ success: true, data: companion });
});

// POST /api/companion/garden/harvest
const harvestPlant = asyncHandler(async (req, res) => {
  const companion = await findOrCreate(req.user._id);
  
  if (!companion.garden || companion.garden.plantStage < 3) {
    throw new ApiError(400, 'Plant is not ready to be harvested yet!');
  }

  // Pick a random flower reward
  const flower = pickRandomFlower();
  const isNew = !companion.garden.flowerCollection.includes(flower.id);

  // Reset plant
  companion.garden.plantStage = 0;
  companion.garden.growthPoints = 0;
  companion.garden.harvests = (companion.garden.harvests || 0) + 1;

  // Add flower to collection (if not already owned — we store duplicates as a count could be added later)
  companion.garden.flowerCollection = [...(companion.garden.flowerCollection || []), flower.id];

  // Reward food!
  companion.foodBalance += 10;

  // Mark as modified since garden is a nested object
  companion.markModified('garden');
  await companion.save();

  res.json({ success: true, data: companion, reward: { food: 10, flower, isNew } });
});

module.exports = { getCompanion, updateCompanion, feedCompanion, waterPlant, harvestPlant };
