import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Button from '../shared/Button';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngăn việc chuyển đến trang chi tiết
    if (product) {
      addToCart(product);
    }
  };

  const goToProductDetail = () => {
    if (product && product._id) {
      navigate(`/client/product/${product._id}`);
    }
  };

  // Đảm bảo product không null và có đầy đủ thông tin
  if (!product) return null;

  // Thiết lập các giá trị mặc định để tránh lỗi rendering
  const {
    name = 'Sản phẩm',
    description = 'Không có mô tả',
    price = 0,
    stock = 0,
    image = 'https://via.placeholder.com/300x300?text=No+Image'
  } = product;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={goToProductDetail}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </span>
          
          {stock > 0 && stock < 10 && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Còn {stock}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {stock > 0 ? (
              <span className="text-green-600 text-sm">
                <i className="fas fa-check-circle mr-1"></i>
                Còn hàng
              </span>
            ) : (
              <span className="text-red-600 text-sm">
                <i className="fas fa-times-circle mr-1"></i>
                Hết hàng
              </span>
            )}
          </div>
          
          <Button
            size="small"
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            <i className="fas fa-cart-plus mr-1"></i>
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;