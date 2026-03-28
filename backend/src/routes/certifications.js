const express = require('express');
const router = express.Router();
const { getCertifications, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getCertifications);
router.post('/', verifyToken, createCertification);
router.put('/:id', verifyToken, updateCertification);
router.delete('/:id', verifyToken, deleteCertification);

module.exports = router;
