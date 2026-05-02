import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'admin' && user?.role !== 'admin' && user?.role !== 'super_admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'super_admin' && user?.role !== 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;