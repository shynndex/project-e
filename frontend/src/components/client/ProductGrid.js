import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import LoadingSpinner from '../shared/LoadingSpinner';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 mb-4">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <p className="text-gray-600">Lỗi tải sản phẩm: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-box-open text-4xl"></i>
        </div>
        <p className="text-gray-600">Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;