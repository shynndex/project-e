const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats);

// Get payments by order ID
router.get('/order/:orderId', paymentController.getPaymentsByOrderId);

// Get single payment
router.get('/:id', paymentController.getPaymentById);

// Process payment
router.post('/', paymentController.processPayment);

// Refund payment
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;