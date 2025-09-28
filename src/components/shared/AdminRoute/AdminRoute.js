import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { isAdminEmail } from '../../../constants/admin';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, role } = useAuth();

  console.log('AdminRoute - currentUser:', currentUser?.email);
  console.log('AdminRoute - role:', role);
  console.log('AdminRoute - loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Role-based check - check both role and email for immediate admin detection
  const isAdmin = role === 'admin' || (currentUser?.email && isAdminEmail(currentUser.email));
  console.log('AdminRoute - isAdmin:', isAdmin);
  console.log('AdminRoute - role check:', role === 'admin');
  console.log('AdminRoute - email check:', currentUser?.email && isAdminEmail(currentUser.email));

  if (!currentUser) {
    console.log('AdminRoute - No current user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('AdminRoute - Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Admin access granted');
  return children;
};

export default AdminRoute;
