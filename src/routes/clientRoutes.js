const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const checkEmptyBody = require('../middleware/checkEmptyBody');
const { isAdmin } = require('../middleware/authMiddleware');

// ADMIN: CRUD completo
router.post('/', checkEmptyBody, isAdmin, clientController.createClient);
router.get('/', clientController.findClientsByFilter);
router.get('/:id', clientController.findClientById);

module.exports = router;