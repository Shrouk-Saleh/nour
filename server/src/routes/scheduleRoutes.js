const express = require('express');
const router = express.Router();
const {
  getSchedule,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSchedule);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', completeTask);

module.exports = router;
