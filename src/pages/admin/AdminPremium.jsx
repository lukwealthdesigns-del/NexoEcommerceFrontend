

// import React, { useState, useEffect } from 'react';
// import { 
//   Crown, Edit, Save, X, Plus, Trash2, TrendingUp, 
//   DollarSign, Calendar, Users, Check, AlertCircle,
//   Eye, Star, Headphones, Rocket, Zap, Gem, Settings,
//   RefreshCw, Download, Search, Filter, Tag
// } from 'lucide-react';
// import { adminService } from '../../services/admin';
// import { premiumService } from '../../services/premium';
// import { useAuthStore } from '../../store/authStore';
// import toast from 'react-hot-toast';

// const AdminPremium = () => {
//   const { user } = useAuthStore();
//   const [plans, setPlans] = useState({});
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [stats, setStats] = useState({
//     totalPremiumUsers: 0,
//     totalRevenue: 0,
//     activeSubscriptions: 0,
//     expiringSoon: 0,
//   });
  
//   const [editForm, setEditForm] = useState({
//     name: '',
//     price: 0,
//     duration_days: 30,
//     boost_multiplier: 2,
//     features: [],
//     is_active: true
//   });
  
//   const [newFeature, setNewFeature] = useState('');
//   const [promoCode, setPromoCode] = useState({
//     code: '',
//     discount_percent: 10,
//     valid_until: '',
//     plan: 'all'
//   });

//   // New plan form state
//   const [newPlanForm, setNewPlanForm] = useState({
//     plan_key: '',
//     name: '',
//     price: 5000,
//     duration_days: 30,
//     boost_multiplier: 2,
//     features: ''
//   });

//   useEffect(() => {
//     loadPremiumData();
//   }, []);

//   const loadPremiumData = async () => {
//     setLoading(true);
//     try {
//       const [plansData, subscriptionsData, statsData] = await Promise.all([
//         premiumService.getPlans(),
//         adminService.getAllPremiumSubscriptions(),
//         adminService.getPremiumStats()
//       ]);
      
//       setPlans(plansData || {});
//       setSubscriptions(subscriptionsData?.subscriptions || []);
//       setStats(statsData || {
//         totalPremiumUsers: 0,
//         totalRevenue: 0,
//         activeSubscriptions: 0,
//         expiringSoon: 0,
//       });
//     } catch (error) {
//       console.error('Failed to load premium data:', error);
//       toast.error('Failed to load premium data');
//       // Set default plans if API fails
//       setPlans({
//         basic: {
//           name: "Basic",
//           price: 5000,
//           duration_days: 30,
//           boost_multiplier: 2,
//           features: ["2x product view boost", "Priority support", "Featured in category"]
//         },
//         standard: {
//           name: "Standard",
//           price: 15000,
//           duration_days: 90,
//           boost_multiplier: 5,
//           features: ["5x product view boost", "Priority support", "Featured in category & search"]
//         },
//         pro: {
//           name: "Pro",
//           price: 50000,
//           duration_days: 365,
//           boost_multiplier: 10,
//           features: ["10x product view boost", "24/7 priority support", "Featured on homepage"]
//         }
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditPlan = (planKey, planData) => {
//     setEditingPlan(planKey);
//     setEditForm({
//       name: planData?.name || '',
//       price: planData?.price || 0,
//       duration_days: planData?.duration_days || 30,
//       boost_multiplier: planData?.boost_multiplier || 2,
//       features: [...(planData?.features || [])],
//       is_active: true
//     });
//   };

//   const handleSavePlan = async () => {
//     if (!editingPlan) return;
    
//     try {
//       await adminService.updatePremiumPlan(editingPlan, {
//         name: editForm.name,
//         price: editForm.price || 0,
//         duration_days: editForm.duration_days || 30,
//         boost_multiplier: editForm.boost_multiplier || 2,
//         features: editForm.features || [],
//         is_active: true
//       });
      
//       // Update local state immediately
//       setPlans(prev => ({
//         ...prev,
//         [editingPlan]: {
//           ...prev[editingPlan],
//           name: editForm.name,
//           price: editForm.price || 0,
//           duration_days: editForm.duration_days || 30,
//           boost_multiplier: editForm.boost_multiplier || 2,
//           features: editForm.features || [],
//         }
//       }));
      
//       toast.success(`${editForm.name || editingPlan} plan updated successfully`);
//       setEditingPlan(null);
//       setNewFeature('');
      
//       // Refresh stats only
//       const statsData = await adminService.getPremiumStats();
//       setStats(statsData || {
//         totalPremiumUsers: 0,
//         totalRevenue: 0,
//         activeSubscriptions: 0,
//         expiringSoon: 0,
//       });
      
//     } catch (error) {
//       console.error('Update error:', error);
//       toast.error(error.response?.data?.detail || 'Failed to update plan');
//     }
//   };

//   const handleCreatePlan = async () => {
//     if (!newPlanForm.plan_key || !newPlanForm.name || !newPlanForm.price) {
//       toast.error('Please fill all required fields');
//       return;
//     }
    
//     try {
//       const featuresArray = newPlanForm.features.split(',').map(f => f.trim()).filter(f => f);
      
//       await adminService.createPremiumPlan({
//         plan_key: newPlanForm.plan_key.toLowerCase(),
//         name: newPlanForm.name,
//         price: newPlanForm.price || 0,
//         duration_days: newPlanForm.duration_days || 30,
//         boost_multiplier: newPlanForm.boost_multiplier || 2,
//         features: featuresArray,
//         is_active: true
//       });
      
//       toast.success(`${newPlanForm.name} plan created successfully`);
//       setShowAddModal(false);
//       setNewPlanForm({
//         plan_key: '',
//         name: '',
//         price: 5000,
//         duration_days: 30,
//         boost_multiplier: 2,
//         features: ''
//       });
//       loadPremiumData();
//     } catch (error) {
//       console.error('Create plan error:', error);
//       toast.error(error.response?.data?.detail || 'Failed to create plan');
//     }
//   };

//   const handleAddFeature = () => {
//     if (newFeature.trim()) {
//       setEditForm({
//         ...editForm,
//         features: [...editForm.features, newFeature.trim()]
//       });
//       setNewFeature('');
//     }
//   };

//   const handleRemoveFeature = (index) => {
//     const newFeatures = [...editForm.features];
//     newFeatures.splice(index, 1);
//     setEditForm({ ...editForm, features: newFeatures });
//   };

//   const handleCreatePromo = async () => {
//     if (!promoCode.code) {
//       toast.error('Please enter a promo code');
//       return;
//     }
//     try {
//       await adminService.createPromoCode(promoCode);
//       toast.success('Promo code created successfully');
//       setShowPromoModal(false);
//       setPromoCode({ code: '', discount_percent: 10, valid_until: '', plan: 'all' });
//     } catch (error) {
//       toast.error('Failed to create promo code');
//     }
//   };

//   const formatPrice = (price) => {
//     if (!price && price !== 0) return '₦0';
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const getPlanIcon = (planKey) => {
//     switch(planKey) {
//       case 'basic': return <Zap className="h-5 w-5" />;
//       case 'standard': return <Rocket className="h-5 w-5" />;
//       case 'pro': return <Gem className="h-5 w-5" />;
//       default: return <Crown className="h-5 w-5" />;
//     }
//   };

//   const getPlanColor = (planKey) => {
//     switch(planKey) {
//       case 'basic': return 'from-blue-500 to-blue-600';
//       case 'standard': return 'from-purple-500 to-purple-600';
//       case 'pro': return 'from-yellow-500 to-orange-500';
//       default: return 'from-brand-orange to-orange-600';
//     }
//   };

//   const statCards = [
//     { 
//       title: 'Total Premium Users', 
//       value: stats.totalPremiumUsers || 0, 
//       icon: Crown, 
//       color: 'bg-yellow-500',
//       change: '+12%'
//     },
//     { 
//       title: 'Total Revenue', 
//       value: formatPrice(stats.totalRevenue || 0), 
//       icon: DollarSign, 
//       color: 'bg-green-500',
//       change: '+23%'
//     },
//     { 
//       title: 'Active Subscriptions', 
//       value: stats.activeSubscriptions || 0, 
//       icon: Users, 
//       color: 'bg-blue-500',
//       change: '+8%'
//     },
//     { 
//       title: 'Expiring Soon', 
//       value: stats.expiringSoon || 0, 
//       icon: Calendar, 
//       color: 'bg-red-500',
//       change: '-5%'
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Premium Management</h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Manage premium plans, pricing, and subscriptions</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {statCards.map((stat, index) => (
//             <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
//                   <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
//                     {stat.change} from last month
//                   </p>
//                 </div>
//                 <div className={`${stat.color} p-3 rounded-xl`}>
//                   <stat.icon className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-brand-orange text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
//             >
//               <Plus className="h-5 w-5" />
//               <span>Add New Plan</span>
//             </button>
//             <button
//               onClick={() => setShowPromoModal(true)}
//               className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//             >
//               <Tag className="h-5 w-5" />
//               <span>Create Promo Code</span>
//             </button>
//           </div>
//           <button onClick={loadPremiumData} className="text-gray-500 hover:text-gray-700">
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Premium Plans Management */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-8">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Plans</h2>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {Object.entries(plans).map(([planKey, planData]) => (
//                 <div key={planKey} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
//                   {/* Plan Header */}
//                   <div className={`bg-gradient-to-r ${getPlanColor(planKey)} p-4 text-white`}>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         {getPlanIcon(planKey)}
//                         <h3 className="text-xl font-bold capitalize">{planData?.name || planKey}</h3>
//                       </div>
//                       {editingPlan !== planKey && (
//                         <button
//                           onClick={() => handleEditPlan(planKey, planData)}
//                           className="p-1 hover:bg-white/20 rounded-lg transition"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Plan Content */}
//                   <div className="p-4">
//                     {editingPlan === planKey ? (
//                       // Edit Mode
//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Plan Name
//                           </label>
//                           <input
//                             type="text"
//                             value={editForm.name || ''}
//                             onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Price (₦)
//                           </label>
//                           <input
//                             type="number"
//                             value={editForm.price || 0}
//                             onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
//                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Duration (days)
//                           </label>
//                           <input
//                             type="number"
//                             value={editForm.duration_days || 30}
//                             onChange={(e) => setEditForm({ ...editForm, duration_days: parseInt(e.target.value) || 30 })}
//                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             View Boost Multiplier
//                           </label>
//                           <input
//                             type="number"
//                             value={editForm.boost_multiplier || 2}
//                             onChange={(e) => setEditForm({ ...editForm, boost_multiplier: parseInt(e.target.value) || 2 })}
//                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Features
//                           </label>
//                           <div className="space-y-2 mb-2">
//                             {editForm.features?.map((feature, idx) => (
//                               <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
//                                 <span className="text-sm">{feature}</span>
//                                 <button
//                                   onClick={() => handleRemoveFeature(idx)}
//                                   className="text-red-500 hover:text-red-600"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                           <div className="flex space-x-2">
//                             <input
//                               type="text"
//                               value={newFeature}
//                               onChange={(e) => setNewFeature(e.target.value)}
//                               placeholder="Add new feature"
//                               className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                               onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
//                             />
//                             <button
//                               onClick={handleAddFeature}
//                               className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition"
//                             >
//                               Add
//                             </button>
//                           </div>
//                         </div>
                        
//                         <div className="flex space-x-3 pt-4">
//                           <button
//                             onClick={handleSavePlan}
//                             className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2"
//                           >
//                             <Save className="h-4 w-4" />
//                             <span>Save Changes</span>
//                           </button>
//                           <button
//                             onClick={() => setEditingPlan(null)}
//                             className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       // View Mode
//                       <>
//                         <div className="mb-4">
//                           <p className="text-3xl font-bold text-brand-orange">
//                             {formatPrice(planData?.price || 0)}
//                           </p>
//                           <p className="text-sm text-gray-500">for {planData?.duration_days || 0} days</p>
//                         </div>
                        
//                         <div className="mb-4">
//                           <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Features:
//                           </p>
//                           <ul className="space-y-1">
//                             {(planData?.features || []).slice(0, 4).map((feature, idx) => (
//                               <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                                 <Check className="h-3 w-3 text-green-500" />
//                                 <span>{feature}</span>
//                               </li>
//                             ))}
//                             {(planData?.features?.length || 0) > 4 && (
//                               <li className="text-xs text-gray-500">
//                                 +{(planData?.features?.length || 0) - 4} more features
//                               </li>
//                             )}
//                           </ul>
//                         </div>
                        
//                         <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Daily price:</span>
//                             <span className="font-semibold">
//                               {formatPrice(Math.ceil((planData?.price || 0) / (planData?.duration_days || 1)))}
//                             </span>
//                           </div>
//                           <div className="flex justify-between text-sm mt-1">
//                             <span className="text-gray-500">View boost:</span>
//                             <span className="font-semibold text-brand-orange">
//                               {planData?.boost_multiplier || 2}x
//                             </span>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Active Subscriptions Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Subscriptions</h2>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Plan</th>
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Started</th>
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Expires</th>
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
//                   <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subscriptions.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-8 text-gray-500">
//                       No active subscriptions found
//                     </td>
//                   </tr>
//                 ) : (
//                   subscriptions.map((sub) => (
//                     <tr key={sub.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                       <td className="py-3 px-6">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white text-sm">
//                             {sub.user_name?.[0] || 'U'}
//                           </div>
//                           <span className="text-sm text-gray-900 dark:text-white">{sub.user_name}</span>
//                         </div>
//                        </td>
//                       <td className="py-3 px-6">
//                         <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full capitalize ${
//                           sub.plan === 'pro' ? 'bg-yellow-100 text-yellow-700' :
//                           sub.plan === 'standard' ? 'bg-purple-100 text-purple-700' :
//                           'bg-blue-100 text-blue-700'
//                         }`}>
//                           {getPlanIcon(sub.plan)}
//                           <span>{sub.plan}</span>
//                         </span>
//                         </td>
//                       <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-400">
//                         {sub.started_at ? new Date(sub.started_at).toLocaleDateString() : 'N/A'}
//                         </td>
//                       <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-400">
//                         {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'N/A'}
//                         </td>
//                       <td className="py-3 px-6">
//                         <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                           <Check className="h-3 w-3" />
//                           <span>Active</span>
//                         </span>
//                         </td>
//                       <td className="py-3 px-6">
//                         <button className="text-red-500 hover:text-red-600 text-sm">
//                           Cancel
//                         </button>
//                         </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add Plan Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Premium Plan</h2>
//               <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Plan Key *
//                 </label>
//                 <input
//                   type="text"
//                   value={newPlanForm.plan_key}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, plan_key: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="e.g., enterprise"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Plan Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={newPlanForm.name}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="e.g., Enterprise"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Price (₦) *
//                 </label>
//                 <input
//                   type="number"
//                   value={newPlanForm.price}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, price: parseInt(e.target.value) || 0 })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="50000"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Duration (days) *
//                 </label>
//                 <input
//                   type="number"
//                   value={newPlanForm.duration_days}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, duration_days: parseInt(e.target.value) || 30 })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="365"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Boost Multiplier
//                 </label>
//                 <input
//                   type="number"
//                   value={newPlanForm.boost_multiplier}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, boost_multiplier: parseInt(e.target.value) || 2 })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="10"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Features (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   value={newPlanForm.features}
//                   onChange={(e) => setNewPlanForm({ ...newPlanForm, features: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="Feature 1, Feature 2, Feature 3"
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                 Cancel
//               </button>
//               <button onClick={handleCreatePlan} className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
//                 Create Plan
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Promo Code Modal */}
//       {showPromoModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Promo Code</h2>
//               <button onClick={() => setShowPromoModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Promo Code
//                 </label>
//                 <input
//                   type="text"
//                   value={promoCode.code}
//                   onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value.toUpperCase() })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="PREMIUM20"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Discount (%)
//                 </label>
//                 <input
//                   type="number"
//                   value={promoCode.discount_percent}
//                   onChange={(e) => setPromoCode({ ...promoCode, discount_percent: parseInt(e.target.value) || 0 })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                   placeholder="10"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Valid Until
//                 </label>
//                 <input
//                   type="date"
//                   value={promoCode.valid_until}
//                   onChange={(e) => setPromoCode({ ...promoCode, valid_until: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Applicable Plan
//                 </label>
//                 <select
//                   value={promoCode.plan}
//                   onChange={(e) => setPromoCode({ ...promoCode, plan: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
//                 >
//                   <option value="all">All Plans</option>
//                   <option value="basic">Basic Only</option>
//                   <option value="standard">Standard Only</option>
//                   <option value="pro">Pro Only</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex space-x-3 mt-6">
//               <button onClick={() => setShowPromoModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                 Cancel
//               </button>
//               <button onClick={handleCreatePromo} className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
//                 Create Promo
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPremium;

import React, { useState, useEffect } from 'react';
import { 
  Crown, Edit, Save, X, Plus, Trash2, TrendingUp, 
  DollarSign, Calendar, Users, Check, AlertCircle,
  Eye, Star, Headphones, Rocket, Zap, Gem, Settings,
  RefreshCw, Download, Search, Filter, Tag
} from 'lucide-react';
import { adminService } from '../../services/admin';
import { premiumService } from '../../services/premium';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminPremium = () => {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [stats, setStats] = useState({
    totalPremiumUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    expiringSoon: 0,
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    duration_days: 30,
    boost_multiplier: 2,
    features: [],
    is_active: true
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [promoCode, setPromoCode] = useState({
    code: '',
    discount_percent: 10,
    valid_until: '',
    plan: 'all'
  });

  // New plan form state
  const [newPlanForm, setNewPlanForm] = useState({
    plan_key: '',
    name: '',
    price: 5000,
    duration_days: 30,
    boost_multiplier: 2,
    features: ''
  });

  useEffect(() => {
    loadPremiumData();
  }, []);

  const loadPremiumData = async () => {
    setLoading(true);
    try {
      const [plansData, subscriptionsData, statsData] = await Promise.all([
        premiumService.getPlans(),
        adminService.getAllPremiumSubscriptions(),
        adminService.getPremiumStats()
      ]);
      
      setPlans(plansData || {});
      setSubscriptions(subscriptionsData?.subscriptions || []);
      setStats(statsData || {
        totalPremiumUsers: 0,
        totalRevenue: 0,
        activeSubscriptions: 0,
        expiringSoon: 0,
      });
    } catch (error) {
      console.error('Failed to load premium data:', error);
      toast.error('Failed to load premium data');
      // Set default plans if API fails
      setPlans({
        basic: {
          name: "Basic",
          price: 5000,
          duration_days: 30,
          boost_multiplier: 2,
          features: ["2x product view boost", "Priority support", "Featured in category"]
        },
        standard: {
          name: "Standard",
          price: 15000,
          duration_days: 90,
          boost_multiplier: 5,
          features: ["5x product view boost", "Priority support", "Featured in category & search"]
        },
        pro: {
          name: "Pro",
          price: 50000,
          duration_days: 365,
          boost_multiplier: 10,
          features: ["10x product view boost", "24/7 priority support", "Featured on homepage"]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (planKey, planData) => {
    setEditingPlan(planKey);
    setEditForm({
      name: planData?.name || '',
      price: planData?.price || 0,
      duration_days: planData?.duration_days || 30,
      boost_multiplier: planData?.boost_multiplier || 2,
      features: [...(planData?.features || [])],
      is_active: true
    });
  };

  // FIXED: This now reloads data from database after save
  const handleSavePlan = async () => {
    if (!editingPlan) return;
    
    setSaving(true);
    
    try {
      // Save to backend
      await adminService.updatePremiumPlan(editingPlan, {
        name: editForm.name,
        price: editForm.price || 0,
        duration_days: editForm.duration_days || 30,
        boost_multiplier: editForm.boost_multiplier || 2,
        features: editForm.features || [],
        is_active: true
      });
      
      // IMPORTANT: Reload all data from database to get fresh values
      await loadPremiumData();
      
      toast.success(`${editForm.name || editingPlan} plan updated successfully`);
      setEditingPlan(null);
      setNewFeature('');
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update plan');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlanForm.plan_key || !newPlanForm.name || !newPlanForm.price) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const featuresArray = newPlanForm.features.split(',').map(f => f.trim()).filter(f => f);
      
      await adminService.createPremiumPlan({
        plan_key: newPlanForm.plan_key.toLowerCase(),
        name: newPlanForm.name,
        price: newPlanForm.price || 0,
        duration_days: newPlanForm.duration_days || 30,
        boost_multiplier: newPlanForm.boost_multiplier || 2,
        features: featuresArray,
        is_active: true
      });
      
      toast.success(`${newPlanForm.name} plan created successfully`);
      setShowAddModal(false);
      setNewPlanForm({
        plan_key: '',
        name: '',
        price: 5000,
        duration_days: 30,
        boost_multiplier: 2,
        features: ''
      });
      await loadPremiumData();
    } catch (error) {
      console.error('Create plan error:', error);
      toast.error(error.response?.data?.detail || 'Failed to create plan');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setEditForm({
        ...editForm,
        features: [...editForm.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...editForm.features];
    newFeatures.splice(index, 1);
    setEditForm({ ...editForm, features: newFeatures });
  };

  const handleCreatePromo = async () => {
    if (!promoCode.code) {
      toast.error('Please enter a promo code');
      return;
    }
    try {
      await adminService.createPromoCode(promoCode);
      toast.success('Promo code created successfully');
      setShowPromoModal(false);
      setPromoCode({ code: '', discount_percent: 10, valid_until: '', plan: 'all' });
    } catch (error) {
      toast.error('Failed to create promo code');
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPlanIcon = (planKey) => {
    switch(planKey) {
      case 'basic': return <Zap className="h-5 w-5" />;
      case 'standard': return <Rocket className="h-5 w-5" />;
      case 'pro': return <Gem className="h-5 w-5" />;
      default: return <Crown className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planKey) => {
    switch(planKey) {
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'standard': return 'from-purple-500 to-purple-600';
      case 'pro': return 'from-yellow-500 to-orange-500';
      default: return 'from-brand-orange to-orange-600';
    }
  };

  const statCards = [
    { 
      title: 'Total Premium Users', 
      value: stats.totalPremiumUsers || 0, 
      icon: Crown, 
      color: 'bg-yellow-500',
      change: '+12%'
    },
    { 
      title: 'Total Revenue', 
      value: formatPrice(stats.totalRevenue || 0), 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+23%'
    },
    { 
      title: 'Active Subscriptions', 
      value: stats.activeSubscriptions || 0, 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+8%'
    },
    { 
      title: 'Expiring Soon', 
      value: stats.expiringSoon || 0, 
      icon: Calendar, 
      color: 'bg-red-500',
      change: '-5%'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Premium Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage premium plans, pricing, and subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Plan</span>
            </button>
            <button
              onClick={() => setShowPromoModal(true)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <Tag className="h-5 w-5" />
              <span>Create Promo Code</span>
            </button>
          </div>
          <button onClick={loadPremiumData} className="text-gray-500 hover:text-gray-700">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Premium Plans Management */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Premium Plans</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planKey, planData]) => (
                <div key={planKey} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  {/* Plan Header */}
                  <div className={`bg-gradient-to-r ${getPlanColor(planKey)} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(planKey)}
                        <h3 className="text-xl font-bold capitalize">{planData?.name || planKey}</h3>
                      </div>
                      {editingPlan !== planKey && (
                        <button
                          onClick={() => handleEditPlan(planKey, planData)}
                          className="p-1 hover:bg-white/20 rounded-lg transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Plan Content */}
                  <div className="p-4">
                    {editingPlan === planKey ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price (₦)
                          </label>
                          <input
                            type="number"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (days)
                          </label>
                          <input
                            type="number"
                            value={editForm.duration_days || 30}
                            onChange={(e) => setEditForm({ ...editForm, duration_days: parseInt(e.target.value) || 30 })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            View Boost Multiplier
                          </label>
                          <input
                            type="number"
                            value={editForm.boost_multiplier || 2}
                            onChange={(e) => setEditForm({ ...editForm, boost_multiplier: parseInt(e.target.value) || 2 })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Features
                          </label>
                          <div className="space-y-2 mb-2">
                            {editForm.features?.map((feature, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                <span className="text-sm">{feature}</span>
                                <button
                                  onClick={() => handleRemoveFeature(idx)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              placeholder="Add new feature"
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                            />
                            <button
                              onClick={handleAddFeature}
                              className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <button
                            onClick={handleSavePlan}
                            disabled={saving}
                            className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            {saving ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                          <button
                            onClick={() => setEditingPlan(null)}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-brand-orange">
                            {formatPrice(planData?.price || 0)}
                          </p>
                          <p className="text-sm text-gray-500">for {planData?.duration_days || 0} days</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Features:
                          </p>
                          <ul className="space-y-1">
                            {(planData?.features || []).slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {(planData?.features?.length || 0) > 4 && (
                              <li className="text-xs text-gray-500">
                                +{(planData?.features?.length || 0) - 4} more features
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Daily price:</span>
                            <span className="font-semibold">
                              {formatPrice(Math.ceil((planData?.price || 0) / (planData?.duration_days || 1)))}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-500">View boost:</span>
                            <span className="font-semibold text-brand-orange">
                              {planData?.boost_multiplier || 2}x
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Subscriptions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Subscriptions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Plan</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Started</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Expires</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No active subscriptions found
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-orange to-orange-400 flex items-center justify-center text-white text-sm">
                            {sub.user_name?.[0] || 'U'}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">{sub.user_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full capitalize ${
                          sub.plan === 'pro' ? 'bg-yellow-100 text-yellow-700' :
                          sub.plan === 'standard' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {getPlanIcon(sub.plan)}
                          <span>{sub.plan}</span>
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-400">
                        {sub.started_at ? new Date(sub.started_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600 dark:text-gray-400">
                        {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          <Check className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <button className="text-red-500 hover:text-red-600 text-sm">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Premium Plan</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Key *
                </label>
                <input
                  type="text"
                  value={newPlanForm.plan_key}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, plan_key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="e.g., enterprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={newPlanForm.name}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="e.g., Enterprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  value={newPlanForm.price}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  value={newPlanForm.duration_days}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, duration_days: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="365"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Boost Multiplier
                </label>
                <input
                  type="number"
                  value={newPlanForm.boost_multiplier}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, boost_multiplier: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={newPlanForm.features}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, features: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button onClick={handleCreatePlan} className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promo Code Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Promo Code</h2>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Promo Code
                </label>
                <input
                  type="text"
                  value={promoCode.code}
                  onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="PREMIUM20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={promoCode.discount_percent}
                  onChange={(e) => setPromoCode({ ...promoCode, discount_percent: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={promoCode.valid_until}
                  onChange={(e) => setPromoCode({ ...promoCode, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Applicable Plan
                </label>
                <select
                  value={promoCode.plan}
                  onChange={(e) => setPromoCode({ ...promoCode, plan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="all">All Plans</option>
                  <option value="basic">Basic Only</option>
                  <option value="standard">Standard Only</option>
                  <option value="pro">Pro Only</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowPromoModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button onClick={handleCreatePromo} className="flex-1 bg-brand-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                Create Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPremium;
