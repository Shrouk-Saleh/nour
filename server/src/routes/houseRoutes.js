const express = require('express');
const router = express.Router();
const { getHouse, updateHouse } = require('../controllers/houseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getHouse);
router.put('/', updateHouse);

module.exports = router;
