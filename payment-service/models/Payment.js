const { pool } = require('../config/database');
const stripe = require('../utils/stripeConfig');

class Payment {
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT * FROM payments 
            `;
            
            const whereConditions = [];
            const queryParams = [];
            
            // Apply filters if provided
            if (filters.orderId) {
                whereConditions.push(`order_id = $${queryParams.length + 1}`);
                queryParams.push(filters.orderId);
            }
            
            if (filters.method) {
                whereConditions.push(`method = $${queryParams.length + 1}`);
                queryParams.push(filters.method);
            }
            
            if (filters.status) {
                whereConditions.push(`status = $${queryParams.length + 1}`);
                queryParams.push(filters.status);
            }
            
            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }
            
            query += ` ORDER BY created_at DESC`;
            
            if (filters.limit) {
                query += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(filters.limit);
            }
            
            const result = await pool.query(query, queryParams);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(`
                SELECT * FROM payments WHERE id = $1
            `, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByOrderId(orderId) {
        try {
            const result = await pool.query(`
                SELECT * FROM payments WHERE order_id = $1
                ORDER BY created_at DESC
            `, [orderId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(paymentData) {
        try {
            const { 
                orderId, 
                amount, 
                method, 
                status, 
                transactionId, 
                stripePaymentId,
                gatewayResponse 
            } = paymentData;
            
            const result = await pool.query(`
                INSERT INTO payments (
                    order_id, 
                    amount, 
                    method, 
                    status, 
                    transaction_id, 
                    stripe_payment_id,
                    gateway_response
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `, [
                orderId, 
                amount, 
                method, 
                status || 'pending', 
                transactionId, 
                stripePaymentId,
                gatewayResponse
            ]);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id, status, gatewayResponse = null) {
        try {
            const result = await pool.query(`
                UPDATE payments 
                SET status = $1, gateway_response = $2, updated_at = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING *
            `, [status, gatewayResponse, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    static generateTransactionId() {
        return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    static async processPayment(paymentData) {
        try {
            const { orderId, amount, method, stripeToken } = paymentData;
            
            if (!orderId) {
                throw new Error('Order ID is required');
            }
            
            if (!amount || amount <= 0) {
                throw new Error('Valid amount is required');
            }
            
            if (!method) {
                throw new Error('Payment method is required');
            }
            
            let status = 'pending';
            let gatewayResponse = '';
            let stripePaymentId = null;
            
            // Generate transaction ID
            const transactionId = this.generateTransactionId();
            
            // Process payment based on method
            if (method === 'card') {
                if (!stripeToken) {
                    throw new Error('Stripe token is required for card payments');
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
                // Fallback to simulation for other methods
                const isSuccess = Math.random() > 0.1; // 90% success rate
                status = isSuccess ? 'completed' : 'failed';
                gatewayResponse = isSuccess 
                    ? `Payment processed successfully via ${method}` 
                    : `Payment failed via ${method}`;
            }
            
            // Create payment record
            const payment = await this.create({
                orderId,
                amount,
                method,
                status,
                transactionId,
                stripePaymentId,
                gatewayResponse
            });

            return payment;
        } catch (error) {
            throw error;
        }
    }
    
    static async processRefund(paymentId, refundData = {}) {
        try {
            // Get original payment
            const originalPayment = await this.findById(paymentId);
            
            if (!originalPayment) {
                throw new Error('Payment not found');
            }
            
            if (originalPayment.status !== 'completed') {
                throw new Error('Cannot refund non-completed payment');
            }
            
            // Determine refund amount
            const refundAmount = refundData.amount || originalPayment.amount;
            
            if (refundAmount > originalPayment.amount) {
                throw new Error('Refund amount cannot exceed original payment amount');
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
                        reason: refundData.reason || 'requested_by_customer'
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
            
            // Create refund record (negative amount)
            const refundTransactionId = `REF${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
            
            const refundPayment = await this.create({
                orderId: originalPayment.order_id,
                amount: -refundAmount,
                method: originalPayment.method,
                status: refundStatus,
                transactionId: refundTransactionId,
                stripePaymentId: stripeRefundId,
                gatewayResponse
            });
            
            return refundPayment;
        } catch (error) {
            throw error;
        }
    }
    
    static async getStats() {
        try {
            const result = await pool.query(`
                SELECT 
                    COUNT(*) as total_payments,
                    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_revenue,
                    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_refunds,
                    COUNT(CASE WHEN status = 'completed' AND amount > 0 THEN 1 END) as completed_payments,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
                    COUNT(CASE WHEN method = 'card' THEN 1 END) as card_payments,
                    COUNT(CASE WHEN method = 'cod' THEN 1 END) as cod_payments
                FROM payments
            `);
            
            return {
                totalPayments: parseInt(result.rows[0].total_payments),
                totalRevenue: parseFloat(result.rows[0].total_revenue || 0),
                totalRefunds: parseFloat(result.rows[0].total_refunds || 0),
                completedPayments: parseInt(result.rows[0].completed_payments),
                failedPayments: parseInt(result.rows[0].failed_payments),
                pendingPayments: parseInt(result.rows[0].pending_payments),
                paymentMethods: {
                    card: parseInt(result.rows[0].card_payments),
                    cod: parseInt(result.rows[0].cod_payments)
                },
                netRevenue: parseFloat(result.rows[0].total_revenue || 0) - parseFloat(result.rows[0].total_refunds || 0)
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Payment;