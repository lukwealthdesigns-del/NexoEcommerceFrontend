
// import api from "./api";

// export const premiumService = {
//   // Get all active premium plans for users
//   async getPlans() {
//     const response = await api.get("/premium/plans");
//     return response.data;
//   },

//   // Get current user's premium subscription
//   async getMySubscription() {
//     const response = await api.get("/premium/my-subscription");
//     return response.data;
//   },

//   // Get user's boost statistics
//   async getBoostStats() {
//     const response = await api.get("/premium/boost-stats");
//     return response.data;
//   },

//   // Initialize premium payment
//   async initializePayment(plan, amount, email) {
//     const response = await api.post("/payments/initialize-premium", {
//       plan,
//       amount,
//       email,
//     });

//     return response.data;
//   },

//   // Complete premium purchase after Paystack payment
//   async purchasePremium(plan, paymentReference) {
//     const response = await api.post("/premium/purchase", {
//       plan,
//       payment_reference: paymentReference,
//     });

//     return response.data;
//   },

//   // Cancel current subscription
//   async cancelSubscription() {
//     const response = await api.post("/premium/cancel");
//     return response.data;
//   },

//   // Get boosted advertisements
//   async getBoostedProducts(params = {}) {
//     const response = await api.get("/premium/api/boosted-ads", {
//       params,
//     });

//     return response.data;
//   },

//   // Track advertisement click
//   async trackAdClick(productId) {
//     const response = await api.post(
//       `/premium/boosted/${productId}/click`
//     );

//     return response.data;
//   },

//   // Track advertisement impression
//   async trackAdImpression(productId) {
//     const response = await api.post(
//       `/premium/boosted/${productId}/impression`
//     );

//     return response.data;
//   },

//   // Get premium features
//   async getPremiumFeatures() {
//     const response = await api.get("/premium/features");
//     return response.data;
//   },

//   // Upgrade premium plan
//   async upgradePlan(newPlan) {
//     const response = await api.post("/premium/upgrade", {
//       plan: newPlan,
//     });

//     return response.data;
//   },

//   // Boost a product
//   async boostProduct(productId) {
//     const response = await api.post(
//       `/premium/boost/${productId}`
//     );

//     return response.data;
//   },

//   // Remove product boost
//   async unboostProduct(productId) {
//     const response = await api.delete(
//       `/premium/unboost/${productId}`
//     );

//     return response.data;
//   },

//   // Get user's boosted products
//   async getMyBoostedProducts() {
//     const response = await api.get(
//       "/premium/my-boosted-products"
//     );

//     return response.data;
//   },
// };

// import api from "./api";

// export const premiumService = {
//   // Get active Premium plans for customers
//   async getPlans() {
//     const response = await api.get("/premium/plans");
//     return response.data;
//   },

//   // Get current user's Premium subscription
//   async getMySubscription() {
//     const response = await api.get("/premium/my-subscription");
//     return response.data;
//   },

//   // Get Premium boost statistics
//   async getBoostStats() {
//     const response = await api.get("/premium/boost-stats");
//     return response.data;
//   },

//   // Initialize Premium payment
//   async initializePayment(plan, amount, email) {
//     const response = await api.post("/payments/initialize-premium", {
//       plan,
//       amount,
//       email,
//     });

//     return response.data;
//   },

//   // Activate Premium after successful Paystack payment
//   async purchasePremium(plan, paymentReference) {
//     const response = await api.post("/premium/purchase", {
//       plan,
//       payment_reference: paymentReference,
//     });

//     return response.data;
//   },

//   // Cancel current Premium subscription
//   async cancelSubscription() {
//     const response = await api.post("/premium/cancel");
//     return response.data;
//   },

//   // Get boosted advertisements
//   async getBoostedProducts(params = {}) {
//     const response = await api.get("/premium/api/boosted-ads", {
//       params,
//     });

//     return response.data;
//   },

//   // Track advertisement click
//   async trackAdClick(productId) {
//     const response = await api.post(
//       `/premium/boosted/${productId}/click`
//     );

//     return response.data;
//   },

