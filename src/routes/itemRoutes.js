const express = require('express');
const router = express.Router({ mergeParams: true });
const itemController = require('../controllers/itemController');
const validateItem = require('../middleware/validateItem');
const checkEmptyBody = require('../middleware/checkEmptyBody');

router.post('/', checkEmptyBody, itemController.createItem);
router.delete('/:itemId', itemController.deleteItem);

module.exports = router;