const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const { customer, status, startDate, endDate, limit = 100 } = req.query;
        
        const filters = {
            customerEmail: customer,
            status,
            startDate,
            endDate,
            limit: parseInt(limit)
        };
        
        const orders = await Order.findAll(filters);
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Get single order
exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Create order
exports.createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        
        // Thêm logs để debug
        ('Received order data:', JSON.stringify(orderData, null, 2));
        
        // Validate required fields
        if (!orderData.customerEmail) {
            return res.status(400).json({ message: 'Customer email is required' });
        }
        
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }
        
        if (orderData.total === undefined || orderData.total < 0) {
            return res.status(400).json({ message: 'Valid total amount is required' });
        }
        
        // Create order
        const order = await Order.create(orderData);
        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
};

// Update order
exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }
        
        const order = await Order.updateStatus(id, status);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const result = await Order.delete(id);
        
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get customer orders
exports.getCustomerOrders = async (req, res, next) => {
    try {
        const { email } = req.params;
        
        const orders = await Order.findByCustomerEmail(email);
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Get order stats
exports.getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.getStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};