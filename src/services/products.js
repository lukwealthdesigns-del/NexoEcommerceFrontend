// import api from './api';

// export const productsService = {
//   // ─────────────────────────────────────────────────────────────
//   // PRODUCT CRUD
//   // ─────────────────────────────────────────────────────────────
  
//   async getProducts(params = {}) {
//     const backendParams = {
//       skip: params.skip || params.page ? ((params.page - 1) * (params.limit || 20)) : 0,
//       limit: params.limit || 20,
//       category: params.category || '',
//       search: params.search || params.q || '',
//       min_price: params.minPrice || params.min_price,
//       max_price: params.maxPrice || params.max_price,
//       condition: params.condition || '',
//       sort: params.sort || 'newest'
//     };
    
//     Object.keys(backendParams).forEach(key => {
//       if (backendParams[key] === '' || backendParams[key] === undefined) {
//         delete backendParams[key];
//       }
//     });
    
//     const response = await api.get('/products/', { params: backendParams });
//     return response.data;
//   },
  
//   async getProduct(id) {
//     const response = await api.get(`/products/${id}`);
//     return response.data;
//   },
  
//   async createProduct(productData) {
//     let formData;
//     let headers = {};
    
//     if (productData instanceof FormData) {
//       formData = productData;
//       headers = { 'Content-Type': 'multipart/form-data' };
//     } else {
//       formData = new FormData();
//       Object.keys(productData).forEach(key => {
//         if (key === 'images') {
//           if (Array.isArray(productData.images)) {
//             productData.images.forEach(image => {
//               formData.append('images', image);
//             });
//           }
//         } else if (key === 'video' && productData.video) {
//           formData.append('video', productData.video);
//         } else {
//           formData.append(key, productData[key]);
//         }
//       });
//       headers = { 'Content-Type': 'multipart/form-data' };
//     }
    
//     const response = await api.post('/products/', formData, { headers });
//     return response.data;
//   },
  
//   async updateProduct(id, productData) {
//     const response = await api.put(`/products/${id}`, productData);
//     return response.data;
//   },
  
//   async deleteProduct(id) {
//     const response = await api.delete(`/products/${id}`);
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // USER'S PRODUCTS
//   // ─────────────────────────────────────────────────────────────
  
//   async getMyProducts() {
//     const response = await api.get('/products/users/me/products');
//     return response.data;
//   },
  
//   async getSellerProducts() {
//     const response = await api.get('/products/seller');
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // FEATURED & TRENDING
//   // ─────────────────────────────────────────────────────────────
  
//   async getFeaturedProducts() {
//     const response = await api.get('/products/featured');
//     return response.data;
//   },
  
//   async getTrendingProducts() {
//     const response = await api.get('/products/trending');
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // SEARCH
//   // ─────────────────────────────────────────────────────────────
  
//   async searchProducts(query, filters = {}) {
//     const response = await api.get('/products/', { params: { search: query, ...filters } });
//     return response.data;
//   },
  
//   async getSimilarProducts(id) {
//     const response = await api.get(`/products/${id}/similar`);
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // IMAGE & VIDEO UPLOADS
//   // ─────────────────────────────────────────────────────────────
  
//   async uploadImage(file) {
//     const formData = new FormData();
//     formData.append('file', file);
//     const response = await api.post('/products/upload-image', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data;
//   },
  
//   async uploadVideo(file) {
//     const formData = new FormData();
//     formData.append('file', file);
//     const response = await api.post('/products/upload-video', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // REVIEWS
//   // ─────────────────────────────────────────────────────────────
  
//   async addReview(productId, rating, content) {
//     const response = await api.post(`/products/${productId}/reviews`, { rating, content });
//     return response.data;
//   },
  
//   async getReviews(productId) {
//     const response = await api.get(`/products/${productId}/reviews`);
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // LIKES
//   // ─────────────────────────────────────────────────────────────
  
//   async likeProduct(productId) {
//     const response = await api.post(`/products/${productId}/like`);
//     return response.data;
//   },
  
//   async unlikeProduct(productId) {
//     const response = await api.delete(`/products/${productId}/like`);
//     return response.data;
//   },
  
//   async getProductLikes(productId) {
//     const response = await api.get(`/products/${productId}/likes`);
//     return response.data;
//   },
  
//   async getLikedProducts() {
//     try {
//       const response = await api.get('/users/me/likes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get liked products:', error);
//       return [];
//     }
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // SHARES
//   // ─────────────────────────────────────────────────────────────
  
//   async shareProduct(productId) {
//     const response = await api.post(`/products/${productId}/share`);
//     return response.data;
//   },
  
//   async getProductShares(productId) {
//     const response = await api.get(`/products/${productId}/shares`);
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // COMMENTS
//   // ─────────────────────────────────────────────────────────────
  
