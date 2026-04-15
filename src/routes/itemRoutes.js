const express = require('express');
const router = express.Router({ mergeParams: true });
const itemController = require('../controllers/itemController');
const checkEmptyBody = require('../middleware/checkEmptyBody');
const { isAdmin } = require('../middleware/authMiddleware');

// Both ADMIN and MECANICO can create items
router.post('/', checkEmptyBody, itemController.createItem);

// Only ADMIN can delete items
router.delete('/:itemId', isAdmin, itemController.deleteItem);

module.exports = router;