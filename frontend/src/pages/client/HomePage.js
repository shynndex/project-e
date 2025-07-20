import React from 'react';
import ProductGrid from '../../components/client/ProductGrid';
import Hero from '../../components/client/Hero';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Sản phẩm nổi bật</h2>
        <ProductGrid />
      </div>
    </div>
  );
};

export default HomePage;