import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuthStore();
  const token = localStorage.getItem('access_token');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }
  
  if (!user && !token) {
    return <Navigate to="/signin" replace />;
  }
  
  let currentUser = user;
  if (!currentUser && token) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }
  
  if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;