

// import { create } from 'zustand';
// import api from '../services/api';

// const useAuthStore = create((set, get) => ({
//   user: JSON.parse(localStorage.getItem('user') || 'null'),
//   isLoading: false,
//   isAuthenticated: !!localStorage.getItem('access_token'),

//   fetchCurrentUser: async () => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       set({ isLoading: false });
//       return;
//     }
    
//     set({ isLoading: true });
//     try {
//       const response = await api.get('/auth/me');
//       if (response.data) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//         set({ user: response.data, isLoading: false, isAuthenticated: true });
//       }
//     } catch (error) {
//       console.error('Fetch user error:', error);
//       set({ user: null, isLoading: false, isAuthenticated: false });
//     }
//   },

//   signin: async (email, password) => {
//     set({ isLoading: true });
//     try {
//       const response = await api.post('/auth/login', { email, password });
      
//       if (response.data.access_token) {
//         localStorage.setItem('access_token', response.data.access_token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         set({ 
//           user: response.data.user, 
//           isLoading: false, 
//           isAuthenticated: true 
//         });
//         return { success: true, user: response.data.user };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       set({ isLoading: false });
//       return { success: false, error: error.response?.data?.detail || 'Login failed' };
//     }
//     return { success: false };
//   },

//   // This is the missing method your SignIn.jsx is calling
//   setUser: (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     set({ user: userData, isAuthenticated: true });
//   },

//   // ADD THIS METHOD - For updating user data (like avatar)
//   updateUser: (updates) => {
//     const currentUser = get().user;
//     if (currentUser) {
//       const updatedUser = { ...currentUser, ...updates };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       set({ user: updatedUser });
//     }
//   },

//   logout: () => {
//     localStorage.clear();
//     set({ user: null, isAuthenticated: false, isLoading: false });
//     window.location.href = '/signin';
//   },
// }));

// export { useAuthStore };
import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('access_token'),

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await api.get('/users/me');
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        set({ user: response.data, isLoading: false, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ user: null, isLoading: false, isAuthenticated: false });
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        set({ 
          user: response.data.user, 
          isLoading: false, 
          isAuthenticated: true 
        });
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
    return { success: false };
  },

  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  refreshUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const response = await api.get('/users/me');
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        set({ user: response.data, isAuthenticated: true });
        return response.data;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
    return null;
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/signin';
  },
}));

export { useAuthStore };