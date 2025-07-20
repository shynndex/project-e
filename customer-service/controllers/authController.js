const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  name: Joi.string().required().max(50).trim(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  address: Joi.string().required()
});

// Generate JWT token
const generateToken = (customerId) => {
  return jwt.sign(
    { customerId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Register customer
exports.register = async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Convert address string to object
    const customerData = {
      ...value,
      address: {
        street: value.address,
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        zipCode: '70000',
        country: 'Vietnam'
      }
    };

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: value.email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create customer
    const customer = new Customer(customerData);
    await customer.save();

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering customer',
      error: error.message
    });
  }
};

// Login customer
exports.login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = value;

    // Find customer and include password
    const customer = await Customer.findOne({ 
      email, 
      isActive: true 
    }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await customer.updateLastLogin();

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current customer profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId);
    
    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'address', 'dateOfBirth', 'gender', 'preferences'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const customer = await Customer.findByIdAndUpdate(
      req.customerId,
      updates,
      { new: true, runValidators: true }
    );

    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Find customer with password
    const customer = await Customer.findById(req.customerId).select('+password');
    
    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await customer.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    customer.password = newPassword;
    await customer.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};