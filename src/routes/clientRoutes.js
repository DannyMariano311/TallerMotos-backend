const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const checkEmptyBody = require('../middleware/checkEmptyBody');

router.post('/', checkEmptyBody, clientController.createClient);
router.get('/', clientController.findClientsByFilter);
router.get('/:id', clientController.findClientById);

module.exports = router;