import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/admin" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <i className="fas fa-cog mr-2"></i>
              Admin Panel
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/client" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="small">
                <i className="fas fa-external-link-alt mr-2"></i>
                Xem cửa hàng
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;