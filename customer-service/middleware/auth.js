const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shyzzhehe');
    const customer = await Customer.findById(decoded.customerId);

    if (!customer || !customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.customerId = customer._id;
    req.customer = customer;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = auth;