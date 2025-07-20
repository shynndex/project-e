import React from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const ProductTable = ({ products, stats, onEdit, onDelete, onToggleStatus }) => {
  if (products.length === 0) {
    return (
      <Card className="text-center py-8">
        <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-600">Chưa có sản phẩm nào</p>
      </Card>
    );
  }

  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Tổng sản phẩm</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-800">Đang hoạt động</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <div className="text-sm text-red-800">Ngừng hoạt động</div>
          </div>
        </div>
      )}

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product._id} className={`hover:bg-gray-50 ${!product.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {product.name}
                          {!product.isActive && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive
                        ? product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive 
                        ? (product.stock > 0 ? 'Còn hàng' : 'Hết hàng')
                        : 'Ngừng bán'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      size="small"
                      variant={product.isActive ? "warning" : "success"}
                      onClick={() => onToggleStatus(product._id)}
                    >
                      <i className={`fas ${product.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                      {product.isActive ? 'Ẩn' : 'Hiện'}
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => onEdit(product)}
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => onDelete(product)}
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductTable;