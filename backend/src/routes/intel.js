const express = require('express');
const router = express.Router();
const { getLogs, createLog, updateLog, deleteLog } = require('../controllers/intelController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getLogs);
router.post('/', verifyToken, createLog);
router.put('/:id', verifyToken, updateLog);
router.delete('/:id', verifyToken, deleteLog);

module.exports = router;
