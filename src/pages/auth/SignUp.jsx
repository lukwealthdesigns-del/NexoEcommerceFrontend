

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Eye, EyeOff, Mail, Lock, User, Phone, Check, AlertCircle } from 'lucide-react';
// import { authService } from '../../services/auth';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// const signUpSchema = z.object({
//   first_name: z.string()
//     .min(2, 'First name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
//   last_name: z.string()
//     .min(2, 'Last name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
//   username: z.string()
//     .min(3, 'Username must be at least 3 characters')
//     .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores'),
//   email: z.string().email('Invalid email address'),
//   phone: z.string().min(10, 'Valid phone number required'),
//   password: z.string()
//     .min(8, 'Password must be at least 8 characters')
//     .regex(/[A-Z]/, 'Must contain uppercase letter')
//     .regex(/[a-z]/, 'Must contain lowercase letter')
//     .regex(/[0-9]/, 'Must contain number')
//     .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
//   confirm_password: z.string(),
//   terms: z.boolean().refine(val => val === true, 'You must accept terms and conditions'),
// }).refine((data) => data.password === data.confirm_password, {
//   message: "Passwords don't match",
//   path: ["confirm_password"],
// });

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const navigate = useNavigate();

//   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       first_name: '',
//       last_name: '',
//       username: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirm_password: '',
//       terms: false,
//     }
//   });

//   const password = watch('password');
//   const confirmPassword = watch('confirm_password');

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     setServerError('');
    
//     try {
//       const response = await authService.signUp({
//         first_name: data.first_name,
//         last_name: data.last_name,
//         username: data.username,
//         email: data.email,
//         phone: data.phone,
//         password: data.password,
//         confirm_password: data.confirm_password,
//       });
      
//       toast.success('Verification code sent to your email!');
//       navigate('/verify-otp', { state: { email: data.email } });
//     } catch (error) {
//       console.error('Signup error:', error);
//       const errorMessage = error.message || error.response?.data?.detail || 'Signup failed';
      
//       // Handle specific error messages
//       if (errorMessage.includes('already exists') || errorMessage.includes('User with this email or username already exists')) {
//         setServerError('An account with this email or username already exists. Please login instead.');
//         toast.error('Account already exists. Please login.');
//       } else if (errorMessage.includes('password')) {
//         setServerError(errorMessage);
//         toast.error(errorMessage);
//       } else {
//         setServerError(errorMessage);
//         toast.error(errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Join NexoLeolite today</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
//           {/* Server Error Display */}
//           {serverError && (
//             <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-2">
//               <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
//                 {serverError.includes('already exists') && (
//                   <Link to="/signin" className="text-sm text-brand-orange hover:underline mt-1 inline-block">
//                     Login to your existing account →
//                   </Link>
//                 )}
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 First Name *
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('first_name')}
//                   type="text"
//                   className={`input-field pl-10 ${errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="John"
//                 />
//               </div>
//               {errors.first_name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Last Name *
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('last_name')}
//                   type="text"
//                   className={`input-field pl-10 ${errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Doe"
//                 />
//               </div>
//               {errors.last_name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
//               )}
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Username *
//               </label>
//               <input
//                 {...register('username')}
//                 type="text"
//                 className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
//                 placeholder="johndoe123"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email Address *
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('email')}
//                   type="email"
//                   className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Phone Number *
//               </label>
//               <PhoneInput
//                 international
//                 defaultCountry="NG"
//                 value={watch('phone')}
//                 onChange={(value) => setValue('phone', value || '')}
//                 className="phone-input"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Create a strong password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//               )}
              
