const express = require('express');
const router = express.Router();
const controller = require('../controllers/policyController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Policy Routes Loaded");

// Public Route
router.get('/public', controller.getAllPolicies);

// Admin Routes
router.get('/', verifyToken, controller.getAllPolicies);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createPolicy);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updatePolicy);
router.delete('/:id', verifyToken, controller.deletePolicy);

module.exports = router;