//   async getComments(productId, params = {}) {
//     const response = await api.get(`/products/${productId}/comments`, { params });
//     // FIX: Backend returns a plain array — normalise here so callers always
//     // receive an array regardless of any future shape change.
//     return Array.isArray(response.data) ? response.data : (response.data?.comments || []);
//   },
  
//   async addComment(productId, content, parentId = null) {
//     const response = await api.post(`/products/${productId}/comments`, {
//       content,
//       parent_id: parentId || null,
//     });
//     return response.data;
//   },
  
//   async updateComment(commentId, content) {
//     const response = await api.put(`/products/comments/${commentId}`, null, { params: { content } });
//     return response.data;
//   },
  
//   async deleteComment(commentId) {
//     const response = await api.delete(`/products/comments/${commentId}`);
//     return response.data;
//   },
  
//   async likeComment(commentId) {
//     const response = await api.post(`/products/comments/${commentId}/like`);
//     return response.data;
//   },

//   // FIX: This method was missing entirely — backend has DELETE /comments/{id}/like
//   async unlikeComment(commentId) {
//     const response = await api.delete(`/products/comments/${commentId}/like`);
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // WISHLIST / SAVED PRODUCTS
//   // ─────────────────────────────────────────────────────────────
  
//   async getSavedProducts() {
//     try {
//       const response = await api.get('/wishlist');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get saved products:', error);
//       return [];
//     }
//   },
  
//   async saveProduct(productId) {
//     const response = await api.post('/wishlist', { product_id: productId });
//     return response.data;
//   },
  
//   async unsaveProduct(productId) {
//     const response = await api.delete(`/wishlist/${productId}`);
//     return response.data;
//   },
  
//   async isProductSaved(productId) {
//     try {
//       const response = await api.get(`/wishlist/check/${productId}`);
//       return response.data.is_saved;
//     } catch (error) {
//       return false;
//     }
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // ADMIN ENDPOINTS
//   // ─────────────────────────────────────────────────────────────
  
//   async getPendingProducts() {
//     const response = await api.get('/products/admin/pending');
//     return response.data;
//   },
  
//   async approveProduct(productId) {
//     const response = await api.put(`/products/admin/${productId}/approve`);
//     return response.data;
//   },
  
//   async rejectProduct(productId, reason) {
//     const response = await api.put(`/products/admin/${productId}/reject`, null, { params: { reason } });
//     return response.data;
//   },
  
//   // ─────────────────────────────────────────────────────────────
//   // BOOSTED PRODUCTS
//   // ─────────────────────────────────────────────────────────────
  
//   async getBoostedProducts() {
//     try {
//       const response = await api.get('/premium/api/boosted-ads');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get boosted products:', error);
//       return { products: [], total: 0 };
//     }
//   },
  
//   async boostProduct(productId) {
//     const response = await api.post(`/premium/boost/${productId}`);
//     return response.data;
//   },
  
//   async unboostProduct(productId) {
//     const response = await api.delete(`/premium/unboost/${productId}`);
//     return response.data;
//   },
  
//   async getMyBoostedProducts() {
//     const response = await api.get('/premium/my-boosted-products');
//     return response.data;
//   }
// };

import api from './api';

