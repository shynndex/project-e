import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Chào mừng đến với EStore
          </h1>
          <p className="text-xl mb-6 text-blue-100 max-w-2xl mx-auto">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
          </p>
          <Button 
            variant="secondary" 
            size="large"
            onClick={() => window.scrollTo({top: 500, behavior: 'smooth'})}
          >
            Khám phá ngay
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
            <i className="fas fa-shipping-fast text-3xl mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">Giao hàng nhanh</h3>
            <p className="text-sm text-blue-100">Nhận hàng trong 24h</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
            <i className="fas fa-shield-alt text-3xl mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">Bảo hành chính hãng</h3>
            <p className="text-sm text-blue-100">Đảm bảo chất lượng</p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
            <i className="fas fa-headset text-3xl mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">Hỗ trợ 24/7</h3>
            <p className="text-sm text-blue-100">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;