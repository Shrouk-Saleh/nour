const express = require('express');
const router = express.Router();
const { getCompanion, updateCompanion, feedCompanion, waterPlant, harvestPlant } = require('../controllers/companionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCompanion);
router.put('/', updateCompanion);
router.post('/feed', feedCompanion);
router.post('/garden/water', waterPlant);
router.post('/garden/harvest', harvestPlant);

module.exports = router;
