const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_payments',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect()
    .then(() => ('Connected to PostgreSQL (Payments)'))
    .catch(err => console.error('PostgreSQL connection error:', err));

// Initialize database tables
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                method VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                transaction_id VARCHAR(255) UNIQUE,
                stripe_payment_id VARCHAR(255),
                gateway_response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
            CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
            CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
        `);
        ('Database tables initialized');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

initDb();

module.exports = { pool };