

// import api from './api';

// export const authService = {
//   async signUp(userData) {
//     // Change from /auth/register to /auth/signup to match your backend
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   },
  
//   async verifyOTP(email, otp) {
//     const response = await api.post('/auth/verify-otp', { email, otp });
//     if (response.data.access_token) {
//       localStorage.setItem('access_token', response.data.access_token);
//       localStorage.setItem('refresh_token', response.data.refresh_token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response.data;
//   },
  
//   async resendOTP(email) {
//     const response = await api.post('/auth/resend-otp', { email });
//     return response.data;
//   },
  
//   async signIn(email, password) {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       if (response.data.access_token) {
//         localStorage.setItem('access_token', response.data.access_token);
//         localStorage.setItem('refresh_token', response.data.refresh_token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
//       return response.data;
//     } catch (error) {
//       if (error.response?.status === 404) {
//         try {
//           const response = await api.post('/auth/signin', { email, password });
//           if (response.data.access_token) {
//             localStorage.setItem('access_token', response.data.access_token);
//             localStorage.setItem('refresh_token', response.data.refresh_token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//           }
//           return response.data;
//         } catch (innerError) {
//           throw innerError;
//         }
//       }
//       throw error;
//     }
//   },
  
//   async googleLogin(idToken) {
//     const response = await api.post('/auth/google', { id_token: idToken });
//     if (response.data.access_token) {
//       localStorage.setItem('access_token', response.data.access_token);
//       localStorage.setItem('refresh_token', response.data.refresh_token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response.data;
//   },
  
//   async forgotPassword(email) {
//     const response = await api.post('/auth/forgot-password', { email });
//     return response.data;
//   },
  
//   async resetPassword(token, newPassword) {
//     const response = await api.post('/auth/reset-password', { 
//       token, 
//       new_password: newPassword 
//     });
//     return response.data;
//   },
  
//   async changePassword(currentPassword, newPassword) {
//     const response = await api.post('/auth/change-password', { 
//       current_password: currentPassword, 
//       new_password: newPassword 
//     });
//     return response.data;
//   },
  
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/';
//   },
  
//   getCurrentUser() {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   },
  
//   isAuthenticated() {
//     return !!localStorage.getItem('access_token');
//   }
// };
import api from './api';

export const authService = {
  async signUp(userData) {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  async verifyOTP(email, otp) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  async resendOTP(email) {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
  
  async verifyResetOTP(email, otp) {
    const response = await api.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },
  
  async signIn(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const response = await api.post('/auth/signin', { email, password });
          if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          return response.data;
        } catch (innerError) {
          throw innerError;
        }
      }
      throw error;
    }
  },
  
  async googleLogin(idToken) {
    const response = await api.post('/auth/google', { id_token: idToken });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', { 
      token, 
      new_password: newPassword 
    });
    return response.data;
  },
  
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', { 
      current_password: currentPassword, 
      new_password: newPassword 
    });
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};