//   // Track advertisement impression
//   async trackAdImpression(productId) {
//     const response = await api.post(
//       `/premium/boosted/${productId}/impression`
//     );

//     return response.data;
//   },

//   // Get Premium features
//   async getPremiumFeatures() {
//     const response = await api.get("/premium/features");
//     return response.data;
//   },

//   // Upgrade Premium plan
//   async upgradePlan(newPlan) {
//     const response = await api.post("/premium/upgrade", {
//       plan: newPlan,
//     });

//     return response.data;
//   },

//   // Boost a product
//   async boostProduct(productId) {
//     const response = await api.post(
//       `/premium/boost/${productId}`
//     );

//     return response.data;
//   },

//   // Remove product boost
//   async unboostProduct(productId) {
//     const response = await api.delete(
//       `/premium/unboost/${productId}`
//     );

//     return response.data;
//   },

//   // Get current user's boosted products
//   async getMyBoostedProducts() {
//     const response = await api.get(
//       "/premium/my-boosted-products"
//     );

//     return response.data;
//   },
// };
import api from "./api";

export const premiumService = {
  // ==========================================
  // GET PREMIUM PLANS
  // ==========================================
  async getPlans() {
    const response = await api.get("/premium/plans");
    return response.data;
  },

  // ==========================================
  // GET CURRENT USER SUBSCRIPTION
  // ==========================================
  async getMySubscription() {
    const response = await api.get("/premium/my-subscription");
    return response.data;
  },

  // ==========================================
  // GET PREMIUM BOOST STATISTICS
  // ==========================================
  async getBoostStats() {
    const response = await api.get("/premium/boost-stats");
    return response.data;
  },

  // ==========================================
  // INITIALIZE PREMIUM PAYMENT
  // ==========================================
  async initializePayment(plan, amount, email) {
    const response = await api.post("/payments/initialize-premium", {
      plan,
      amount,
      email,
    });

    return response.data;
  },

  // ==========================================
  // ACTIVATE PREMIUM AFTER PAYMENT
  // ==========================================
  async purchasePremium(plan, paymentReference) {
    const response = await api.post("/premium/purchase", {
      plan,
      payment_reference: paymentReference,
    });

    return response.data;
  },

  // ==========================================
  // CANCEL PREMIUM
  // ==========================================
  async cancelSubscription() {
    const response = await api.post("/premium/cancel");
    return response.data;
  },

  // ==========================================
  // GET BOOSTED ADVERTISEMENTS
  // ==========================================
  async getBoostedProducts(params = {}) {
    const response = await api.get("/premium/api/boosted-ads", {
      params,
    });

    return response.data;
  },

  // ==========================================
  // TRACK AD CLICK
  // ==========================================
  async trackAdClick(productId) {
    const response = await api.post(
      `/premium/boosted/${productId}/click`
    );

    return response.data;
  },

  // ==========================================
  // TRACK AD IMPRESSION
  // ==========================================
  async trackAdImpression(productId) {
    const response = await api.post(
      `/premium/boosted/${productId}/impression`
    );

    return response.data;
  },

  // ==========================================
  // GET PREMIUM FEATURES
  // ==========================================
  async getPremiumFeatures() {
    const response = await api.get("/premium/features");
    return response.data;
  },

  // ==========================================
  // UPGRADE PREMIUM PLAN
  // ==========================================
  async upgradePlan(newPlan) {
    const response = await api.post("/premium/upgrade", {
      plan: newPlan,
    });

    return response.data;
  },

  // ==========================================
  // BOOST PRODUCT
  // ==========================================
  async boostProduct(productId) {
    const response = await api.post(
      `/premium/boost/${productId}`
    );

    return response.data;
  },

  // ==========================================
  // REMOVE PRODUCT BOOST
  // ==========================================
  async unboostProduct(productId) {
    const response = await api.delete(
      `/premium/unboost/${productId}`
    );

    return response.data;
  },

  // ==========================================
  // GET MY BOOSTED PRODUCTS
  // ==========================================
  async getMyBoostedProducts() {
    const response = await api.get(
      "/premium/my-boosted-products"
    );

    return response.data;
  },
};