//               {/* Password strength indicator */}
//               {password && (
//                 <div className="mt-2 space-y-1">
//                   <div className="flex items-center space-x-2">
//                     <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Use 8+ chars with uppercase, lowercase, number & special char
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Confirm Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('confirm_password')}
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   className={`input-field pl-10 pr-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//               {confirmPassword && password === confirmPassword && (
//                 <p className="text-green-500 text-xs mt-1 flex items-center">
//                   <Check className="h-3 w-3 mr-1" /> Passwords match
//                 </p>
//               )}
//               {errors.confirm_password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
//               )}
//             </div>

//             {/* Terms & Conditions */}
//             <div className="flex items-start space-x-2">
//               <input
//                 {...register('terms')}
//                 type="checkbox"
//                 className="mt-1 h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
//               />
//               <label className="text-sm text-gray-600 dark:text-gray-400">
//                 I agree to the{' '}
//                 <button
//                   type="button"
//                   onClick={() => window.open('/terms', '_blank')}
//                   className="text-brand-orange hover:underline"
//                 >
//                   Terms & Conditions
//                 </button>
//                 {' '}and{' '}
//                 <button
//                   type="button"
//                   onClick={() => window.open('/privacy', '_blank')}
//                   className="text-brand-orange hover:underline"
//                 >
//                   Privacy Policy
//                 </button>
//               </label>
//             </div>
//             {errors.terms && (
//               <p className="text-red-500 text-xs">{errors.terms.message}</p>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating account...
//                 </div>
//               ) : (
//                 'Sign Up'
//               )}
//             </button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             {/* Google Sign Up */}
//             <button
//               type="button"
//               onClick={handleGoogleLogin}
//               className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//             >
//               <svg className="h-5 w-5" viewBox="0 0 24 24">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               <span className="text-gray-700 dark:text-gray-300">Sign up with Google</span>
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
//             Already have an account?{' '}
//             <Link to="/signin" className="text-brand-orange hover:underline font-semibold">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Eye, EyeOff, Mail, Lock, User, Phone, Check, AlertCircle } from 'lucide-react';
// import { authService } from '../../services/auth';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// const signUpSchema = z.object({
//   first_name: z.string()
//     .min(2, 'First name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
//   last_name: z.string()
//     .min(2, 'Last name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
//   username: z.string()
//     .min(3, 'Username must be at least 3 characters')
//     .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores'),
//   email: z.string().email('Please enter a valid email address'),
//   phone: z.string().min(10, 'Please enter a valid phone number'),
//   password: z.string()
//     .min(8, 'Password must be at least 8 characters')
//     .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
//     .regex(/[a-z]/, 'Must contain at least one lowercase letter')
//     .regex(/[0-9]/, 'Must contain at least one number')
//     .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),
//   confirm_password: z.string(),
//   terms: z.boolean().refine(val => val === true, 'You must accept the Terms & Conditions'),
// }).refine((data) => data.password === data.confirm_password, {
//   message: "Passwords don't match",
//   path: ["confirm_password"],
// });

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [errorType, setErrorType] = useState('');
//   const navigate = useNavigate();

//   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       first_name: '',
//       last_name: '',
//       username: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirm_password: '',
//       terms: false,
//     }
//   });

//   const password = watch('password');
//   const confirmPassword = watch('confirm_password');

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     setServerError('');
//     setErrorType('');
    
//     const payload = {
//       first_name: data.first_name,
//       last_name: data.last_name,
//       username: data.username,
//       email: data.email,
//       phone: data.phone,
//       password: data.password,
//       confirm_password: data.confirm_password,
//     };
    
//     try {
//       const response = await authService.signUp(payload);
      
//       toast.success('Verification code sent! Check your email.');
//       localStorage.setItem('pending_verification_email', data.email);
//       navigate('/verify-otp', { state: { email: data.email } });
//     } catch (error) {
//       console.error('Signup error:', error);
      
//       const statusCode = error.response?.status;
//       const errorDetail = error.response?.data?.detail;
      
//       // Handle different error types with user-friendly messages
//       if (statusCode === 404) {
//         setServerError("Unable to connect to the server. Please make sure the backend is running.");
//         setErrorType('connection');
//         toast.error("Server connection failed. Please try again later.");
//       } else if (statusCode === 400) {
//         if (typeof errorDetail === 'string') {
//           if (errorDetail.includes('already exists') || errorDetail.includes('User with this email or username already exists')) {
//             setServerError("An account with this email address or username already exists.");
//             setErrorType('exists');
//             toast.error("Account already exists. Please login instead.");
//           } else if (errorDetail.includes('password')) {
//             setServerError("Password doesn't meet requirements. Please check the password guidelines.");
//             setErrorType('password');
//             toast.error("Password requirements not met.");
//           } else {
//             setServerError(errorDetail);
//             setErrorType('validation');
//             toast.error(errorDetail);
//           }
//         } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
//           const firstError = errorDetail[0];
//           const errorMsg = firstError?.msg || 'Please check your information and try again.';
//           setServerError(errorMsg);
//           setErrorType('validation');
//           toast.error(errorMsg);
//         } else {
//           setServerError("Please check all fields and try again.");
//           setErrorType('validation');
//           toast.error("Invalid information. Please check your entries.");
//         }
//       } else if (statusCode === 500) {
//         setServerError("Server error. Please try again later or contact support.");
//         setErrorType('server');
//         toast.error("Server error. Please try again.");
//       } else {
//         setServerError("Unable to create account. Please check your internet connection and try again.");
//         setErrorType('general');
//         toast.error("Signup failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Join NexoLeolite today</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
//           {/* Server Error Display */}
//           {serverError && (
//             <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
//               <div className="flex items-start space-x-3">
//                 <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
//                   {errorType === 'exists' && (
//                     <div className="mt-3">
//                       <Link 
//                         to="/signin" 
//                         className="inline-flex items-center space-x-2 text-sm text-brand-orange hover:underline"
//                       >
//                         <span>→</span>
//                         <span>Login to your existing account</span>
//                       </Link>
//                     </div>
//                   )}
//                   {errorType === 'connection' && (
//                     <div className="mt-3">
//                       <button 
//                         onClick={() => window.location.reload()} 
//                         className="text-sm text-brand-orange hover:underline"
//                       >
//                         Refresh page and try again →
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 First Name *
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('first_name')}
//                   type="text"
//                   className={`input-field pl-10 ${errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="John"
//                 />
//               </div>
//               {errors.first_name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Last Name *
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('last_name')}
//                   type="text"
//                   className={`input-field pl-10 ${errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Doe"
//                 />
//               </div>
//               {errors.last_name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
//               )}
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Username *
//               </label>
//               <input
//                 {...register('username')}
//                 type="text"
//                 className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
//                 placeholder="johndoe123"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email Address *
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('email')}
//                   type="email"
//                   className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Phone Number *
//               </label>
//               <PhoneInput
//                 international
//                 defaultCountry="NG"
//                 value={watch('phone')}
//                 onChange={(value) => setValue('phone', value || '')}
//                 className="phone-input"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Create a strong password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//               )}
              
