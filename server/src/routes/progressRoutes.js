const express = require('express');
const router = express.Router();
const { getProgress, updateProgress, resetToday, resetAll } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getProgress);
router.put('/', updateProgress);
router.post('/reset-today', resetToday);
router.post('/reset-all', resetAll);

module.exports = router;
