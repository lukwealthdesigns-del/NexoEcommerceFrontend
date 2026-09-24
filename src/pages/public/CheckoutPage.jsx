
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCartStore } from '../../store/cartStore';
// import { useAuthStore } from '../../store/authStore';
// import { formatCurrency } from '../../utils/formatters';
// import { PaystackButton } from 'react-paystack';
// import { Truck, ChevronRight, Lock, ArrowLeft, ShoppingCart, CreditCard, Banknote, Wallet } from 'lucide-react';
// import toast from 'react-hot-toast';

// const CheckoutPage = () => {
//   const { items, totalPrice, clearCart, fetchCart } = useCartStore();
//   const { user } = useAuthStore();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [selectedPayment, setSelectedPayment] = useState('card');
//   const [formData, setFormData] = useState({
//     full_name: user?.first_name + ' ' + user?.last_name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: '',
//     city: '',
//     state: '',
//     zip_code: '',
//   });

//   useEffect(() => {
//     const loadCart = async () => {
//       setLoading(true);
//       await fetchCart();
//       setLoading(false);
//     };
//     loadCart();
//   }, [fetchCart]);

//   useEffect(() => {
//     if (!loading && items.length === 0) {
//       navigate('/cart');
//     }
//   }, [items, loading, navigate]);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const shippingFee = totalPrice > 50000 ? 0 : 2000;
//   const tax = totalPrice * 0.075;
//   const grandTotal = totalPrice + shippingFee + tax;
  
//   // Amount in kobo (Paystack uses smallest currency unit - 1 Naira = 100 kobo)
//   const amountInKobo = Math.round(grandTotal * 100);

//   // Generate unique reference for each transaction
//   const generateReference = () => {
//     return `NEXO-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
//   };

//   // Paystack config
//   const paystackConfig = {
//     reference: generateReference(),
//     email: formData.email,
//     amount: amountInKobo,
//     publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx',
//     currency: 'NGN',
//     metadata: {
//       custom_fields: [
//         {
//           display_name: 'Customer Name',
//           variable_name: 'customer_name',
//           value: formData.full_name,
//         },
//         {
//           display_name: 'Phone Number',
//           variable_name: 'customer_phone',
//           value: formData.phone,
//         },
//         {
//           display_name: 'Shipping Address',
//           variable_name: 'shipping_address',
//           value: `${formData.address}, ${formData.city}, ${formData.state}`,
//         },
//       ],
//     },
//     firstname: formData.full_name.split(' ')[0] || '',
//     lastname: formData.full_name.split(' ').slice(1).join(' ') || '',
//   };

//   // Handle successful payment
//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);
    
//     try {
//       // Create order after successful payment
//       const orderData = {
//         id: 'ORD-' + Date.now(),
//         items: items,
//         subtotal: totalPrice,
//         shipping_fee: shippingFee,
//         tax: tax,
//         total_amount: grandTotal,
//         shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`,
//         customer_name: formData.full_name,
//         customer_email: formData.email,
//         customer_phone: formData.phone,
//         payment_method: selectedPayment,
//         transaction_id: response.reference || response.transactionRef,
//         payment_status: 'paid',
//         status: 'processing',
//         created_at: new Date().toISOString(),
//         estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//       };
      
//       // Save order to localStorage (in real app, this would be an API call)
//       const orders = JSON.parse(localStorage.getItem('orders') || '[]');
//       orders.push(orderData);
//       localStorage.setItem('orders', JSON.stringify(orders));
      
//       // Clear cart
//       await clearCart();
      
//       toast.success('Payment successful! Order placed successfully!');
      
//       // Navigate to order confirmation
//       navigate(`/order-confirmation/${orderData.id}`);
      
//     } catch (error) {
//       console.error('Order creation error:', error);
//       toast.error('Payment successful but failed to create order. Please contact support.');
//     }
//   };

//   // Handle payment modal close
//   const handlePaymentClose = () => {
//     toast.info('Payment was cancelled');
//   };

//   const paymentMethods = [
//     { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, Verve' },
//     { id: 'bank_transfer', name: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer' },
//     { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Use your NexoLeolite wallet' },
//   ];

