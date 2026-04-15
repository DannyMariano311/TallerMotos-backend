const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const checkEmptyBody = require('../middleware/checkEmptyBody');
const { isAdmin } = require('../middleware/authMiddleware');

// ADMIN: CRUD completo
router.post('/', checkEmptyBody, isAdmin, orderController.createOrder);
router.get('/', orderController.findOrdersByFilter);
router.get('/:id', orderController.findOrderById);

// Status history endpoints
router.get('/:id/history', orderController.getOrderStatusHistory);

// Status updates: ADMIN can set any status, MECANICO can only set DIAGNOSTICO, EN_PROCESO, LISTA
// Must come AFTER history routes to avoid conflict with /:id/history
router.patch('/:id/status', checkEmptyBody, orderController.updateOrderStatus);

module.exports = router;