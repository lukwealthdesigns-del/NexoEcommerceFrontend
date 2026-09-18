// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCartStore } from '../../store/cartStore';
// import { useAuthStore } from '../../store/authStore';
// import { ordersService } from '../../services/orders';
// import { paymentsService } from '../../services/payments';
// import { formatCurrency } from '../../utils/formatters';
// import { CreditCard, Banknote, Wallet, Truck, MapPin, ChevronRight, Lock } from 'lucide-react';
// import toast from 'react-hot-toast';

// const CheckoutPage = () => {
//   const { items, totalPrice, clearCart } = useCartStore();
//   const { user } = useAuthStore();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState('card');
//   const [formData, setFormData] = useState({
//     full_name: user?.full_name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: '',
//     city: '',
//     state: '',
//     zip_code: '',
//   });

//   useEffect(() => {
//     if (items.length === 0) {
//       navigate('/cart');
//     }
//   }, [items, navigate]);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.address || !formData.city || !formData.state) {
//       toast.error('Please fill in all shipping details');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Create order
//       const orderData = {
//         items: items.map(item => ({
//           product_id: item.id,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//         shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`,
//         payment_method: selectedPayment,
//         total_amount: totalPrice,
//       };
      
//       const order = await ordersService.createOrder(orderData);
      
//       // Initialize payment
//       const payment = await paymentsService.initializePayment(
//         order.id,
//         totalPrice,
//         formData.email
//       );
      
//       // Clear cart
//       clearCart();
      
//       // Redirect to payment
//       if (payment.authorization_url) {
//         window.location.href = payment.authorization_url;
//       } else {
//         navigate(`/order-confirmation/${order.id}`);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.detail || 'Failed to process order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const paymentMethods = [
//     { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
//     { id: 'bank_transfer', name: 'Bank Transfer', icon: Banknote },
//     { id: 'wallet', name: 'Wallet', icon: Wallet },
//   ];

//   const shippingFee = totalPrice > 50000 ? 0 : 2000;
//   const tax = totalPrice * 0.075;
//   const grandTotal = totalPrice + shippingFee + tax;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
//                       className="input-field"
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
//                       className="input-field"
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
//                     className="input-field"
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
//                     className="input-field"
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
//                       className="input-field"
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
//                       className="input-field"
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
//                       className="input-field"
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
//                 {paymentMethods.map((method) => (
//                   <label
//                     key={method.id}
//                     className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
//                       selectedPayment === method.id
//                         ? 'border-brand-orange bg-brand-orange/5'
//                         : 'border-gray-200 dark:border-gray-700 hover:border-brand-orange'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <input
//                         type="radio"
//                         name="payment_method"
//                         value={method.id}
//                         checked={selectedPayment === method.id}
//                         onChange={(e) => setSelectedPayment(e.target.value)}
//                         className="h-4 w-4 text-brand-orange focus:ring-brand-orange"
//                       />
//                       <method.icon className="h-5 w-5 text-gray-500" />
//                       <span className="text-gray-900 dark:text-white">{method.name}</span>
//                     </div>
//                     {selectedPayment === method.id && (
//                       <div className="text-brand-orange">✓</div>
//                     )}
//                   </label>
//                 ))}
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
//                     <img
//                       src={item.image || '/placeholder.jpg'}
//                       alt={item.title}
//                       className="w-12 h-12 rounded-lg object-cover"
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
//                         {item.title}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                       {formatCurrency(item.price * item.quantity)}
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
              
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="btn-primary w-full mt-6 py-3 flex items-center justify-center space-x-2"
//               >
//                 {loading ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <>
//                     <span>Place Order</span>
//                     <ChevronRight className="h-4 w-4" />
//                   </>
//                 )}
//               </button>
              
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

// export default CheckoutPa
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import { PaystackButton } from 'react-paystack';
import { Truck, ChevronRight, Lock, ArrowLeft, ShoppingCart, CreditCard, Banknote, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [formData, setFormData] = useState({
    full_name: user?.first_name + ' ' + user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate('/cart');
    }
  }, [items, loading, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shippingFee = totalPrice > 50000 ? 0 : 2000;
  const tax = totalPrice * 0.075;
  const grandTotal = totalPrice + shippingFee + tax;
  
  // Amount in kobo (Paystack uses smallest currency unit - 1 Naira = 100 kobo)
  const amountInKobo = Math.round(grandTotal * 100);

  // Generate unique reference for each transaction
  const generateReference = () => {
    return `NEXO-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  };

  // Paystack config
  const paystackConfig = {
    reference: generateReference(),
    email: formData.email,
    amount: amountInKobo,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx',
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: formData.full_name,
        },
        {
          display_name: 'Phone Number',
          variable_name: 'customer_phone',
          value: formData.phone,
        },
        {
          display_name: 'Shipping Address',
          variable_name: 'shipping_address',
          value: `${formData.address}, ${formData.city}, ${formData.state}`,
        },
      ],
    },
    firstname: formData.full_name.split(' ')[0] || '',
    lastname: formData.full_name.split(' ').slice(1).join(' ') || '',
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response) => {
    console.log('Payment successful:', response);
    
    try {
      // Create order after successful payment
      const orderData = {
        id: 'ORD-' + Date.now(),
        items: items,
        subtotal: totalPrice,
        shipping_fee: shippingFee,
        tax: tax,
        total_amount: grandTotal,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`,
        customer_name: formData.full_name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        payment_method: selectedPayment,
        transaction_id: response.reference || response.transactionRef,
        payment_status: 'paid',
        status: 'processing',
        created_at: new Date().toISOString(),
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Save order to localStorage (in real app, this would be an API call)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      await clearCart();
      
      toast.success('Payment successful! Order placed successfully!');
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderData.id}`);
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Payment successful but failed to create order. Please contact support.');
    }
  };

  // Handle payment modal close
  const handlePaymentClose = () => {
    toast.info('Payment was cancelled');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, Verve' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Use your NexoLeolite wallet' },
  ];

  // Validate form before showing Paystack
  const isFormValid = () => {
    return formData.full_name && formData.email && formData.phone && formData.address && formData.city && formData.state;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/shop" className="bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange mb-6">
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </Link>

        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <ChevronRight className="h-5 w-5 text-gray-400" />
          <span className="text-gray-500 dark:text-gray-400">Complete your order</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-5 w-5 text-brand-orange" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="House number and street name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-brand-orange" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                        selectedPayment === method.id
                          ? 'border-brand-orange bg-brand-orange/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-brand-orange'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="h-4 w-4 text-brand-orange focus:ring-brand-orange"
                        />
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="text-gray-900 dark:text-white block">{method.name}</span>
                          <span className="text-xs text-gray-500">{method.description}</span>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <div className="text-brand-orange">✓</div>
                      )}
                    </label>
                  );
                })}
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Your payment information is secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency((item.product_price || item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (7.5%)</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-brand-orange">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Paystack Payment Button */}
              {selectedPayment === 'card' && (
                <div className="mt-6">
                  <PaystackButton
                    {...paystackConfig}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                    className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  />
                  {!isFormValid() && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      Please fill in all shipping details before payment
                    </p>
                  )}
                </div>
              )}

              {/* Other payment methods */}
              {selectedPayment !== 'card' && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {selectedPayment === 'bank_transfer' 
                      ? 'Bank Transfer instructions will be sent to your email after order confirmation.'
                      : 'Coming soon! Please select Card payment for now.'}
                  </p>
                </div>
              )}
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;