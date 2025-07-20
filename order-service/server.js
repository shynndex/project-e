const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_orders',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect()
    .then(() => ('Connected to PostgreSQL (Orders)'))
    .catch(err => console.error('PostgreSQL connection error:', err));

// Initialize database tables
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_email VARCHAR(255) NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                delivery_address TEXT,
                payment_method VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
            CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        `);
        ('Database tables initialized');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

initDb();

// Make pool available to routes
app.locals.pool = pool;

// Routes
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Order Service' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    (`Order Service running on port ${PORT}`);
});

module.exports = app;