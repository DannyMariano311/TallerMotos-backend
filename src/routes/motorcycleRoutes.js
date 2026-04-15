const express = require('express');
const router = express.Router();
const motorcycleController = require('../controllers/motorcycleController');
const checkEmptyBody = require('../middleware/checkEmptyBody');
const { isAdmin } = require('../middleware/authMiddleware');

// ADMIN: CRUD completo
router.post('/', checkEmptyBody, isAdmin, motorcycleController.createMotorcycle);
router.get('/', motorcycleController.findMotorcyclesByFilter);
router.get('/:id', motorcycleController.findMotorcycleById);

module.exports = router;