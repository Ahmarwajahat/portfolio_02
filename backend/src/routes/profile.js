const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// Public endpoint to get the profile
router.get('/', getProfile);

// Protected endpoint to update the profile
router.put('/', verifyToken, updateProfile);

module.exports = router;
