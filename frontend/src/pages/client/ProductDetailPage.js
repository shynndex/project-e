import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Card from '../../components/shared/Card';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        
        // Kiểm tra dữ liệu trả về có hợp lệ không
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid product data received');
        }
        
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
        toast.error('Không thể tải thông tin sản phẩm', {
          icon: '❌'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('Product ID is missing');
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      try {
        const productToAdd = {
          ...product,
          quantity: quantity
        };
        addToCart(productToAdd);
      } catch (err) {
        console.error('Error adding to cart:', err);
        toast.error('Không thể thêm sản phẩm vào giỏ hàng', {
          icon: '❌'
        });
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    // Đảm bảo số lượng luôn hợp lệ
    const maxStock = product?.stock || 1;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner size="large" className="py-16" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <i className="fas fa-exclamation-triangle text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            {error || 'Product not found'}
          </h2>
          <Button onClick={() => navigate('/client')}>
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  // Đảm bảo các trường dữ liệu đều có giá trị mặc định nếu thiếu
  const {
    name = 'Unknown Product',
    description = 'No description available',
    price = 0,
    stock = 0,
    image = 'https://via.placeholder.com/600x600?text=No+Image',
    category = 'Uncategorized'
  } = product;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <img 
            src={image || 'https://via.placeholder.com/600x600?text=No+Image'} 
            alt={name}
            className="w-full h-96 object-contain"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = 'https://via.placeholder.com/600x600?text=Image+Error';
            }}
          />
        </div>

        {/* Product Details */}
        <div>
          <nav className="flex mb-4 text-sm text-gray-500">
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => navigate('/client')}
              className="hover:text-blue-600"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Products
            </Button>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-blue-600 mr-4">
              ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              stock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{description}</p>

          {category && (
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          )}

          {stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <i className="fas fa-minus"></i>
                </Button>
                <span className="w-16 text-center font-medium text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stock}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <i className="fas fa-plus"></i>
                </Button>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1"
              size="large"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Add to Cart
            </Button>
            
            <Button
              onClick={() => navigate('/client/cart')}
              variant="outline"
              size="large"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Specifications</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>Category: {category || 'General'}</li>
                <li>Stock: {stock} units</li>
                {product.sku && <li>SKU: {product.sku}</li>}
                {product.weight && <li>Weight: {product.weight}</li>}
                {product.dimensions && <li>Dimensions: {product.dimensions}</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Features</h3>
              <p className="mt-2 text-gray-600">
                {description}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;