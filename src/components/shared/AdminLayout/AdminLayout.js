import React from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import NotificationContainer from '../NotificationContainer/NotificationContainer';
import ConfirmationContainer from '../ConfirmationContainer/ConfirmationContainer';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <AdminHeader />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <NotificationContainer />
      <ConfirmationContainer />
    </div>
  );
};

export default AdminLayout;
