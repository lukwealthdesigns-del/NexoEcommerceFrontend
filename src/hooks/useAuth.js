// import { useEffect } from 'react';
// import { useAuthStore } from '../store/authStore';
// import { authService } from '../services/auth';

// export const useAuth = () => {
//   const { user, isAuthenticated, setUser, setLoading, isLoading } = useAuthStore();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('access_token');
//       if (token && !user) {
//         setLoading(true);
//         try {
//           const userData = authService.getCurrentUser();
//           if (userData) {
//             setUser(userData);
//           }
//         } catch (error) {
//           console.error('Auth check failed:', error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   return { user, isAuthenticated, isLoading };
// };

// src/hooks/useAuth.js

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    fetchCurrentUser,
    signin,
  } = useAuthStore();

  // Check the current authentication state when the hook mounts.
  useEffect(() => {
    if (authService.isAuthenticated()) {
      if (!user) {
        fetchCurrentUser();
      }
    }
  }, [user, fetchCurrentUser]);

  // Email signup. The backend should send an OTP for verification.
  const signup = useCallback(async (userData) => {
    try {
      const response = await authService.signUp(userData);

      return {
        success: true,
        ...response,
      };
    } catch (error) {
      console.error('Signup error:', error);

      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Unable to create your account.'
      );
    }
  }, []);

  // Support both common signup naming conventions.
  const signUp = signup;

  // Email and password login using the existing Zustand store.
  const login = useCallback(async (email, password) => {
    const result = await signin(email, password);

    if (!result?.success) {
      throw new Error(result?.error || 'Login failed.');
    }

    return result;
  }, [signin]);

  const signIn = login;

  // Google login. This service requires a Google ID token.
  const googleLogin = useCallback(async (idToken) => {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error(
        'A Google ID token is required. Complete Google sign-in first.'
      );
    }

    try {
      const response = await authService.googleLogin(idToken);

      if (response?.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Google login error:', error);

      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Google login failed.'
      );
    }
  }, [setUser]);

  // Verify the six-digit email OTP.
  const verifyOTP = useCallback(async (email, otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);

      if (response?.user && response?.access_token) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('OTP verification error:', error);

      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'OTP verification failed.'
      );
    }
  }, [setUser]);

  const resendOTP = useCallback(async (email) => {
    try {
      return await authService.resendOTP(email);
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Unable to resend the verification code.'
      );
    }
  }, []);

  // Password recovery helpers.
  const forgotPassword = useCallback(async (email) => {
    return await authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    return await authService.resetPassword(token, newPassword);
  }, []);

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      return await authService.changePassword(
        currentPassword,
        newPassword
      );
    },
    []
  );

  // Log out and clear the authentication session.
  const logout = useCallback(() => {
    authService.logout();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,

    signup,
    signUp,
    login,
    signIn,
    googleLogin,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
  };
};

