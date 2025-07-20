import React, { useState } from 'react';
import Button from '../shared/Button';
import Input from '../shared/Input';

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        label="Họ và tên"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nguyễn Văn A"
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        required
      />

      <Input
        label="Số điện thoại"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="0123456789"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Địa chỉ đầy đủ"
          required
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Input
        label="Mật khẩu"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Tối thiểu 6 ký tự"
        required
      />

      <Input
        label="Xác nhận mật khẩu"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu"
        required
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="large"
      >
        Đăng ký
      </Button>
    </form>
  );
};

export default RegisterForm;