//               {/* Password strength indicator */}
//               {password && (
//                 <div className="mt-2 space-y-1">
//                   <div className="flex items-center space-x-2">
//                     <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Password must have: 8+ characters, uppercase, lowercase, number & special character (!@#$%^&*)
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Confirm Password *
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('confirm_password')}
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   className={`input-field pl-10 pr-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>
//               {confirmPassword && password === confirmPassword && (
//                 <p className="text-green-500 text-xs mt-1 flex items-center">
//                   <Check className="h-3 w-3 mr-1" /> ✓ Passwords match
//                 </p>
//               )}
//               {errors.confirm_password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
//               )}
//             </div>

//             {/* Terms & Conditions */}
//             <div className="flex items-start space-x-2">
//               <input
//                 {...register('terms')}
//                 type="checkbox"
//                 className="mt-1 h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
//               />
//               <label className="text-sm text-gray-600 dark:text-gray-400">
//                 I agree to the{' '}
//                 <button
//                   type="button"
//                   onClick={() => window.open('/terms', '_blank')}
//                   className="text-brand-orange hover:underline"
//                 >
//                   Terms & Conditions
//                 </button>
//                 {' '}and{' '}
//                 <button
//                   type="button"
//                   onClick={() => window.open('/privacy', '_blank')}
//                   className="text-brand-orange hover:underline"
//                 >
//                   Privacy Policy
//                 </button>
//               </label>
//             </div>
//             {errors.terms && (
//               <p className="text-red-500 text-xs">{errors.terms.message}</p>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating account...
//                 </div>
//               ) : (
//                 'Create Account'
//               )}
//             </button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             {/* Google Sign Up */}
//             <button
//               type="button"
//               onClick={handleGoogleLogin}
//               className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//             >
//               <svg className="h-5 w-5" viewBox="0 0 24 24">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               <span className="text-gray-700 dark:text-gray-300">Sign up with Google</span>
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
//             Already have an account?{' '}
//             <Link to="/signin" className="text-brand-orange hover:underline font-semibold">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   User,
//   Check,
//   AlertCircle,
//   FileText,
//   ShieldCheck
// } from 'lucide-react';
// import { authService } from '../../services/auth';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// // Update this path if your About page uses a different route.
// const ABOUT_TERMS_URL = '/about#terms-and-conditions';

// // Update this path if your Privacy Policy uses a different route.
// const PRIVACY_POLICY_URL = '/privacy';

// const signUpSchema = z.object({
//   first_name: z.string()
//     .min(2, 'First name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),

//   last_name: z.string()
//     .min(2, 'Last name must be at least 2 characters')
//     .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),

//   username: z.string()
//     .min(3, 'Username must be at least 3 characters')
//     .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores'),

//   email: z.string()
//     .email('Please enter a valid email address'),

//   phone: z.string()
//     .min(10, 'Please enter a valid phone number'),

//   password: z.string()
//     .min(8, 'Password must be at least 8 characters')
//     .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
//     .regex(/[a-z]/, 'Must contain at least one lowercase letter')
//     .regex(/[0-9]/, 'Must contain at least one number')
//     .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),

//   confirm_password: z.string(),

//   terms: z.boolean().refine(
//     value => value === true,
//     'You must accept the Terms and Conditions and Privacy Policy to create an account.'
//   ),
// }).refine(
//   data => data.password === data.confirm_password,
//   {
//     message: "Passwords don't match",
//     path: ['confirm_password'],
//   }
// );

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [errorType, setErrorType] = useState('');

//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//     defaultValues: {
//       first_name: '',
//       last_name: '',
//       username: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirm_password: '',
//       terms: false,
//     },
//   });

//   const password = watch('password');
//   const confirmPassword = watch('confirm_password');
//   const phone = watch('phone');
//   const termsAccepted = watch('terms');

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     setServerError('');
//     setErrorType('');

//     // Do not send the checkbox field to the existing API unless
//     // the backend is configured to accept and store it.
//     const payload = {
//       first_name: data.first_name,
//       last_name: data.last_name,
//       username: data.username,
//       email: data.email,
//       phone: data.phone,
//       password: data.password,
//       confirm_password: data.confirm_password,
//     };

//     try {
//       await authService.signUp(payload);

//       toast.success('Verification code sent! Check your email.');

//       localStorage.setItem('pending_verification_email', data.email);

//       navigate('/verify-otp', {
//         state: { email: data.email },
//       });
//     } catch (error) {
//       console.error('Signup error:', error);

//       const statusCode = error.response?.status;
//       const errorDetail = error.response?.data?.detail;

//       if (statusCode === 404) {
//         setServerError(
//           'Unable to connect to the server. Please make sure the backend is running.'
//         );
//         setErrorType('connection');
//         toast.error('Server connection failed. Please try again later.');
//       } else if (statusCode === 400) {
//         if (typeof errorDetail === 'string') {
//           if (
//             errorDetail.includes('already exists') ||
//             errorDetail.includes(
//               'User with this email or username already exists'
//             )
//           ) {
//             setServerError(
//               'An account with this email address or username already exists.'
//             );
//             setErrorType('exists');
//             toast.error('Account already exists. Please login instead.');
//           } else if (errorDetail.toLowerCase().includes('password')) {
//             setServerError(
//               "Password doesn't meet requirements. Please check the password guidelines."
//             );
//             setErrorType('password');
//             toast.error('Password requirements not met.');
//           } else {
//             setServerError(errorDetail);
//             setErrorType('validation');
//             toast.error(errorDetail);
//           }
//         } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
//           const firstError = errorDetail[0];
//           const errorMsg =
//             firstError?.msg ||
//             'Please check your information and try again.';

//           setServerError(errorMsg);
//           setErrorType('validation');
//           toast.error(errorMsg);
//         } else {
//           setServerError('Please check all fields and try again.');
//           setErrorType('validation');
//           toast.error('Invalid information. Please check your entries.');
//         }
//       } else if (statusCode === 500) {
//         setServerError(
//           'Server error. Please try again later or contact support.'
//         );
//         setErrorType('server');
//         toast.error('Server error. Please try again.');
//       } else {
//         setServerError(
//           'Unable to create account. Please check your internet connection and try again.'
//         );
//         setErrorType('general');
//         toast.error('Signup failed. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignup = () => {
//     // This redirects to the existing Google OAuth flow.
//     // OAuth consent must be handled separately if you also require
//     // Google signups to accept the terms before account creation.
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Create Account
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Join Nexoleolite today
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
//           {serverError && (
//             <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
//               <div className="flex items-start space-x-3">
//                 <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />

//                 <div className="flex-1">
//                   <p className="text-sm text-red-600 dark:text-red-400">
//                     {serverError}
//                   </p>

//                   {errorType === 'exists' && (
//                     <div className="mt-3">
//                       <Link
//                         to="/signin"
//                         className="inline-flex items-center space-x-2 text-sm text-brand-orange hover:underline"
//                       >
//                         <span>→</span>
//                         <span>Login to your existing account</span>
//                       </Link>
//                     </div>
//                   )}

//                   {errorType === 'connection' && (
//                     <div className="mt-3">
//                       <button
//                         type="button"
//                         onClick={() => window.location.reload()}
//                         className="text-sm text-brand-orange hover:underline"
//                       >
//                         Refresh page and try again →
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 First Name *
//               </label>

//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

//                 <input
//                   {...register('first_name')}
//                   type="text"
//                   autoComplete="given-name"
//                   className={`input-field pl-10 ${
//                     errors.first_name
//                       ? 'border-red-500 focus:ring-red-500'
//                       : ''
//                   }`}
//                   placeholder="John"
//                 />
//               </div>

//               {errors.first_name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.first_name.message}
//                 </p>
//               )}
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Last Name *
//               </label>

//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

//                 <input
//                   {...register('last_name')}
//                   type="text"
//                   autoComplete="family-name"
//                   className={`input-field pl-10 ${
//                     errors.last_name
//                       ? 'border-red-500 focus:ring-red-500'
//                       : ''
//                   }`}
//                   placeholder="Doe"
//                 />
//               </div>

//               {errors.last_name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.last_name.message}
//                 </p>
//               )}
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Username *
//               </label>

//               <input
//                 {...register('username')}
//                 type="text"
//                 autoComplete="username"
//                 className={`input-field ${
//                   errors.username
//                     ? 'border-red-500 focus:ring-red-500'
//                     : ''
//                 }`}
//                 placeholder="johndoe123"
//               />

//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email Address *
//               </label>

//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

//                 <input
//                   {...register('email')}
//                   type="email"
//                   autoComplete="email"
//                   className={`input-field pl-10 ${
//                     errors.email
//                       ? 'border-red-500 focus:ring-red-500'
//                       : ''
//                   }`}
//                   placeholder="you@example.com"
//                 />
//               </div>

//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Phone Number *
//               </label>

//               <PhoneInput
//                 international
//                 defaultCountry="NG"
//                 value={phone}
//                 onChange={(value) =>
//                   setValue('phone', value || '', {
//                     shouldValidate: true,
//                     shouldDirty: true,
//                   })
//                 }
//                 className="phone-input"
//                 aria-label="Phone number"
//               />

//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password *
//               </label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

//                 <input
//                   {...register('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   className={`input-field pl-10 pr-10 ${
//                     errors.password
//                       ? 'border-red-500 focus:ring-red-500'
//                       : ''
//                   }`}
//                   placeholder="Create a strong password"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(value => !value)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showPassword
//                     ? <EyeOff className="h-5 w-5 text-gray-400" />
//                     : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>

//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.password.message}
//                 </p>
//               )}

//               {password && (
//                 <div className="mt-2 space-y-1">
//                   <div className="flex items-center space-x-2">
//                     <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                   </div>

//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Password must have: 8+ characters, uppercase, lowercase,
//                     number and special character.
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Confirm Password *
//               </label>

//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

//                 <input
//                   {...register('confirm_password')}
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   className={`input-field pl-10 pr-10 ${
//                     errors.confirm_password
//                       ? 'border-red-500 focus:ring-red-500'
//                       : ''
//                   }`}
//                   placeholder="Confirm your password"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(value => !value)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2"
//                   aria-label={
//                     showConfirmPassword
//                       ? 'Hide confirm password'
//                       : 'Show confirm password'
//                   }
//                 >
//                   {showConfirmPassword
//                     ? <EyeOff className="h-5 w-5 text-gray-400" />
//                     : <Eye className="h-5 w-5 text-gray-400" />}
//                 </button>
//               </div>

//               {confirmPassword && password === confirmPassword && (
//                 <p className="text-green-500 text-xs mt-1 flex items-center">
//                   <Check className="h-3 w-3 mr-1" />
//                   Passwords match
//                 </p>
//               )}

//               {errors.confirm_password && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.confirm_password.message}
//                 </p>
//               )}
//             </div>

//             {/* Required Terms and Privacy acceptance */}
//             <div
//               className={`rounded-xl border p-4 ${
//                 errors.terms
//                   ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
//                   : 'border-gray-200 dark:border-gray-700'
//               }`}
//             >
//               <div className="flex items-start gap-3">
//                 <input
//                   {...register('terms')}
//                   id="terms"
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
//                   aria-invalid={Boolean(errors.terms)}
//                   aria-describedby={errors.terms ? 'terms-error' : undefined}
//                 />

//                 <div className="min-w-0">
//                   <label
//                     htmlFor="terms"
//                     className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
//                   >
//                     I have read and agree to Nexoleolite's Terms and Conditions
//                     and Privacy Policy.
//                   </label>

//                   <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
//                     <Link
//                       to={ABOUT_TERMS_URL}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 text-brand-orange hover:underline"
//                     >
//                       <FileText className="h-4 w-4" />
//                       Read Terms and Conditions
//                     </Link>

//                     <Link
//                       to={PRIVACY_POLICY_URL}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 text-brand-orange hover:underline"
//                     >
//                       <ShieldCheck className="h-4 w-4" />
//                       Read Privacy Policy
//                     </Link>
//                   </div>

//                   <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
//                     For your safety, never send money to another user's
//                     personal bank account for a transaction claimed to be
//                     officially processed by Nexoleolite. Only use an official
//                     payment channel when Nexoleolite expressly provides or
//                     authorizes one, and verify the payment instructions before
//                     paying.
//                   </p>
//                 </div>
//               </div>

//               {errors.terms && (
//                 <p id="terms-error" className="text-red-500 text-xs mt-2">
//                   {errors.terms.message}
//                 </p>
//               )}

//               {termsAccepted && (
//                 <p className="text-green-600 dark:text-green-400 text-xs mt-2">
//                   <Check className="inline h-3 w-3 mr-1" />
//                   You have accepted the Terms and Conditions and Privacy Policy.
//                 </p>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                   Creating account...
//                 </div>
//               ) : (
//                 'Create Account'
//               )}
//             </button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600" />
//               </div>

//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             {/* Google Signup */}
//             <button
//               type="button"
//               onClick={handleGoogleSignup}
//               className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//             >
//               <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.3 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.73.37 3.37 1.18 4.93l3.66-2.84z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>

//               <span className="text-gray-700 dark:text-gray-300">
//                 Sign up with Google
//               </span>
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
//             Already have an account?{' '}
//             <Link
//               to="/signin"
//               className="text-brand-orange hover:underline font-semibold"
//             >
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// src/pages/auth/SignUp.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Your full name must contain at least 2 characters.')
      .max(100, 'Your name is too long.'),

    username: z
      .string()
      .trim()
      .min(3, 'Username must contain at least 3 characters.')
      .max(30, 'Username cannot exceed 30 characters.')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can contain only letters, numbers, and underscores.'
      ),

    email: z.string().trim().email('Please enter a valid email address.'),

    phone: z
      .string()
      .trim()
      .min(7, 'Please enter a valid phone number.')
      .max(20, 'Phone number is too long.'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),

    confirm_password: z.string(),

    terms: z.boolean().refine((accepted) => accepted, {
      message: 'You must accept the Terms and Conditions and Privacy Policy.',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false,
    },
  });

  const acceptedTerms = watch('terms');

  // Close the policy modal with Escape and lock background scrolling.
  useEffect(() => {
    if (!activePolicy) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActivePolicy(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePolicy]);

  const openPolicy = (policy) => setActivePolicy(policy);
  const closePolicy = () => setActivePolicy(null);

  // EMAIL SIGNUP
  const onSubmit = async (formData) => {
    setServerError('');
    setIsSubmitting(true);

    try {
      const fullName = formData.name.trim();
      const nameParts = fullName.split(/\s+/);

      if (nameParts.length < 2) {
        throw new Error(
          'Please enter both your first name and last name.'
        );
      }

      // These field names match the FastAPI UserCreate model.
      const payload = {
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' '),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      if (typeof signup !== 'function') {
        throw new Error(
          'Signup is not configured in your authentication hook.'
        );
      }

      const result = await signup(payload);

      if (result === false || result?.success === false) {
        throw new Error(
          result?.error || 'Registration failed. Please try again.'
        );
      }

      // The backend sends the OTP during signup.
      navigate('/verify-otp', {
        state: { email: payload.email },
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Unable to create your account. Please try again.';

      setServerError(
        Array.isArray(message)
          ? message.map((item) => item.msg || String(item)).join(' ')
          : String(message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // GOOGLE SIGNUP
  // The authentication hook must obtain or receive a real Google ID token.
  const handleGoogleSignup = async () => {
    setServerError('');

    if (!acceptedTerms) {
      setServerError(
        'Please accept the Terms and Conditions and Privacy Policy before continuing with Google.'
      );
      return;
    }

    if (typeof googleLogin !== 'function') {
      setServerError(
        'Google signup is not configured in your authentication hook.'
      );
      return;
    }

    setIsGoogleSubmitting(true);

    try {
      // Do not call the backend without an ID token.
      // Your Google integration must supply this token.
      await googleLogin();
    } catch (error) {
      setServerError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Google signup failed. Please try again.'
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">

        {/* BRAND */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
              <UserPlus size={25} />
            </span>

            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Nexoleolite
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Join Nexoleolite to discover products, connect with vendors, and
            explore opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">

          {/* SERVER ERROR */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{serverError}</span>
            </div>
          )}

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting || isGoogleSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.9 13.72 17.48 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 38.08 46.98 31.89 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M9.99 28.59A14.4 14.4 0 0 1 9.22 24c0-1.59.27-3.13.76-4.59L2.01 13.22A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l7.41-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.52 0-12.1-4.22-14.01-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
            )}

            {isGoogleSubmitting
              ? 'Connecting to Google...'
              : 'Continue with Google'}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Or sign up with email
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* EMAIL SIGNUP FORM */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* FULL NAME */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your first and last name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass(errors.name)}
                  {...register('name')}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* USERNAME */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  aria-invalid={Boolean(errors.username)}
                  className={inputClass(errors.username)}
                  {...register('username')}
                />
              </div>

              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass(errors.email)}
                  {...register('email')}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  aria-invalid={Boolean(errors.phone)}
                  className={inputClass(errors.phone)}
                  {...register('phone')}
                />
              </div>

              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  aria-invalid={Boolean(errors.password)}
                  className={`${inputClass(errors.password)} pr-12`}
                  {...register('password')}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">
                  At least 8 characters, with uppercase and lowercase letters
                  and a number.
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-5">
              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  aria-invalid={Boolean(errors.confirm_password)}
                  className={`${inputClass(errors.confirm_password)} pr-12`}
                  {...register('confirm_password')}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirm_password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* TERMS AND PRIVACY */}
            <div className="mb-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  aria-invalid={Boolean(errors.terms)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
                  {...register('terms')}
                />

                <span className="text-sm leading-6 text-gray-600">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={() => openPolicy('terms')}
                    className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => openPolicy('privacy')}
                    className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {errors.terms && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* SECURITY MESSAGE */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-orange-50 p-3.5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-orange-600"
              />
              <p className="text-xs leading-5 text-gray-600">
                Protect your account details. Never share your password or
                verification codes with anyone.
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  <CheckCircle size={19} />
                  Create account
                </>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By creating an account, you agree to follow Nexoleolite's platform
          rules and use the marketplace responsibly.
        </p>

        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => openPolicy('terms')}
            className="hover:text-orange-600"
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() => openPolicy('privacy')}
            className="hover:text-orange-600"
          >
            Privacy
          </button>

          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
        </div>
      </div>

      {/* TERMS AND PRIVACY MODAL */}
      {activePolicy && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePolicy();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-modal-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  {activePolicy === 'terms' ? (
                    <FileText size={21} />
                  ) : (
                    <ShieldCheck size={21} />
                  )}
                </span>

                <div>
                  <h2
                    id="policy-modal-title"
                    className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl"
                  >
                    {activePolicy === 'terms'
                      ? 'Terms and Conditions'
                      : 'Privacy Policy'}
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nexoleolite
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePolicy}
                aria-label="Close policy"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:px-7 sm:py-6">
              {activePolicy === 'terms' ? (
                <div className="space-y-5">
                  <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
                    Please review these draft terms. They should be checked
                    against Nexoleolite's actual features and business policies
                    before publication.
                  </p>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      1. About Nexoleolite
                    </h3>
                    <p>
                      Nexoleolite helps users discover products, connect with
                      vendors, and explore property listings and other
                      opportunities available on the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      2. Creating an account
                    </h3>
                    <p>
                      You agree to provide accurate information when registering
                      and to keep your account details secure. You are
                      responsible for activity carried out through your
                      account. Contact the platform if you suspect unauthorized
                      access.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      3. Buyers, vendors, and property listings
                    </h3>
                    <p>
                      Vendors and property listers must provide honest and
                      accurate descriptions and must have authority to offer
                      the items or properties they advertise. Buyers should
                      verify prices, availability, ownership, delivery
                      arrangements, and other transaction details before
                      committing.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      4. Responsible use
                    </h3>
                    <p>
                      Do not use Nexoleolite for fraud, impersonation,
                      harassment, unlawful content, misleading listings,
                      unauthorized access, malicious software, or interference
                      with the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      5. Communication and transactions
                    </h3>
                    <p>
                      Communicate respectfully and take precautions before
                      sending money or sharing sensitive information. Unless a
                      particular service expressly states otherwise, do not
                      assume Nexoleolite has verified every seller, buyer,
                      listing, payment, delivery, or property.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      6. Content and intellectual property
                    </h3>
                    <p>
                      You must have the rights or permissions needed to upload
                      product images, descriptions, property photographs,
                      logos, and other content. You retain rights you already
                      hold in your content while permitting its use as
                      reasonably necessary to operate and display the service,
                      subject to applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      7. Listings and account restrictions
                    </h3>
                    <p>
                      Nexoleolite may review reported content and take
                      appropriate action against suspected fraud, abusive
                      behavior, or violations of these terms, subject to
                      applicable law and any published appeal procedure.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      8. Service availability and changes
                    </h3>
                    <p>
                      Features may change or become temporarily unavailable for
                      maintenance or other reasons. Material changes to these
                      terms should be communicated where required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      9. Applicable law and contact
                    </h3>
                    <p>
                      Before publishing this section, the platform owner
                      should specify the applicable governing law,
                      dispute-resolution process, and official contact details
                      for questions and complaints.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
                    This is a draft privacy notice. Update it to reflect the
                    information Nexoleolite actually collects, its connected
                    services, and its data-retention practices.
                  </p>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      1. Information you provide
                    </h3>
                    <p>
                      When you register or use the platform, information may
                      include your name, username, email, phone number,
                      account details, profile information, listings, and
                      messages or enquiries you submit.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      2. Technical and usage information
                    </h3>
                    <p>
                      Depending on the platform's configuration, technical
                      information may be processed to operate the service,
                      protect accounts, diagnose errors, prevent abuse, and
                      understand feature performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      3. How information is used
                    </h3>
                    <p>
                      Information may be used to maintain accounts, provide
                      requested features, display listings, facilitate
                      communication, verify accounts, respond to support
                      requests, protect the platform, and meet legal
                      obligations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      4. Information visible to other users
                    </h3>
                    <p>
                      Information you publish in public profiles or listings
                      may be visible to other users. Messages may be visible to
                      their recipients. Avoid publishing information you do not
                      want others to see.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      5. Service providers and sharing
                    </h3>
                    <p>
                      Information may be processed by service providers used
                      for hosting, databases, authentication, email, storage,
                      or payments. The final policy should identify the actual
                      providers and explain relevant sharing practices.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      6. Storage and security
                    </h3>
                    <p>
                      Appropriate safeguards should protect personal
                      information against unauthorized access, loss, misuse,
                      or disclosure. No online service can promise absolute
                      security.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      7. Retention and your choices
                    </h3>
                    <p>
                      Information should be retained only as long as necessary
                      for the purposes described in the final policy, subject
                      to legal requirements. Depending on applicable law, you
                      may have rights to access, correct, or request deletion
                      of your personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      8. Cookies and third-party services
                    </h3>
                    <p>
                      Cookies or similar technologies may be used if enabled
                      for authentication, preferences, security, or analytics.
                      External services may have their own privacy practices.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      9. Children's privacy
                    </h3>
                    <p>
                      The published policy should state the platform's minimum
                      account age and explain how information relating to
                      children is handled in accordance with applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      10. Updates and privacy enquiries
                    </h3>
                    <p>
                      The final policy should include an effective date and an
                      official contact method for privacy requests, complaints,
                      and questions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/70 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please review the policy before accepting it.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openPolicy(
                      activePolicy === 'terms' ? 'privacy' : 'terms'
                    )
                  }
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Read {activePolicy === 'terms' ? 'Privacy Policy' : 'Terms'}
                </button>

                <button
                  type="button"
                  onClick={closePolicy}
                  className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
