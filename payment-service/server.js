const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Payment Service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Payment Service Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong in the payment service!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(PORT, () => {
    (`Payment Service running on port ${PORT}`);
});

module.exports = app;