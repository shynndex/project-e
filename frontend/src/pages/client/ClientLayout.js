import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from '../../components/client/ClientHeader';
import ClientNavigation from '../../components/client/ClientNavigation';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      <ClientNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;