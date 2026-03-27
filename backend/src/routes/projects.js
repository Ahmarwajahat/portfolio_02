const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectsController');

// Public endpoints
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected endpoints (require Admin Firebase Token)
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

module.exports = router;
