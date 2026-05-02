import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Check, TrendingUp, Star, Headphones, Zap, Award, 
  CreditCard, Shield, Clock, Rocket, Sparkles, Gem, 
  ShoppingBag, BarChart3, Settings, ChevronRight,
  Calendar, Percent, Users, MessageCircle, Eye, Loader2
} from 'lucide-react';
import { premiumService } from '../../services/premium';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const UserPremium = () => {
  const { user, updateUser } = useAuthStore();
  const [plans, setPlans] = useState({
    basic: {
      name: "Basic",
      price: 5000,
      duration_days: 30,
      features: ["2x product view boost", "Priority support", "Featured in category"]
    },
    standard: {
      name: "Standard",
      price: 15000,
      duration_days: 90,
      features: ["5x product view boost", "Priority support", "Featured in category & search"]
    },
    pro: {
      name: "Pro",
      price: 50000,
      duration_days: 365,
      features: ["10x product view boost", "24/7 priority support", "Featured on homepage"]
    }
  });
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  useEffect(() => {
    loadPremiumData();
  }, []);

  const loadPremiumData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, if fails use default plans
      const plansData = await premiumService.getPlans();
      console.log('Plans data:', plansData);
      if (plansData && Object.keys(plansData).length > 0) {
        setPlans(plansData);
      }
      
      const subscriptionData = await premiumService.getMySubscription();
      console.log('Subscription data:', subscriptionData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Failed to load premium data:', error);
      // Keep default plans
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planKey, planData) => {
    if (currentSubscription?.is_premium) {
      toast.error('You already have an active premium subscription');
      return;
    }
    
    setSelectedPlan(planKey);
    setProcessing(true);
    
    try {
      // Simulate payment for demo
      toast.loading('Processing your subscription...', { duration: 1500 });
      
      setTimeout(async () => {
        try {
          await premiumService.purchasePremium(planKey, 'demo_ref_' + Date.now());
          toast.success(`Successfully subscribed to ${planData.name} plan!`);
          await loadPremiumData();
          updateUser({ is_premium: true, premium_plan: planKey });
        } catch (err) {
          toast.error('Subscription failed. Please try again.');
        } finally {
          setProcessing(false);
          setSelectedPlan(null);
        }
      }, 1500);
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Failed to process subscription');
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your premium subscription?')) return;
    
    try {
      await premiumService.cancelSubscription();
      toast.success('Premium subscription cancelled');
      await loadPremiumData();
      updateUser({ is_premium: false, premium_plan: null });
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'standard': return 'from-purple-500 to-purple-600';
      case 'pro': return 'from-yellow-500 to-orange-500';
      default: return 'from-brand-orange to-orange-600';
    }
  };

  const getPlanIcon = (plan) => {
    switch(plan) {
      case 'basic': return <Zap className="h-12 w-12 text-blue-500" />;
      case 'standard': return <Rocket className="h-12 w-12 text-purple-500" />;
      case 'pro': return <Gem className="h-12 w-12 text-yellow-500" />;
      default: return <Crown className="h-12 w-12 text-brand-orange" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  // Get plans as array for rendering
  const plansArray = Object.entries(plans).map(([key, value]) => ({
    key,
    ...value
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Premium Membership
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Unlock premium features and boost your sales
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-2 font-medium transition ${
              activeTab === 'plans' 
                ? 'text-brand-orange border-b-2 border-brand-orange' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Premium Plans
          </button>
          <button
            onClick={() => setActiveTab('my-premium')}
            className={`px-6 py-2 font-medium transition ${
              activeTab === 'my-premium' 
                ? 'text-brand-orange border-b-2 border-brand-orange' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Premium
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-6 py-2 font-medium transition ${
              activeTab === 'benefits' 
                ? 'text-brand-orange border-b-2 border-brand-orange' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Benefits
          </button>
        </div>

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <>
            {/* Current Premium Status */}
            {currentSubscription?.is_premium && (
              <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <Crown className="h-12 w-12" />
                    <div>
                      <h2 className="text-xl font-bold">You're a Premium Member! 🎉</h2>
                      <p className="text-white/90 mt-1">
                        Active <span className="font-semibold capitalize">{currentSubscription.subscription?.plan}</span> plan
                      </p>
                      <p className="text-sm text-white/80 mt-1">
                        Expires in {currentSubscription.subscription?.days_left} days
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('my-premium')}
                    className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                  >
                    Manage Premium
                  </button>
                </div>
              </div>
            )}

            {/* Premium Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansArray.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    plan.key === 'pro' ? 'ring-2 ring-yellow-400' : ''
                  }`}
                >
                  {plan.key === 'pro' && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className={`bg-gradient-to-r ${getPlanColor(plan.key)} p-6 text-white text-center`}>
                    <div className="flex justify-center mb-4">
                      {getPlanIcon(plan.key)}
                    </div>
                    <h3 className="text-2xl font-bold capitalize">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-white/80">/{plan.duration_days} days</span>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                      Just {formatPrice(Math.ceil(plan.price / plan.duration_days))}/day
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSubscribe(plan.key, plan)}
                      disabled={processing && selectedPlan === plan.key || currentSubscription?.is_premium}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        currentSubscription?.is_premium
                          ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                          : `bg-gradient-to-r ${getPlanColor(plan.key)} text-white hover:shadow-lg transform hover:scale-105`
                      }`}
                    >
                      {processing && selectedPlan === plan.key ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : currentSubscription?.is_premium ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Already Premium</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>Subscribe Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fallback if no plans */}
            {plansArray.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No premium plans available at the moment.</p>
              </div>
            )}
          </>
        )}

        {/* My Premium Tab */}
        {activeTab === 'my-premium' && (
          <div className="max-w-3xl mx-auto">
            {currentSubscription?.is_premium ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${getPlanColor(currentSubscription.subscription?.plan)} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Your Premium Status</h2>
                      <p className="text-white/90 mt-1">You're enjoying premium benefits!</p>
                    </div>
                    {getPlanIcon(currentSubscription.subscription?.plan)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {currentSubscription.subscription?.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</p>
                      <p className="text-2xl font-bold text-green-600">
                        {currentSubscription.subscription?.days_left} days
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCancelSubscription}
                    className="w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Cancel Premium Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Active Premium Subscription</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Choose a plan to unlock premium benefits</p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>View Plans</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Increased Visibility</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Get up to 10x more views on your products</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Premium Badge</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Stand out with verified premium badge</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Priority Support</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Get faster resolution for your issues</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Featured Listings</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Your products featured on homepage</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPremium;