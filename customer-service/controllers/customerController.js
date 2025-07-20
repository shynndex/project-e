const Customer = require('../models/Customer');

// Get all active customers
exports.getAllCustomers = async (req, res, next) => {
    try {
        ('Getting all customers');
        const customers = await Customer.find({ isActive: true })
            .select('-passwordHash')
            .sort({ createdAt: -1 });
        
        (`Found ${customers.length} customers`);
        res.json(customers);
    } catch (error) {
        console.error('Error in getAllCustomers:', error);
        next(error);
    }
};

// Get single customer by ID
exports.getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id,
            isActive: true
        }).select('-passwordHash');
            
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

// Get customer by email
exports.getCustomerByEmail = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ 
            email: req.params.email, 
            isActive: true
        }).select('-passwordHash');
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

// Create customer
exports.createCustomer = async (req, res, next) => {
    try {
        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email: req.body.email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        // Ensure isActive is true when creating
        const customerData = {
            ...req.body,
            isActive: true
        };
        
        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();
        
        // Remove passwordHash from response
        const responseCustomer = savedCustomer.toObject();
        delete responseCustomer.passwordHash;
        
        res.status(201).json(responseCustomer);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        next(error);
    }
};

// Update customer
exports.updateCustomer = async (req, res, next) => {
    try {
        // Don't allow email to be changed to one that already exists
        if (req.body.email) {
            const existingCustomer = await Customer.findOne({ 
                email: req.body.email, 
                _id: { $ne: req.params.id } 
            });
            
            if (existingCustomer) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            req.body,
            { new: true, runValidators: true }
        ).select('-passwordHash');
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.json(customer);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        next(error);
    }
};

// Delete customer (soft delete)
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get customer stats
exports.getCustomerStats = async (req, res, next) => {
    try {
        const stats = {
            total: await Customer.countDocuments(),
            active: await Customer.countDocuments({ isActive: true }),
            today: await Customer.countDocuments({ 
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
            }),
            thisWeek: await Customer.countDocuments({ 
                createdAt: { 
                    $gte: new Date(new Date().setDate(new Date().getDate() - 7)) 
                } 
            }),
            thisMonth: await Customer.countDocuments({ 
                createdAt: { 
                    $gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
                } 
            })
        };
        
        res.json(stats);
    } catch (error) {
        next(error);
    }
};