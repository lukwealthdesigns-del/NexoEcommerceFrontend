
// import api from './api';

// export const premiumService = {
//   // Get available premium plans
//   async getPlans() {
//     const response = await api.get('/premium/plans');
//     return response.data;
//   },
  
//   // Get user's current subscription
//   async getMySubscription() {
//     const response = await api.get('/premium/my-subscription');
//     return response.data;
//   },
  
//   // Get boost statistics for user
//   async getBoostStats() {
//     const response = await api.get('/premium/boost-stats');
//     return response.data;
//   },
  
//   // Initialize payment for premium purchase
//   async initializePayment(plan, amount, email) {
//     const response = await api.post('/payments/initialize-premium', {
//       plan,
//       amount,
//       email
//     });
//     return response.data;
//   },
  
//   // Purchase premium after payment
//   async purchasePremium(plan, paymentReference) {
//     const response = await api.post('/premium/purchase', {
//       plan,
//       payment_reference: paymentReference
//     });
//     return response.data;
//   },
  
//   // Cancel premium subscription
//   async cancelSubscription() {
//     const response = await api.post('/premium/cancel');
//     return response.data;
//   },
  
//   // Get boosted products (for display)
//   async getBoostedProducts(params = {}) {
//     const response = await api.get('/premium/products/boost', { params });
//     return response.data;
//   },
  
//   // Track ad click
//   async trackAdClick(productId) {
//     const response = await api.post(`/premium/boosted/${productId}/click`);
//     return response.data;
//   },
  
//   // Track ad impression
//   async trackAdImpression(productId) {
//     const response = await api.post(`/premium/boosted/${productId}/impression`);
//     return response.data;
//   },
  
//   // Get premium features list
//   async getPremiumFeatures() {
//     const response = await api.get('/premium/features');
//     return response.data;
//   },
  
//   // Upgrade plan
//   async upgradePlan(newPlan) {
//     const response = await api.post('/premium/upgrade', { plan: newPlan });
//     return response.data;
//   },
  
//   // Boost a product (premium users)
//   async boostProduct(productId) {
//     const response = await api.post(`/premium/boost/${productId}`);
//     return response.data;
//   },
// };

import api from './api';

export const premiumService = {
  // Get available premium plans
  async getPlans() {
    const response = await api.get('/premium/plans');
    return response.data;
  },
  
  // Get user's current subscription
  async getMySubscription() {
    const response = await api.get('/premium/my-subscription');
    return response.data;
  },
  
  // Get boost statistics for user
  async getBoostStats() {
    const response = await api.get('/premium/boost-stats');
    return response.data;
  },
  
  // Initialize payment for premium purchase
  async initializePayment(plan, amount, email) {
    const response = await api.post('/payments/initialize-premium', {
      plan,
      amount,
      email
    });
    return response.data;
  },
  
  // Purchase premium after payment
  async purchasePremium(plan, paymentReference) {
    const response = await api.post('/premium/purchase', {
      plan,
      payment_reference: paymentReference
    });
    return response.data;
  },
  
  // Cancel premium subscription
  async cancelSubscription() {
    const response = await api.post('/premium/cancel');
    return response.data;
  },
  
  // Get boosted products (for display) - USING WORKING ENDPOINT
  async getBoostedProducts(params = {}) {
    const response = await api.get('/premium/api/boosted-ads', { params });
    return response.data;
  },
  
  // Track ad click
  async trackAdClick(productId) {
    const response = await api.post(`/premium/boosted/${productId}/click`);
    return response.data;
  },
  
  // Track ad impression
  async trackAdImpression(productId) {
    const response = await api.post(`/premium/boosted/${productId}/impression`);
    return response.data;
  },
  
  // Get premium features list
  async getPremiumFeatures() {
    const response = await api.get('/premium/features');
    return response.data;
  },
  
  // Upgrade plan
  async upgradePlan(newPlan) {
    const response = await api.post('/premium/upgrade', { plan: newPlan });
    return response.data;
  },
  
  // Boost a product (premium users)
  async boostProduct(productId) {
    const response = await api.post(`/premium/boost/${productId}`);
    return response.data;
  },
};