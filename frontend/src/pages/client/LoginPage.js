import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { customerService } from '../../services/customerService';
import LoginForm from '../../components/client/LoginForm';
import RegisterForm from '../../components/client/RegisterForm';
import Card from '../../components/shared/Card';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Kiểm tra có redirect sau khi đăng nhập không
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      // Hiển thị thông báo
      toast.info('Vui lòng đăng nhập để tiếp tục', {
        icon: '🔑'
      });
    }
  }, []);

  const from = localStorage.getItem('redirectAfterLogin') || '/client';

  const handleLogin = async (email) => {
    try {
      // Simple login - in real app, you'd validate credentials
      const user = { name: email.split('@')[0], email };
      login(user);
      
      // Xóa redirect path khỏi localStorage
      localStorage.removeItem('redirectAfterLogin');
      
      toast.success('Đăng nhập thành công!', {
        icon: '👋'
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Đăng nhập thất bại', {
        icon: '❌'
      });
      throw new Error('Đăng nhập thất bại');
    }
  };

  const handleRegister = async (userData) => {
    try {
      await customerService.createCustomer(userData);
      const user = { name: userData.name, email: userData.email };
      login(user);
      
      // Xóa redirect path khỏi localStorage
      localStorage.removeItem('redirectAfterLogin');
      
      toast.success('Đăng ký thành công!', {
        icon: '🎉'
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(`Đăng ký thất bại: ${error.message}`, {
        icon: '❌'
      });
      throw new Error('Đăng ký thất bại: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}
            </p>
          </div>

          {isLogin ? (
            <LoginForm onSubmit={handleLogin} />
          ) : (
            <RegisterForm onSubmit={handleRegister} />
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin 
                ? 'Chưa có tài khoản? Đăng ký ngay' 
                : 'Đã có tài khoản? Đăng nhập'
              }
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;