//   // Validate form before showing Paystack
//   const isFormValid = () => {
//     return formData.full_name && formData.email && formData.phone && formData.address && formData.city && formData.state;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
//       </div>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-500 mb-4">Your cart is empty</p>
//           <Link to="/shop" className="bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange mb-6">
//           <ArrowLeft className="h-5 w-5" />
//           Back to Cart
//         </Link>

//         <div className="flex items-center space-x-2 mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
//           <ChevronRight className="h-5 w-5 text-gray-400" />
//           <span className="text-gray-500 dark:text-gray-400">Complete your order</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Shipping Information */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex items-center space-x-2 mb-4">
//                 <Truck className="h-5 w-5 text-brand-orange" />
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
//               </div>
              
//               <form className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="full_name"
//                       value={formData.full_name}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Email *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Street Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                     placeholder="House number and street name"
//                     required
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       ZIP Code
//                     </label>
//                     <input
//                       type="text"
//                       name="zip_code"
//                       value={formData.zip_code}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
//                     />
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Payment Method */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex items-center space-x-2 mb-4">
//                 <CreditCard className="h-5 w-5 text-brand-orange" />
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
//               </div>
              
//               <div className="space-y-3">
//                 {paymentMethods.map((method) => {
//                   const Icon = method.icon;
//                   return (
//                     <label
//                       key={method.id}
//                       className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
//                         selectedPayment === method.id
//                           ? 'border-brand-orange bg-brand-orange/5'
//                           : 'border-gray-200 dark:border-gray-700 hover:border-brand-orange'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <input
//                           type="radio"
//                           name="payment_method"
//                           value={method.id}
//                           checked={selectedPayment === method.id}
//                           onChange={(e) => setSelectedPayment(e.target.value)}
//                           className="h-4 w-4 text-brand-orange focus:ring-brand-orange"
//                         />
//                         <Icon className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <span className="text-gray-900 dark:text-white block">{method.name}</span>
//                           <span className="text-xs text-gray-500">{method.description}</span>
//                         </div>
//                       </div>
//                       {selectedPayment === method.id && (
//                         <div className="text-brand-orange">✓</div>
//                       )}
//                     </label>
//                   );
//                 })}
//               </div>
              
//               <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
//                 <div className="flex items-start space-x-2">
//                   <Lock className="h-4 w-4 text-blue-500 mt-0.5" />
//                   <p className="text-xs text-blue-600 dark:text-blue-400">
//                     Your payment information is secure. We never store your card details.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
//               <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
//                 {items.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
//                       <ShoppingCart className="h-6 w-6 text-gray-400" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                         {item.title}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                       {formatCurrency((item.product_price || item.price) * item.quantity)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
//                   <span className="text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Shipping</span>
//                   <span className="text-gray-900 dark:text-white">
//                     {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 dark:text-gray-400">Tax (7.5%)</span>
//                   <span className="text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
//                 </div>
//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
//                   <div className="flex justify-between">
//                     <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
//                     <span className="text-2xl font-bold text-brand-orange">{formatCurrency(grandTotal)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Paystack Payment Button */}
//               {selectedPayment === 'card' && (
//                 <div className="mt-6">
//                   <PaystackButton
//                     {...paystackConfig}
//                     onSuccess={handlePaymentSuccess}
//                     onClose={handlePaymentClose}
//                     className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
//                   />
//                   {!isFormValid() && (
//                     <p className="text-xs text-red-500 text-center mt-2">
//                       Please fill in all shipping details before payment
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Other payment methods */}
//               {selectedPayment !== 'card' && (
//                 <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
//                   <p className="text-gray-600 dark:text-gray-300 text-sm">
//                     {selectedPayment === 'bank_transfer' 
//                       ? 'Bank Transfer instructions will be sent to your email after order confirmation.'
//                       : 'Coming soon! Please select Card payment for now.'}
//                   </p>
//                 </div>
//               )}
              
//               <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
//                 By placing your order, you agree to our Terms of Service and Privacy Policy
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatters";
import api from "../../services/api";


