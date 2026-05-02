

// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 30000,
// });

// // Helper function to extract error message
// const getErrorMessage = (error) => {
//   if (error.response?.data?.detail) {
//     const detail = error.response.data.detail;
    
//     if (typeof detail === 'string') {
//       return detail;
//     }
    
//     if (Array.isArray(detail) && detail.length > 0) {
//       const firstError = detail[0];
//       if (typeof firstError === 'string') return firstError;
//       if (firstError?.msg) return firstError.msg;
//       if (firstError?.message) return firstError.message;
//       return JSON.stringify(firstError);
//     }
    
//     if (typeof detail === 'object') {
//       const messages = [];
//       for (const key in detail) {
//         if (Array.isArray(detail[key])) {
//           messages.push(`${key}: ${detail[key].join(', ')}`);
//         } else if (typeof detail[key] === 'string') {
//           messages.push(detail[key]);
//         }
//       }
//       if (messages.length > 0) {
//         return messages.join('; ');
//       }
//       return JSON.stringify(detail);
//     }
//   }
  
//   if (error.response?.data?.message) {
//     return error.response.data.message;
//   }
  
//   if (error.message) {
//     return error.message;
//   }
  
//   return 'An error occurred. Please try again.';
// };

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Handle 401 Unauthorized - try to refresh token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (refreshToken) {
//           const response = await axios.post(`${API_URL}/auth/refresh`, {
//             refresh_token: refreshToken,
//           });
          
//           if (response.data.access_token) {
//             localStorage.setItem('access_token', response.data.access_token);
//             originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
//             return api(originalRequest);
//           }
//         }
//       } catch (refreshError) {
//         // Clear storage and redirect to login
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user');
        
//         // Only redirect if not already on login page
//         if (!window.location.pathname.includes('/signin') && 
//             !window.location.pathname.includes('/signup')) {
//           window.location.href = '/signin';
//         }
//       }
//     }
    
//     // For 400 errors, just pass through without showing toast
//     // The components will handle showing specific error messages
//     if (error.response?.status === 400) {
//       return Promise.reject(error);
//     }
    
//     // For other errors, show toast notification
//     const errorMessage = getErrorMessage(error);
//     console.error('API Error:', errorMessage);
    
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ============================================================
// DEBUG INTERCEPTORS (Add these for debugging)
// ============================================================

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Request data:', config.data);
    console.log('🔑 Token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.config?.url);
    console.error('❌ Error data:', error.response?.data);
    return Promise.reject(error);
  }
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Helper function to extract error message
const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    
    if (typeof detail === 'string') {
      return detail;
    }
    
    if (Array.isArray(detail) && detail.length > 0) {
      const firstError = detail[0];
      if (typeof firstError === 'string') return firstError;
      if (firstError?.msg) return firstError.msg;
      if (firstError?.message) return firstError.message;
      return JSON.stringify(firstError);
    }
    
    if (typeof detail === 'object') {
      const messages = [];
      for (const key in detail) {
        if (Array.isArray(detail[key])) {
          messages.push(`${key}: ${detail[key].join(', ')}`);
        } else if (typeof detail[key] === 'string') {
          messages.push(detail[key]);
        }
      }
      if (messages.length > 0) {
        return messages.join('; ');
      }
      return JSON.stringify(detail);
    }
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An error occurred. Please try again.';
};

// ============================================================
// AUTH INTERCEPTOR
// ============================================================

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR FOR ERROR HANDLING
// ============================================================

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/signin') && 
            !window.location.pathname.includes('/signup')) {
          window.location.href = '/signin';
        }
      }
    }
    
    // For 400 errors, just pass through without showing toast
    // The components will handle showing specific error messages
    if (error.response?.status === 400) {
      return Promise.reject(error);
    }
    
    // For other errors, show toast notification
    const errorMessage = getErrorMessage(error);
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;
