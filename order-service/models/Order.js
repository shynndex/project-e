const db = require('../config/database');

class Order {
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT o.*, 
                       json_agg(
                           json_build_object(
                               'id', oi.id,
                               'productId', oi.product_id,
                               'name', oi.name,
                               'price', oi.price,
                               'quantity', oi.quantity
                           )
                       ) as items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
            `;
            
            const whereConditions = [];
            const queryParams = [];
            
            if (filters.customerEmail) {
                whereConditions.push(`o.customer_email = $${queryParams.length + 1}`);
                queryParams.push(filters.customerEmail);
            }
            
            if (filters.status) {
                whereConditions.push(`o.status = $${queryParams.length + 1}`);
                queryParams.push(filters.status);
            }
            
            if (filters.startDate) {
                whereConditions.push(`o.created_at >= $${queryParams.length + 1}`);
                queryParams.push(filters.startDate);
            }
            
            if (filters.endDate) {
                whereConditions.push(`o.created_at <= $${queryParams.length + 1}`);
                queryParams.push(filters.endDate);
            }
            
            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }
            
            query += ` GROUP BY o.id ORDER BY o.created_at DESC`;
            
            if (filters.limit) {
                query += ` LIMIT $${queryParams.length + 1}`;
                queryParams.push(filters.limit);
            }
            
            const result = await db.query(query, queryParams);
            
            return result.rows.map(row => ({
                _id: row.id,
                customerEmail: row.customer_email,
                total: parseFloat(row.total),
                status: row.status,
                deliveryAddress: row.delivery_address,
                paymentMethod: row.payment_method,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                items: row.items && row.items[0] !== null ? row.items : []
            }));
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await db.query(`
                SELECT o.*, 
                       json_agg(
                           json_build_object(
                               'id', oi.id,
                               'productId', oi.product_id,
                               'name', oi.name,
                               'price', oi.price,
                               'quantity', oi.quantity
                           )
                       ) as items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.id = $1
                GROUP BY o.id
            `, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            const row = result.rows[0];
            return {
                _id: row.id,
                customerEmail: row.customer_email,
                total: parseFloat(row.total),
                status: row.status,
                deliveryAddress: row.delivery_address,
                paymentMethod: row.payment_method,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                items: row.items && row.items[0] !== null ? row.items : []
            };
        } catch (error) {
            throw error;
        }
    }

    static async findByCustomerEmail(email) {
        try {
            return this.findAll({ customerEmail: email });
        } catch (error) {
            throw error;
        }
    }

    static async create(orderData) {
        const client = await db.getPool().connect();
        
        try {
            await client.query('BEGIN');
            
            const { customerEmail, items, total, status = 'pending', deliveryAddress, paymentMethod } = orderData;
            
            // Validate required fields
            if (!customerEmail) {
                throw new Error('Customer email is required');
            }
            
            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new Error('Order must have at least one item');
            }
            
            if (typeof total !== 'number' || total < 0) {
                throw new Error('Valid total amount is required');
            }
            
            // Insert order
            const orderResult = await client.query(
                `INSERT INTO orders (customer_email, total, status, delivery_address, payment_method)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [customerEmail, total, status, deliveryAddress, paymentMethod]
            );
            
            const order = orderResult.rows[0];
            
            // Insert order items
            const orderItemsPromises = items.map(item => 
                client.query(
                    `INSERT INTO order_items (order_id, product_id, name, price, quantity)
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [order.id, item.productId, item.name, item.price, item.quantity]
                )
            );
            
            const orderItemsResults = await Promise.all(orderItemsPromises);
            const orderItems = orderItemsResults.map(result => result.rows[0]);
            
            await client.query('COMMIT');
            
            return {
                _id: order.id,
                customerEmail: order.customer_email,
                total: parseFloat(order.total),
                status: order.status,
                deliveryAddress: order.delivery_address,
                paymentMethod: order.payment_method,
                createdAt: order.created_at,
                updatedAt: order.updated_at,
                items: orderItems.map(item => ({
                    id: item.id,
                    productId: item.product_id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                }))
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateStatus(id, status) {
        try {
            const result = await db.query(
                `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2 RETURNING *`,
                [status, id]
            );
            
            if (result.rows.length === 0) {
                return null;
            }
            
            const order = result.rows[0];
            return {
                _id: order.id,
                customerEmail: order.customer_email,
                total: parseFloat(order.total),
                status: order.status,
                deliveryAddress: order.delivery_address,
                paymentMethod: order.payment_method,
                createdAt: order.created_at,
                updatedAt: order.updated_at
            };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        const client = await db.getPool().connect();
        
        try {
            await client.query('BEGIN');
            
            // Check if order exists
            const checkResult = await client.query(
                'SELECT id FROM orders WHERE id = $1',
                [id]
            );
            
            if (checkResult.rows.length === 0) {
                return null;
            }
            
            // Delete order items first
            await client.query(
                'DELETE FROM order_items WHERE order_id = $1',
                [id]
            );
            
            // Delete the order
            await client.query(
                'DELETE FROM orders WHERE id = $1',
                [id]
            );
            
            await client.query('COMMIT');
            
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getStats() {
        try {
            const result = await db.query(`
                SELECT 
                    COUNT(*) as total_orders,
                    SUM(total) as total_revenue,
                    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
                    COUNT(CASE WHEN created_at > (NOW() - INTERVAL '24 hours') THEN 1 END) as orders_today,
                    SUM(CASE WHEN created_at > (NOW() - INTERVAL '24 hours') THEN total ELSE 0 END) as revenue_today,
                    COUNT(CASE WHEN created_at > (NOW() - INTERVAL '7 days') THEN 1 END) as orders_week,
                    SUM(CASE WHEN created_at > (NOW() - INTERVAL '7 days') THEN total ELSE 0 END) as revenue_week,
                    COUNT(CASE WHEN created_at > (NOW() - INTERVAL '30 days') THEN 1 END) as orders_month,
                    SUM(CASE WHEN created_at > (NOW() - INTERVAL '30 days') THEN total ELSE 0 END) as revenue_month
                FROM orders
            `);
            
            const stats = result.rows[0];
            return {
                totalOrders: parseInt(stats.total_orders),
                totalRevenue: parseFloat(stats.total_revenue || 0),
                completedOrders: parseInt(stats.completed_orders),
                cancelledOrders: parseInt(stats.cancelled_orders),
                daily: {
                    orders: parseInt(stats.orders_today),
                    revenue: parseFloat(stats.revenue_today || 0)
                },
                weekly: {
                    orders: parseInt(stats.orders_week),
                    revenue: parseFloat(stats.revenue_week || 0)
                },
                monthly: {
                    orders: parseInt(stats.orders_month),
                    revenue: parseFloat(stats.revenue_month || 0)
                },
                averageOrderValue: stats.total_orders > 0 
                    ? parseFloat(stats.total_revenue) / parseInt(stats.total_orders) 
                    : 0
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;