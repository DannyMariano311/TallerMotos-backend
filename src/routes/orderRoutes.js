const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const checkEmptyBody = require('../middleware/checkEmptyBody');

router.post('/', checkEmptyBody, orderController.createOrder);
router.get('/', orderController.findOrdersByFilter);
router.get('/:id', orderController.findOrderById);
router.patch('/:id/status', checkEmptyBody, orderController.updateOrderStatus);

module.exports = router;