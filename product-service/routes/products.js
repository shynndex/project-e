const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Basic CRUD routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Additional routes
router.patch('/:id/stock', productController.updateStock);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/admin/low-stock', productController.getLowStockProducts);
router.patch('/admin/bulk-update', productController.bulkUpdateProducts);
// ✅ Admin route to get all products (including inactive)
router.get('/admin/all', async (req, res) => {
  try {
    const Product = require('../models/Product');
    
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // ✅ No isActive filter - get all products
    const filter = {};
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(filter);
    
    const activeCount = await Product.countDocuments({ isActive: true });
    const inactiveCount = await Product.countDocuments({ isActive: false });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: {
        total,
        active: activeCount,
        inactive: inactiveCount
      }
    });
  } catch (error) {
    console.error('Admin get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all products',
      error: error.message
    });
  }
});

// ✅ Admin route to toggle product status
router.patch('/admin/:id/toggle-status', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Toggle isActive status
    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling product status',
      error: error.message
    });
  }
});
module.exports = router;