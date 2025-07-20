const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get order statistics
router.get('/stats', orderController.getOrderStats);

// Get customer orders
router.get('/customer/:email', orderController.getCustomerOrders);

// Get single order
router.get('/:id', orderController.getOrderById);

// Create order
router.post('/', orderController.createOrder);

// Update order
router.put('/:id', orderController.updateOrder);

// Delete order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;