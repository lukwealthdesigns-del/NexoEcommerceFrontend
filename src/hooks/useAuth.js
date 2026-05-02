import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token && !user) {
        setLoading(true);
        try {
          const userData = authService.getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return { user, isAuthenticated, isLoading };
};