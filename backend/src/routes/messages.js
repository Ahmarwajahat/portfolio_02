const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getMessages,
  createMessage,
  deleteMessage
} = require('../controllers/messagesController');

// Public route for form submission
router.post('/', createMessage);

// Protected routes
router.get('/', verifyToken, getMessages);
router.delete('/:id', verifyToken, deleteMessage);

module.exports = router;