export const productsService = {
  // ─────────────────────────────────────────────────────────────
  // PRODUCT CRUD
  // ─────────────────────────────────────────────────────────────

  async getProducts(params = {}) {
    const limit = Number(params.limit) || 20;

    // Compute skip safely: prefer explicit skip, fall back to page math, else 0.
    let skip = 0;
    if (Number.isFinite(params.skip)) {
      skip = params.skip;
    } else if (Number.isFinite(params.page) && params.page > 0) {
      skip = (params.page - 1) * limit;
    }

    // Coerce numeric params and drop anything that isn't a finite number.
    const toNumber = (v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 ? n : undefined;
    };

    const minPrice = toNumber(params.minPrice ?? params.min_price);
    const maxPrice = toNumber(params.maxPrice ?? params.max_price);

    const backendParams = {
      skip,
      limit,
      ...(params.category ? { category: params.category } : {}),
      ...((params.search || params.q)
        ? { search: (params.search || params.q).trim() }
        : {}),
      ...(minPrice !== undefined ? { min_price: minPrice } : {}),
      ...(maxPrice !== undefined ? { max_price: maxPrice } : {}),
      ...(params.condition ? { condition: params.condition } : {}),
      sort: params.sort || 'newest',
    };

    const response = await api.get('/products/', { params: backendParams });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get('/products/' + id);
    return response.data;
  },

  async createProduct(productData) {
    let formData;
    let headers = {};

    if (productData instanceof FormData) {
      formData = productData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === 'images') {
          if (Array.isArray(productData.images)) {
            productData.images.forEach((image) => {
              formData.append('images', image);
            });
          }
        } else if (key === 'video' && productData.video) {
          formData.append('video', productData.video);
        } else {
          formData.append(key, productData[key]);
        }
      });
      headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await api.post('/products/', formData, { headers });
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put('/products/' + id, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete('/products/' + id);
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // USER'S PRODUCTS
  // ─────────────────────────────────────────────────────────────

  async getMyProducts() {
    const response = await api.get('/products/users/me/products');
    return response.data;
  },

  async getSellerProducts() {
    const response = await api.get('/products/seller');
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // FEATURED & TRENDING
  // ─────────────────────────────────────────────────────────────

  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  async getTrendingProducts() {
    const response = await api.get('/products/trending');
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────

  async searchProducts(query, filters = {}) {
    const response = await api.get('/products/', {
      params: { search: query, ...filters },
    });
    return response.data;
  },

  async getSimilarProducts(id) {
    const response = await api.get('/products/' + id + '/similar');
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // IMAGE & VIDEO UPLOADS
  // ─────────────────────────────────────────────────────────────

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadVideo(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/products/upload-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // REVIEWS
  // ─────────────────────────────────────────────────────────────

  async addReview(productId, rating, content) {
    const response = await api.post('/products/' + productId + '/reviews', {
      rating,
      content,
    });
    return response.data;
  },

  async getReviews(productId) {
    const response = await api.get('/products/' + productId + '/reviews');
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // LIKES
  // ─────────────────────────────────────────────────────────────

  async likeProduct(productId) {
    const response = await api.post('/products/' + productId + '/like');
    return response.data;
  },

  async unlikeProduct(productId) {
    const response = await api.delete('/products/' + productId + '/like');
    return response.data;
  },

  async getProductLikes(productId) {
    const response = await api.get('/products/' + productId + '/likes');
    return response.data;
  },

  async getLikedProducts() {
    try {
      const response = await api.get('/users/me/likes');
      return response.data;
    } catch (error) {
      console.error('Failed to get liked products:', error);
      return [];
    }
  },

  // ─────────────────────────────────────────────────────────────
  // SHARES
  // ─────────────────────────────────────────────────────────────

  async shareProduct(productId) {
    const response = await api.post('/products/' + productId + '/share');
    return response.data;
  },

  async getProductShares(productId) {
    const response = await api.get('/products/' + productId + '/shares');
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // COMMENTS
  // ─────────────────────────────────────────────────────────────

  async getComments(productId, params = {}) {
    const response = await api.get(
      '/products/' + productId + '/comments',
      { params }
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data?.comments || [];
  },

  async addComment(productId, content, parentId = null) {
    const response = await api.post(
      '/products/' + productId + '/comments',
      { content, parent_id: parentId || null }
    );
    return response.data;
  },

  async updateComment(commentId, content) {
    const response = await api.put(
      '/products/comments/' + commentId,
      null,
      { params: { content } }
    );
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await api.delete('/products/comments/' + commentId);
    return response.data;
  },

  async likeComment(commentId) {
    const response = await api.post(
      '/products/comments/' + commentId + '/like'
    );
    return response.data;
  },

  async unlikeComment(commentId) {
    const response = await api.delete(
      '/products/comments/' + commentId + '/like'
    );
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // WISHLIST / SAVED PRODUCTS
  // ─────────────────────────────────────────────────────────────

  async getSavedProducts() {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Failed to get saved products:', error);
      return [];
    }
  },

  async saveProduct(productId) {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  },

  async unsaveProduct(productId) {
    const response = await api.delete('/wishlist/' + productId);
    return response.data;
  },

  async isProductSaved(productId) {
    try {
      const response = await api.get('/wishlist/check/' + productId);
      return response.data.is_saved;
    } catch (error) {
      return false;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ADMIN ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getPendingProducts() {
    const response = await api.get('/products/admin/pending');
    return response.data;
  },

  async approveProduct(productId) {
    const response = await api.put(
      '/products/admin/' + productId + '/approve'
    );
    return response.data;
  },

  async rejectProduct(productId, reason) {
    const response = await api.put(
      '/products/admin/' + productId + '/reject',
      null,
      { params: { reason } }
    );
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────
  // BOOSTED PRODUCTS
  // ─────────────────────────────────────────────────────────────

  async getBoostedProducts() {
    try {
      const response = await api.get('/premium/api/boosted-ads');
      return response.data;
    } catch (error) {
      console.error('Failed to get boosted products:', error);
      return { products: [], total: 0 };
    }
  },

  async boostProduct(productId) {
    const response = await api.post('/premium/boost/' + productId);
    return response.data;
  },

  async unboostProduct(productId) {
    const response = await api.delete('/premium/unboost/' + productId);
    return response.data;
  },

  async getMyBoostedProducts() {
    const response = await api.get('/premium/my-boosted-products');
    return response.data;
  },
};