
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Crown,
  Check,
  TrendingUp,
  Star,
  Headphones,
  Zap,
  Award,
  CreditCard,
  Shield,
  Clock,
  Rocket,
  Sparkles,
  Gem,
  ShoppingBag,
  BarChart3,
  Settings,
  ChevronRight,
  Calendar,
  Percent,
  Users,
  MessageCircle,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import { premiumService } from '../../services/premium';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const UserPremium = () => {
  const { user, updateUser } = useAuthStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const [plans, setPlans] = useState({
    basic: {
      plan_key: 'basic',
      key: 'basic',
      name: 'Basic',
      price: 5000,
      duration_days: 30,
      boost_multiplier: 2,
      features: [
        '2x product view boost',
        'Priority support',
        'Featured in category',
      ],
    },

    standard: {
      plan_key: 'standard',
      key: 'standard',
      name: 'Standard',
      price: 15000,
      duration_days: 90,
      boost_multiplier: 5,
      features: [
        '5x product view boost',
        'Priority support',
        'Featured in category & search',
      ],
    },

    pro: {
      plan_key: 'pro',
      key: 'pro',
      name: 'Pro',
      price: 50000,
      duration_days: 365,
      boost_multiplier: 10,
      features: [
        '10x product view boost',
        '24/7 priority support',
        'Featured on homepage',
      ],
    },
  });

  const [currentSubscription, setCurrentSubscription] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [processing, setProcessing] = useState(false);

  const [activeTab, setActiveTab] = useState('plans');

  const [paymentVerifying, setPaymentVerifying] = useState(false);

  // ============================================================
  // LOAD PREMIUM DATA
  // ============================================================

  useEffect(() => {
    loadPremiumData();
  }, []);

  // ============================================================
  // CHECK PAYSTACK CALLBACK
  // ============================================================
  //
  // Paystack may return the user to this page with:
  //
  // ?reference=xxxxx
  //
  // We use the reference to activate the Premium subscription.
  //
  // ============================================================

  useEffect(() => {
    const reference =
      searchParams.get('reference') ||
      searchParams.get('trxref');

    if (!reference) {
      return;
    }

    handlePaymentCallback(reference);
  }, [searchParams]);

  // ============================================================
  // LOAD PREMIUM DATA
  // ============================================================

  const loadPremiumData = async () => {
    setLoading(true);

    try {
      const plansData = await premiumService.getPlans();

      console.log(
        'Plans data from backend:',
        plansData
      );

      // --------------------------------------------------------
      // Normalize backend response
      // --------------------------------------------------------

      if (plansData) {
        let normalizedPlans = {};

        if (Array.isArray(plansData.plans)) {
          plansData.plans.forEach((plan) => {
            if (!plan) return;

            const key =
              plan.plan_key ||
              plan.key;

            if (!key) return;

            normalizedPlans[key] = {
              ...plan,
              plan_key: key,
              key,
              price: Number(plan.price || 0),
              duration_days: Number(
                plan.duration_days || 30
              ),
              boost_multiplier: Number(
                plan.boost_multiplier || 1
              ),
              features: Array.isArray(plan.features)
                ? plan.features
                : [],
            };
          });
        }

        // ------------------------------------------------------
        // Backend also returns:
        //
        // basic: {...}
        // standard: {...}
        // pro: {...}
        //
        // ------------------------------------------------------

        ['basic', 'standard', 'pro'].forEach(
          (key) => {
            if (
              plansData[key] &&
              typeof plansData[key] === 'object'
            ) {
              normalizedPlans[key] = {
                ...plansData[key],
                plan_key:
                  plansData[key].plan_key ||
                  key,
                key,
                price: Number(
                  plansData[key].price || 0
                ),
                duration_days: Number(
                  plansData[key].duration_days ||
                    30
                ),
                boost_multiplier: Number(
                  plansData[key]
                    .boost_multiplier || 1
                ),
                features: Array.isArray(
                  plansData[key].features
                )
                  ? plansData[key].features
                  : [],
              };
            }
          }
        );

        if (
          Object.keys(normalizedPlans).length > 0
        ) {
          console.log(
            'Normalized plans:',
            normalizedPlans
          );

          setPlans(normalizedPlans);
        }
      }

      // --------------------------------------------------------
      // Load current subscription
      // --------------------------------------------------------

      const subscriptionData =
        await premiumService.getMySubscription();

      console.log(
        'Subscription data:',
        subscriptionData
      );

      setCurrentSubscription(
        subscriptionData || null
      );
    } catch (error) {
      console.error(
        'Failed to load premium data:',
        error
      );

      /*
       * Do not replace database prices when the API fails.
       * The fallback values are only used when there is no
       * usable backend response.
       */
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PAYMENT CALLBACK
  // ============================================================

  const handlePaymentCallback = async (
    paymentReference
  ) => {
    if (!paymentReference) {
      return;
    }

    if (paymentVerifying) {
      return;
    }

    setPaymentVerifying(true);
    setProcessing(true);

    try {
      console.log(
        'Paystack callback reference:',
        paymentReference
      );

      /*
       * The purchase endpoint already verifies the
       * transaction directly with Paystack before activating
       * Premium.
       *
       * Therefore we send the reference to purchasePremium.
       */

      const planFromUrl =
        searchParams.get('plan') || null;

      let planKey = planFromUrl;

      /*
       * If the plan was not returned in the URL, attempt to
       * get it from the Paystack reference.
       *
       * Example:
       * NEXOLEOLITE_PREMIUM_PRO_xxxxx
       */

      if (!planKey) {
        const match =
          String(paymentReference).match(
            /NEXOLEOLITE_PREMIUM_([A-Z]+)_/i
          );

        if (match?.[1]) {
          planKey = match[1].toLowerCase();
        }
      }

      /*
       * If we still don't know the plan, try each active plan
       * only as a fallback based on the payment reference.
       */

      if (!planKey) {
        throw new Error(
          'Unable to determine the Premium plan from the payment reference.'
        );
      }

      const result =
        await premiumService.purchasePremium(
          planKey,
          paymentReference
        );

      console.log(
        'Premium activation response:',
        result
      );

      toast.success(
        `Successfully subscribed to ${
          result?.plan_name ||
          result?.plan ||
          planKey
        } Premium!`
      );

      // --------------------------------------------------------
      // Update local auth state
      // --------------------------------------------------------

      updateUser({
        is_premium: true,
        premium_plan: result?.plan || planKey,
        premium_started_at:
          result?.started_at ||
          new Date().toISOString(),
        premium_expires_at:
          result?.expires_at || null,
      });

      // --------------------------------------------------------
      // Reload subscription information
      // --------------------------------------------------------

      await loadPremiumData();

      // --------------------------------------------------------
      // Remove Paystack query parameters from URL
      // --------------------------------------------------------

      setSearchParams({});
    } catch (error) {
      console.error(
        'Premium payment activation failed:',
        error
      );

      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message;

      toast.error(
        backendMessage ||
          'Payment could not be verified or Premium could not be activated.'
      );
    } finally {
      setPaymentVerifying(false);
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  // ============================================================
  // SUBSCRIBE
  // ============================================================
  //
  // NEW PAYMENT FLOW:
  //
  // User
  //   ↓
  // /payments/initialize-premium
  //   ↓
  // Backend reads PremiumPlan from database
  //   ↓
  // Paystack initializes payment
  //   ↓
  // authorization_url
  //   ↓
  // User pays on Paystack
  //   ↓
  // Paystack returns reference
  //   ↓
  // /premium/purchase
  //   ↓
  // Paystack verification
  //   ↓
  // Premium activated
  //
  // ============================================================

  const handleSubscribe = async (
    planKey,
    planData
  ) => {
    if (currentSubscription?.is_premium) {
      toast.error(
        'You already have an active premium subscription'
      );

      return;
    }

    // --------------------------------------------------------
    // Validate user
    // --------------------------------------------------------

    if (!user?.email) {
      toast.error(
        'Your account has no email address'
      );

      return;
    }

    // --------------------------------------------------------
    // Validate plan
    // --------------------------------------------------------

    if (!planKey || !planData) {
      toast.error(
        'Invalid Premium plan selected'
      );

      return;
    }

    // --------------------------------------------------------
    // IMPORTANT:
    // Use the price currently returned by the database.
    // Admin changes therefore automatically apply.
    // --------------------------------------------------------

    const amount = Number(
      planData?.price || 0
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error(
        'Invalid Premium plan price'
      );

      return;
    }

    setSelectedPlan(planKey);
    setProcessing(true);

    try {
      console.log(
        'Initializing Premium payment:',
        {
          plan: planKey,
          amount,
          email: user.email,
        }
      );

      // ------------------------------------------------------
      // CALL OUR BACKEND
      // ------------------------------------------------------

      const payment =
        await premiumService.initializePayment(
          planKey,
          amount,
          user.email
        );

      console.log(
        'Premium payment initialization response:',
        payment
      );

      // ------------------------------------------------------
      // Validate backend response
      // ------------------------------------------------------

      if (!payment?.status) {
        throw new Error(
          payment?.message ||
            'Payment initialization failed'
        );
      }

      const authorizationUrl =
        payment?.authorization_url;

      const reference =
        payment?.reference;

      if (!authorizationUrl) {
        throw new Error(
          'Paystack did not return an authorization URL.'
        );
      }

      if (!reference) {
        throw new Error(
          'Paystack did not return a payment reference.'
        );
      }

      /*
       * Save the selected plan in sessionStorage.
       *
       * This helps us recover the plan after Paystack redirects
       * back to the application.
       */

      try {
        sessionStorage.setItem(
          'nexoleolite_premium_payment',
          JSON.stringify({
            plan: planKey,
            plan_name: planData.name,
            amount,
            reference,
          })
        );
      } catch (storageError) {
        console.warn(
          'Unable to save payment session:',
          storageError
        );
      }

      // ------------------------------------------------------
      // Redirect to Paystack hosted checkout
      // ------------------------------------------------------

      window.location.href = authorizationUrl;
    } catch (error) {
      console.error(
        'Premium payment initialization failed:',
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Unable to initialize Premium payment';

      toast.error(message);

      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  // ============================================================
  // CANCEL SUBSCRIPTION
  // ============================================================

  const handleCancelSubscription =
    async () => {
      const confirmed = window.confirm(
        'Are you sure you want to cancel your premium subscription?'
      );

      if (!confirmed) {
        return;
      }

      try {
        setProcessing(true);

        await premiumService.cancelSubscription();

        toast.success(
          'Premium subscription cancelled'
        );

        await loadPremiumData();

        updateUser({
          is_premium: false,
          premium_plan: null,
          premium_started_at: null,
          premium_expires_at: null,
        });
      } catch (error) {
        console.error(
          'Failed to cancel subscription:',
          error
        );

        toast.error(
          error?.response?.data?.detail ||
            'Failed to cancel subscription'
        );
      } finally {
        setProcessing(false);
      }
    };

  // ============================================================
  // FORMAT PRICE
  // ============================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat(
      'en-NG',
      {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(Number(price || 0));
  };

  // ============================================================
  // PLAN COLOR
  // ============================================================

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'basic':
        return 'from-blue-500 to-blue-600';

      case 'standard':
        return 'from-purple-500 to-purple-600';

      case 'pro':
        return 'from-yellow-500 to-orange-500';

      default:
        return 'from-brand-orange to-orange-600';
    }
  };

  // ============================================================
  // PLAN ICON
  // ============================================================

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'basic':
        return (
          <Zap className="h-12 w-12 text-blue-500" />
        );

      case 'standard':
        return (
          <Rocket className="h-12 w-12 text-purple-500" />
        );

      case 'pro':
        return (
          <Gem className="h-12 w-12 text-yellow-500" />
        );

      default:
        return (
          <Crown className="h-12 w-12 text-brand-orange" />
        );
    }
  };

  // ============================================================
  // PAYMENT VERIFICATION SCREEN
  // ============================================================

  if (paymentVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verifying Your Payment
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Please wait while Nexoleolite confirms
            your Paystack payment and activates your
            Premium subscription.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure payment verification</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  // ============================================================
  // PLANS ARRAY
  // ============================================================

  const plansArray = Object.entries(
    plans || {}
  )
    .map(([key, value]) => ({
      key,
      ...value,
    }))
    .filter(
      (plan) =>
        plan?.is_active !== false
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* TABS */}
        {/* ================================================== */}

        <div className="flex justify-center space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() =>
              setActiveTab('plans')
            }
            className={`px-6 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'plans'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Premium Plans
          </button>

          <button
            onClick={() =>
              setActiveTab('my-premium')
            }
            className={`px-6 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'my-premium'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Premium
          </button>

          <button
            onClick={() =>
              setActiveTab('benefits')
            }
            className={`px-6 py-2 font-medium transition whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'text-brand-orange border-b-2 border-brand-orange'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Benefits
          </button>
        </div>

        {/* ================================================== */}
        {/* PLANS TAB */}
        {/* ================================================== */}

        {activeTab === 'plans' && (
          <>
            {/* ============================================== */}
            {/* CURRENT PREMIUM STATUS */}
            {/* ============================================== */}

            {currentSubscription?.is_premium && (
              <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">

                  <div className="flex items-center space-x-4">
                    <Crown className="h-12 w-12" />

                    <div>
                      <h2 className="text-xl font-bold">
                        You're a Premium Member! 🎉
                      </h2>

                      <p className="text-white/90 mt-1">
                        Active{' '}
                        <span className="font-semibold capitalize">
                          {
                            currentSubscription
                              .subscription
                              ?.plan
                          }
                        </span>{' '}
                        plan
                      </p>

                      <p className="text-sm text-white/80 mt-1">
                        Expires in{' '}
                        {
                          currentSubscription
                            .subscription
                            ?.days_left
                        }{' '}
                        days
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setActiveTab(
                        'my-premium'
                      )
                    }
                    className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                  >
                    Manage Premium
                  </button>
                </div>
              </div>
            )}

            {/* ============================================== */}
            {/* PREMIUM PLANS GRID */}
            {/* ============================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {plansArray.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    plan.key === 'pro'
                      ? 'ring-2 ring-yellow-400'
                      : ''
                  }`}
                >

                  {/* MOST POPULAR */}

                  {plan.key === 'pro' && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {/* PLAN HEADER */}

                  <div
                    className={`bg-gradient-to-r ${getPlanColor(
                      plan.key
                    )} p-6 text-white text-center`}
                  >
                    <div className="flex justify-center mb-4">
                      {getPlanIcon(
                        plan.key
                      )}
                    </div>

                    <h3 className="text-2xl font-bold capitalize">
                      {plan.name}
                    </h3>

                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {formatPrice(
                          plan.price
                        )}
                      </span>

                      <span className="text-white/80">
                        /{plan.duration_days} days
                      </span>
                    </div>

                    <p className="text-white/80 text-sm mt-2">
                      Just{' '}
                      {formatPrice(
                        Math.ceil(
                          Number(plan.price || 0) /
                            Number(
                              plan.duration_days ||
                                1
                            )
                        )
                      )}
                      /day
                    </p>
                  </div>

                  {/* PLAN BODY */}

                  <div className="p-6">

                    <ul className="space-y-3 mb-6">
                      {Array.isArray(
                        plan.features
                      ) &&
                        plan.features.map(
                          (
                            feature,
                            idx
                          ) => (
                            <li
                              key={idx}
                              className="flex items-center space-x-3 text-gray-600 dark:text-gray-300"
                            >
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />

                              <span className="text-sm">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                    </ul>

                    {/* SUBSCRIBE BUTTON */}

                    <button
                      onClick={() =>
                        handleSubscribe(
                          plan.key,
                          plan
                        )
                      }
                      disabled={
                        processing ||
                        currentSubscription?.is_premium
                      }
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        currentSubscription?.is_premium
                          ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                          : processing &&
                            selectedPlan ===
                              plan.key
                          ? 'bg-gray-400 cursor-wait text-white'
                          : `bg-gradient-to-r ${getPlanColor(
                              plan.key
                            )} text-white hover:shadow-lg transform hover:scale-105`
                      }`}
                    >

                      {processing &&
                      selectedPlan ===
                        plan.key ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />

                          <span>
                            Connecting to Paystack...
                          </span>
                        </>
                      ) : currentSubscription?.is_premium ? (
                        <>
                          <Check className="h-5 w-5" />

                          <span>
                            Already Premium
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />

                          <span>
                            Subscribe Now
                          </span>
                        </>
                      )}

                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ============================================== */}
            {/* NO PLANS */}
            {/* ============================================== */}

            {plansArray.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <p className="text-gray-500">
                  No premium plans available at the moment.
                </p>

                <button
                  onClick={
                    loadPremiumData
                  }
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg"
                >
                  <RefreshCw className="h-4 w-4" />

                  Retry
                </button>
              </div>
            )}
          </>
        )}

        {/* ================================================== */}
        {/* MY PREMIUM TAB */}
        {/* ================================================== */}

        {activeTab === 'my-premium' && (
          <div className="max-w-3xl mx-auto">

            {currentSubscription?.is_premium ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                <div
                  className={`bg-gradient-to-r ${getPlanColor(
                    currentSubscription
                      .subscription
                      ?.plan
                  )} p-6 text-white`}
                >
                  <div className="flex items-center justify-between">

                    <div>
                      <h2 className="text-2xl font-bold">
                        Your Premium Status
                      </h2>

                      <p className="text-white/90 mt-1">
                        You're enjoying premium benefits!
                      </p>
                    </div>

                    {getPlanIcon(
                      currentSubscription
                        .subscription
                        ?.plan
                    )}
                  </div>
                </div>

                <div className="p-6">

                  <div className="grid grid-cols-2 gap-6 mb-6">

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Plan
                      </p>

                      <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {
                          currentSubscription
                            .subscription
                            ?.plan
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Days Remaining
                      </p>

                      <p className="text-2xl font-bold text-green-600">
                        {
                          currentSubscription
                            .subscription
                            ?.days_left
                        }{' '}
                        days
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT INFORMATION */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-brand-orange" />

                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Started
                          </p>

                          <p className="font-medium text-gray-900 dark:text-white">
                            {currentSubscription
                              .subscription
                              ?.started_at
                              ? new Date(
                                  currentSubscription
                                    .subscription
                                    .started_at
                                ).toLocaleDateString(
                                  'en-NG'
                                )
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-brand-orange" />

                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Expires
                          </p>

                          <p className="font-medium text-gray-900 dark:text-white">
                            {currentSubscription
                              .subscription
                              ?.expires_at
                              ? new Date(
                                  currentSubscription
                                    .subscription
                                    .expires_at
                                ).toLocaleDateString(
                                  'en-NG'
                                )
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={
                      handleCancelSubscription
                    }
                    disabled={processing}
                    className="w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                  >
                    {processing ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />

                        Processing...
                      </span>
                    ) : (
                      'Cancel Premium Subscription'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">

                <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Active Premium Subscription
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose a plan to unlock premium benefits
                </p>

                <button
                  onClick={() =>
                    setActiveTab('plans')
                  }
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>
                    View Plans
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* BENEFITS TAB */}
        {/* ================================================== */}

        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Increased Visibility */}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">

              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Increased Visibility
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get increased visibility on your products with Premium boosting.
              </p>
            </div>

            {/* Premium Badge */}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">

              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Badge
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Stand out with a verified Premium badge.
              </p>
            </div>

            {/* Priority Support */}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">

              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Priority Support
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get faster resolution for your issues.
              </p>
            </div>

            {/* Featured Listings */}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">

              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-yellow-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Featured Listings
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get your products more visibility through featured placement.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default UserPremium;