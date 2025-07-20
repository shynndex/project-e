const stripe = require('../utils/stripeConfig');

// Helper to generate transaction ID
const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Get all payments
exports.getAllPayments = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const { orderId, method, status, startDate, endDate, limit = 100 } = req.query;
        
        let query = 'SELECT * FROM payments';
        const whereConditions = [];
        const queryParams = [];
        
        if (orderId) {
            whereConditions.push(`order_id = $${queryParams.length + 1}`);
            queryParams.push(orderId);
        }
        
        if (method) {
            whereConditions.push(`method = $${queryParams.length + 1}`);
            queryParams.push(method);
        }
        
        if (status) {
            whereConditions.push(`status = $${queryParams.length + 1}`);
            queryParams.push(status);
        }
        
        if (startDate) {
            whereConditions.push(`created_at >= $${queryParams.length + 1}`);
            queryParams.push(startDate);
        }
        
        if (endDate) {
            whereConditions.push(`created_at <= $${queryParams.length + 1}`);
            queryParams.push(endDate);
        }
        
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1}`;
        queryParams.push(limit);
        
        const result = await pool.query(query, queryParams);
        
        const payments = result.rows.map(row => ({
            _id: row.id,
            orderId: row.order_id,
            amount: parseFloat(row.amount),
            method: row.method,
            status: row.status,
            transactionId: row.transaction_id,
            stripePaymentId: row.stripe_payment_id,
            gatewayResponse: row.gateway_response,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        
        res.json(payments);
    } catch (error) {
        next(error);
    }
};

// Get single payment
exports.getPaymentById = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const { id } = req.params;
        
        const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        const payment = {
            _id: result.rows[0].id,
            orderId: result.rows[0].order_id,
            amount: parseFloat(result.rows[0].amount),
            method: result.rows[0].method,
            status: result.rows[0].status,
            transactionId: result.rows[0].transaction_id,
            stripePaymentId: result.rows[0].stripe_payment_id,
            gatewayResponse: result.rows[0].gateway_response,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
        };
        
        res.json(payment);
    } catch (error) {
        next(error);
    }
};

// Process payment
exports.processPayment = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const { orderId, amount, method, stripeToken } = req.body;
        
        // Validate required fields
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }
        
        if (!method) {
            return res.status(400).json({ message: 'Payment method is required' });
        }
        
        let paymentResult;
        let status = 'pending';
        let gatewayResponse = '';
        let stripePaymentId = null;
        
        // Generate transaction ID
        const transactionId = generateTransactionId();
        
        // Process payment based on method
        if (method === 'card') {
            if (!stripeToken) {
                return res.status(400).json({ message: 'Stripe token is required for card payments' });
            }
            
            // Process Stripe payment
            try {
                const amountInCents = Math.round(amount * 100); // Convert to cents for Stripe
                
                const stripePayment = await stripe.paymentIntents.create({
                    amount: amountInCents,
                    currency: 'usd',
                    payment_method: stripeToken,
                    confirmation_method: 'manual',
                    confirm: true,
                    description: `Payment for Order #${orderId}`,
                    metadata: {
                        order_id: orderId,
                        transaction_id: transactionId
                    }
                });
                
                if (stripePayment.status === 'succeeded') {
                    status = 'completed';
                    gatewayResponse = `Payment processed successfully via Stripe. Payment ID: ${stripePayment.id}`;
                    stripePaymentId = stripePayment.id;
                } else {
                    status = 'pending';
                    gatewayResponse = `Stripe payment is ${stripePayment.status}. Further action may be needed.`;
                    stripePaymentId = stripePayment.id;
                }
            } catch (stripeError) {
                status = 'failed';
                gatewayResponse = `Stripe payment failed: ${stripeError.message}`;
                console.error('Stripe payment error:', stripeError);
            }
        } else if (method === 'cod') {
            // Cash on Delivery
            status = 'pending';
            gatewayResponse = 'Payment will be collected upon delivery.';
        } else {
            return res.status(400).json({ message: 'Unsupported payment method' });
        }
        
        // Insert payment record
        const result = await pool.query(
            `INSERT INTO payments (order_id, amount, method, status, transaction_id, stripe_payment_id, gateway_response) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [orderId, amount, method, status, transactionId, stripePaymentId, gatewayResponse]
        );
        
        paymentResult = {
            _id: result.rows[0].id,
            orderId: result.rows[0].order_id,
            amount: parseFloat(result.rows[0].amount),
            method: result.rows[0].method,
            status: result.rows[0].status,
            transactionId: result.rows[0].transaction_id,
            stripePaymentId: result.rows[0].stripe_payment_id,
            gatewayResponse: result.rows[0].gateway_response,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
        };
        
        if (status === 'failed') {
            return res.status(400).json({
                message: 'Payment processing failed',
                payment: paymentResult
            });
        }
        
        res.status(201).json(paymentResult);
    } catch (error) {
        next(error);
    }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const { id } = req.params;
        const { amount, reason } = req.body;
        
        // Get original payment
        const paymentResult = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        
        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        const originalPayment = paymentResult.rows[0];
        
        if (originalPayment.status !== 'completed') {
            return res.status(400).json({ message: 'Cannot refund non-completed payment' });
        }
        
        // Determine refund amount
        const refundAmount = amount || originalPayment.amount;
        
        if (refundAmount > originalPayment.amount) {
            return res.status(400).json({ 
                message: 'Refund amount cannot exceed original payment amount' 
            });
        }
        
        let refundStatus = 'pending';
        let gatewayResponse = '';
        let stripeRefundId = null;
        
        // Process refund based on original payment method
        if (originalPayment.method === 'card' && originalPayment.stripe_payment_id) {
            try {
                const amountInCents = Math.round(refundAmount * 100);
                
                const stripeRefund = await stripe.refunds.create({
                    payment_intent: originalPayment.stripe_payment_id,
                    amount: amountInCents,
                    reason: reason || 'requested_by_customer'
                });
                
                refundStatus = 'completed';
                gatewayResponse = `Refund processed successfully via Stripe. Refund ID: ${stripeRefund.id}`;
                stripeRefundId = stripeRefund.id;
            } catch (stripeError) {
                refundStatus = 'failed';
                gatewayResponse = `Stripe refund failed: ${stripeError.message}`;
                console.error('Stripe refund error:', stripeError);
            }
        } else {
            refundStatus = 'completed';
            gatewayResponse = 'Manual refund processed for non-card payment.';
        }
        
        // Create refund record
        const refundTransactionId = `REF${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await pool.query(
            `INSERT INTO payments (order_id, amount, method, status, transaction_id, stripe_payment_id, gateway_response) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                originalPayment.order_id, 
                -refundAmount, 
                originalPayment.method, 
                refundStatus, 
                refundTransactionId, 
                stripeRefundId,
                gatewayResponse
            ]
        );
        
        const refund = {
            _id: result.rows[0].id,
            orderId: result.rows[0].order_id,
            amount: parseFloat(result.rows[0].amount),
            method: result.rows[0].method,
            status: result.rows[0].status,
            transactionId: result.rows[0].transaction_id,
            stripePaymentId: result.rows[0].stripe_payment_id,
            gatewayResponse: result.rows[0].gateway_response,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
        };
        
        res.status(201).json(refund);
    } catch (error) {
        next(error);
    }
};

// Get payments by order ID
exports.getPaymentsByOrderId = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const { orderId } = req.params;
        
        const result = await pool.query(
            'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC', 
            [orderId]
        );
        
        const payments = result.rows.map(row => ({
            _id: row.id,
            orderId: row.order_id,
            amount: parseFloat(row.amount),
            method: row.method,
            status: row.status,
            transactionId: row.transaction_id,
            stripePaymentId: row.stripe_payment_id,
            gatewayResponse: row.gateway_response,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        
        res.json(payments);
    } catch (error) {
        next(error);
    }
};

// Get payment stats
exports.getPaymentStats = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_payments,
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_refunds,
                COUNT(CASE WHEN status = 'completed' AND amount > 0 THEN 1 END) as completed_payments,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
                COUNT(CASE WHEN status = 'refunded' OR amount < 0 THEN 1 END) as refunded_payments,
                COUNT(CASE WHEN method = 'card' THEN 1 END) as card_payments,
                COUNT(CASE WHEN method = 'cod' THEN 1 END) as cod_payments
            FROM payments
        `);
        
        const stats = {
            totalPayments: parseInt(result.rows[0].total_payments),
            totalRevenue: parseFloat(result.rows[0].total_revenue || 0),
            totalRefunds: parseFloat(result.rows[0].total_refunds || 0),
            completedPayments: parseInt(result.rows[0].completed_payments),
            failedPayments: parseInt(result.rows[0].failed_payments),
            refundedPayments: parseInt(result.rows[0].refunded_payments),
            paymentMethods: {
                card: parseInt(result.rows[0].card_payments),
                cod: parseInt(result.rows[0].cod_payments)
            },
            netRevenue: parseFloat(result.rows[0].total_revenue || 0) - parseFloat(result.rows[0].total_refunds || 0)
        };
        
        res.json(stats);
    } catch (error) {
        next(error);
    }
};  