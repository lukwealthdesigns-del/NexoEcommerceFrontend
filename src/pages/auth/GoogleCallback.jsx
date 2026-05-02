import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      // Fetch user info
      fetchUserInfo(accessToken);
    } else {
      toast.error('Google login failed');
      navigate('/signin');
    }
  }, [location]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to fetch user:', error);
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;