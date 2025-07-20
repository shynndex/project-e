import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminProducts = () => {
  const { 
    products, 
    loading, 
    error, 
    stats,
    createProduct, 
    updateProduct, 
    deleteProduct,
    toggleProductStatus 
  } = useProducts(true); // ✅ Admin mode = true

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setShowForm(false);
    } catch (error) {
      alert('Lỗi tạo sản phẩm: ' + error.message);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(editingProduct._id, productData);
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert('Lỗi cập nhật sản phẩm: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        await deleteProduct(product._id);
      } catch (error) {
        alert('Lỗi xóa sản phẩm: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      await toggleProductStatus(productId);
    } catch (error) {
      alert('Lỗi thay đổi trạng thái: ' + error.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <LoadingSpinner size="large" className="py-16" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Quản lý danh sách sản phẩm trong cửa hàng</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <i className="fas fa-plus mr-2"></i>
          Thêm sản phẩm
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Lỗi: {error}
        </div>
      )}

      <ProductTable
        products={products}
        stats={stats}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        size="large"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
};

export default AdminProducts;