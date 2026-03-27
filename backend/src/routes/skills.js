const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillsController');

// Public endpoint
router.get('/', getSkills);

// Protected endpoints (require Admin Firebase Token)
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

module.exports = router;
