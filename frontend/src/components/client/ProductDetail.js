import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import ProductImageGallery from './ProductImageGallery';
import ProductReviews from './ProductReviews';
import Button from '../shared/Button';
import Card from '../shared/Card';

const ProductDetail = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const inCartQuantity = getItemQuantity(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductImageGallery 
            images={[
              product.image || 'https://via.placeholder.com/600x600?text=No+Image'
            ]} 
            productName={product.name}
          />
        </div>

        {/* Product Info */}
        <div>
          <Card>
            {/* Product Title & Category */}
            <div className="mb-4">
              <span className="text-blue-600 text-sm font-medium">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${
                        i < Math.floor(product.rating.average)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating.average}/5 ({product.rating.count} đánh giá)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600">
                ${product.price}
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <div className="text-orange-600 text-sm mt-1">
                  ⚠️ Chỉ còn {product.stock} sản phẩm
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>Còn hàng ({product.stock} sản phẩm)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <i className="fas fa-times-circle mr-2"></i>
                  <span>Hết hàng</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 text-lg"
                variant={isInCart(product._id) ? "success" : "primary"}
              >
                {product.stock > 0 ? (
                  <>
                    <i className="fas fa-cart-plus mr-2"></i>
                    {isInCart(product._id) 
                      ? `Đã có trong giỏ (${inCartQuantity}) - Thêm ${quantity} nữa`
                      : `Thêm ${quantity} vào giỏ hàng`
                    }
                  </>
                ) : (
                  <>
                    <i className="fas fa-times-circle mr-2"></i>
                    Hết hàng
                  </>
                )}
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Thông tin sản phẩm:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span>{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span>{product.category}</span>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Card>
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Mô tả', icon: 'fas fa-align-left' },
                { id: 'specifications', label: 'Thông số', icon: 'fas fa-list' },
                { id: 'reviews', label: 'Đánh giá', icon: 'fas fa-star' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  {/* Additional description content */}
                  <div className="mt-4 space-y-3">
                    <h4 className="font-semibold">Tính năng nổi bật:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Chất lượng cao, được kiểm tra nghiêm ngặt</li>
                      <li>Bảo hành chính hãng</li>
                      <li>Giao hàng nhanh chóng</li>
                      <li>Hỗ trợ khách hàng 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Danh mục:</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">SKU:</span>
                      <span>{product.sku || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Giá:</span>
                      <span className="text-blue-600 font-bold">${product.price}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Tình trạng:</span>
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Số lượng:</span>
                      <span>{product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews product={product} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;