const PENDING_CHECKOUT_KEY =
  "nexoleolite_pending_checkout";


const CheckoutPage = () => {
  const {
    items,
    totalPrice,
    clearCart,
    fetchCart,
  } = useCartStore();

  const { user } = useAuthStore();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState("card");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });


  // ============================================================
  // LOAD CART
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      try {
        setLoading(true);
        await fetchCart();
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        toast.error(
          "Unable to load your cart."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, [fetchCart]);


  // ============================================================
  // LOAD USER INFORMATION
  // ============================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const firstName =
      user.first_name || "";

    const lastName =
      user.last_name || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    setFormData((previous) => ({
      ...previous,

      full_name:
        previous.full_name ||
        fullName,

      email:
        previous.email ||
        user.email ||
        "",

      phone:
        previous.phone ||
        user.phone ||
        "",
    }));
  }, [user]);


  // ============================================================
  // EMPTY CART
  // ============================================================

  useEffect(() => {
    if (
      !loading &&
      items.length === 0 &&
      !searchParams.get("reference") &&
      !searchParams.get("trxref")
    ) {
      navigate("/cart");
    }
  }, [
    items,
    loading,
    navigate,
    searchParams,
  ]);


  // ============================================================
  // NORMALIZE CART ITEMS
  // ============================================================

  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      const product =
        item.product ||
        item.product_data ||
        null;

      const productId =
        item.product_id ||
        item.id ||
        product?.id ||
        "";

      const title =
        item.product_title ||
        item.title ||
        product?.title ||
        "Product";

      const image =
        item.product_image ||
        item.image ||
        product?.images?.[0] ||
        "";

      const price =
        Number(
          item.product_price ??
          item.price ??
          product?.price ??
          0
        );

      const quantity =
        Number(item.quantity || 1);

      return {
        product_id: String(productId),
        title,
        image,
        price,
        quantity,
        total:
          price * quantity,
      };
    });
  }, [items]);


  // ============================================================
  // DISPLAY TOTALS
  // ============================================================

  const displaySubtotal = useMemo(() => {
    const calculated = normalizedItems.reduce(
      (sum, item) =>
        sum + item.total,
      0
    );

    if (calculated > 0) {
      return calculated;
    }

    return Number(totalPrice || 0);
  }, [
    normalizedItems,
    totalPrice,
  ]);


  // The backend uses ₦1,500.
  const shippingFee = 1500;

  const displayTotal =
    displaySubtotal +
    shippingFee;


  // ============================================================
  // FORM HANDLER
  // ============================================================

  const handleInputChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ============================================================
  // FORM VALIDATION
  // ============================================================

  const validateForm = () => {
    const requiredFields = [
      {
        key: "full_name",
        label: "Full name",
      },
      {
        key: "email",
        label: "Email address",
      },
      {
        key: "phone",
        label: "Phone number",
      },
      {
        key: "address",
        label: "Address",
      },
      {
        key: "city",
        label: "City",
      },
      {
        key: "state",
        label: "State",
      },
    ];

    for (const field of requiredFields) {
      if (
        !String(
          formData[field.key] || ""
        ).trim()
      ) {
        toast.error(
          `${field.label} is required.`
        );

        return false;
      }
    }

    if (
      !formData.email.includes("@")
    ) {
      toast.error(
        "Please enter a valid email address."
      );

      return false;
    }

    if (
      formData.phone.trim().length < 10
    ) {
      toast.error(
        "Please enter a valid phone number."
      );

      return false;
    }

    if (
      normalizedItems.length === 0
    ) {
      toast.error(
        "Your cart is empty."
      );

      return false;
    }

    for (const item of normalizedItems) {
      if (!item.product_id) {
        toast.error(
          "A product in your cart is invalid. Please refresh your cart."
        );

        return false;
      }

      if (item.quantity < 1) {
        toast.error(
          "Invalid product quantity."
        );

        return false;
      }
    }

    return true;
  };


  // ============================================================
  // SHIPPING ADDRESS
  // ============================================================

  const buildShippingAddress = () => {
    return {
      full_name:
        formData.full_name.trim(),

      phone:
        formData.phone.trim(),

      address_line1:
        formData.address.trim(),

      city:
        formData.city.trim(),

      state:
        formData.state.trim(),

      country:
        "Nigeria",

      postal_code:
        formData.zip_code.trim(),
    };
  };


  // ============================================================
  // START PAYSTACK PAYMENT
  // ============================================================

  const handlePayNow = async () => {
    if (processingPayment) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setProcessingPayment(true);

      const checkoutPayload = {
        items: normalizedItems.map(
          (item) => ({
            product_id:
              item.product_id,

            quantity:
              item.quantity,
          })
        ),

        shipping_address:
          buildShippingAddress(),

        payment_method:
          selectedPayment,

        email:
          formData.email.trim(),

        notes:
          "",
      };


      // Save the checkout information locally
      // ONLY temporarily so it survives the Paystack
      // redirect.
      //
      // This is not used to decide the payment amount.
      // The backend calculates the real amount.
      sessionStorage.setItem(
        PENDING_CHECKOUT_KEY,
        JSON.stringify(
          checkoutPayload
        )
      );


      const response =
        await api.post(
          "/payments/initialize-order",
          checkoutPayload
        );


      const payment =
        response.data;


      if (
        !payment?.status ||
        !payment?.authorization_url
      ) {
        throw new Error(
          payment?.message ||
          "Unable to initialize payment."
        );
      }


      toast.success(
        "Redirecting you to secure payment..."
      );


      // Paystack hosted checkout.
      window.location.href =
        payment.authorization_url;

    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      sessionStorage.removeItem(
        PENDING_CHECKOUT_KEY
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to initialize payment.";

      toast.error(message);

      setProcessingPayment(false);
    }
  };


  // ============================================================
  // COMPLETE ORDER AFTER PAYSTACK REDIRECT
  // ============================================================

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref");

    if (!reference) {
      return;
    }

    let mounted = true;

    const completeOrder = async () => {
      if (completingOrder) {
        return;
      }

      try {
        setCompletingOrder(true);

        const stored =
          sessionStorage.getItem(
            PENDING_CHECKOUT_KEY
          );

        if (!stored) {
          throw new Error(
            "Your checkout session could not be found. Please contact support with your payment reference."
          );
        }

        const pendingCheckout =
          JSON.parse(stored);


        const response =
          await api.post(
            "/orders/checkout",
            {
              ...pendingCheckout,
              reference,
            }
          );


        const result =
          response.data;


        if (!result?.status) {
          throw new Error(
            result?.message ||
            "Unable to complete your order."
          );
        }


        sessionStorage.removeItem(
          PENDING_CHECKOUT_KEY
        );


        try {
          await clearCart();
        } catch (cartError) {
          console.warn(
            "Cart clear warning:",
            cartError
          );
        }


        toast.success(
          "Payment verified! Your order has been placed."
        );


        const firstOrderId =
          result.order_ids?.[0];


        if (firstOrderId) {
          navigate(
            `/order-confirmation/${firstOrderId}`,
            {
              replace: true,
            }
          );
        } else {
          navigate(
            "/orders",
            {
              replace: true,
            }
          );
        }

      } catch (error) {
        console.error(
          "Order completion error:",
          error
        );

        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Payment verification failed.";

        toast.error(message);

        // Do NOT clear pending checkout here.
        // The customer can retry verification
        // if necessary.

      } finally {
        if (mounted) {
          setCompletingOrder(false);
        }
      }
    };


    completeOrder();


    return () => {
      mounted = false;
    };

  }, [
    searchParams,
    clearCart,
    navigate,
    completingOrder,
  ]);


  // ============================================================
  // PAYMENT METHODS
  // ============================================================

  const paymentMethods = [
    {
      id: "card",
      name: "Card",
      description:
        "Visa, Mastercard or Verve",
      icon: CreditCard,
      available: true,
    },

    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description:
        "Pay directly through bank transfer",
      icon: Banknote,
      available: true,
    },

    {
      id: "wallet",
      name: "Wallet",
      description:
        "Wallet payments coming soon",
      icon: Wallet,
      available: false,
    },
  ];


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-orange" />

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Loading your checkout...
          </p>
        </div>
      </div>
    );
  }


  // ============================================================
  // PAYMENT VERIFICATION SCREEN
  // ============================================================

  if (completingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 p-7 sm:p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Verifying your payment
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Please wait while Nexoleolite securely verifies your Paystack payment and creates your order.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        </div>
      </div>
    );
  }


  // ============================================================
  // EMPTY CART
  // ============================================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 p-8 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />

          <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add products to your cart before checking out.
          </p>

          <Link
            to="/cart"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-orange px-5 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    );
  }


  // ============================================================
  // MAIN CHECKOUT
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-8 lg:px-8">

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-orange dark:text-gray-300 dark:hover:text-orange-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Complete your order securely.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              Secure checkout
            </div>
          </div>
        </div>


        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* SHIPPING */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/30">
                    <Truck className="h-5 w-5 text-brand-orange" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Shipping Information
                    </h2>

                    <p className="text-xs text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    placeholder="08012345678"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>


                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Delivery Address
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      placeholder="House number, street, area"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                    />
                  </div>
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Lagos"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Lagos State"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postal Code
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    autoComplete="postal-code"
                    placeholder="100001"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                  />
                </div>

              </div>
            </section>


            {/* PAYMENT */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Payment Method
                    </h2>

                    <p className="text-xs text-gray-500">
                      Select how you want to pay.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-6">

                {paymentMethods.map((method) => {
                  const Icon =
                    method.icon;

                  const selected =
                    selectedPayment ===
                    method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={
                        !method.available ||
                        processingPayment
                      }
                      onClick={() =>
                        method.available &&
                        setSelectedPayment(
                          method.id
                        )
                      }
                      className={[
                        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
                        selected
                          ? "border-brand-orange bg-orange-50 dark:border-orange-500 dark:bg-orange-950/20"
                          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950",
                        !method.available
                          ? "cursor-not-allowed opacity-50"
                          : "",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          selected
                            ? "bg-brand-orange text-white"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {method.name}
                          </p>

                          {selected && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-orange" />
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>
                    </button>
                  );
                })}


                <div className="mt-4 flex gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                  <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                    Your payment is securely processed by Paystack. Nexoleolite does not store your card details.
                  </p>
                </div>

              </div>
            </section>


            {/* MOBILE PAY BUTTON */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={processingPayment}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting to Paystack...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay{" "}
                    {formatCurrency(
                      displayTotal
                    )}
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

          </div>


          {/* RIGHT - ORDER SUMMARY */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">

              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-brand-orange" />

                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Order Summary
                    </h2>
                  </div>
                </div>


                {/* PRODUCTS */}
                <div className="max-h-[360px] overflow-y-auto px-4 py-4 sm:px-6">
                  <div className="space-y-4">

                    {normalizedItems.map(
                      (item, index) => (
                        <div
                          key={`${item.product_id}-${index}`}
                          className="flex gap-3"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(
                                item.total
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                  </div>
                </div>


                {/* TOTALS */}
                <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-6">

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(
                          displaySubtotal
                        )}
                      </span>
                    </div>


                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(
                          shippingFee
                        )}
                      </span>
                    </div>


                    <div className="border-t border-dashed border-gray-200 pt-3 dark:border-gray-700">
                      <div className="flex items-end justify-between gap-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>

                        <span className="text-xl font-bold text-brand-orange">
                          {formatCurrency(
                            displayTotal
                          )}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* DESKTOP BUTTON */}
                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={processingPayment}
                    className="mt-5 hidden min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Connecting to Paystack...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        Pay{" "}
                        {formatCurrency(
                          displayTotal
                        )}
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>


                  <p className="mt-4 text-center text-[11px] leading-5 text-gray-500">
                    By continuing, you agree to Nexoleolite's terms and privacy policy.
                  </p>

                </div>

              </section>


              {/* SECURITY CARD */}
              <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/20">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />

                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-400">
                      Secure Payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700 dark:text-green-500">
                      Your payment is verified directly with Paystack before Nexoleolite creates your order.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};


export default CheckoutPage;