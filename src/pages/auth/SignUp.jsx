

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

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const signUpSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),
  confirm_password: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the Terms & Conditions'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errorType, setErrorType] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false,
    }
  });

  const password = watch('password');
  const confirmPassword = watch('confirm_password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setErrorType('');
    
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirm_password,
    };
    
    try {
      const response = await authService.signUp(payload);
      
      toast.success('Verification code sent! Check your email.');
      localStorage.setItem('pending_verification_email', data.email);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (error) {
      console.error('Signup error:', error);
      
      const statusCode = error.response?.status;
      const errorDetail = error.response?.data?.detail;
      
      // Handle different error types with user-friendly messages
      if (statusCode === 404) {
        setServerError("Unable to connect to the server. Please make sure the backend is running.");
        setErrorType('connection');
        toast.error("Server connection failed. Please try again later.");
      } else if (statusCode === 400) {
        if (typeof errorDetail === 'string') {
          if (errorDetail.includes('already exists') || errorDetail.includes('User with this email or username already exists')) {
            setServerError("An account with this email address or username already exists.");
            setErrorType('exists');
            toast.error("Account already exists. Please login instead.");
          } else if (errorDetail.includes('password')) {
            setServerError("Password doesn't meet requirements. Please check the password guidelines.");
            setErrorType('password');
            toast.error("Password requirements not met.");
          } else {
            setServerError(errorDetail);
            setErrorType('validation');
            toast.error(errorDetail);
          }
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          const firstError = errorDetail[0];
          const errorMsg = firstError?.msg || 'Please check your information and try again.';
          setServerError(errorMsg);
          setErrorType('validation');
          toast.error(errorMsg);
        } else {
          setServerError("Please check all fields and try again.");
          setErrorType('validation');
          toast.error("Invalid information. Please check your entries.");
        }
      } else if (statusCode === 500) {
        setServerError("Server error. Please try again later or contact support.");
        setErrorType('server');
        toast.error("Server error. Please try again.");
      } else {
        setServerError("Unable to create account. Please check your internet connection and try again.");
        setErrorType('general');
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Join NexoLeolite today</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Server Error Display */}
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
                  {errorType === 'exists' && (
                    <div className="mt-3">
                      <Link 
                        to="/signin" 
                        className="inline-flex items-center space-x-2 text-sm text-brand-orange hover:underline"
                      >
                        <span>→</span>
                        <span>Login to your existing account</span>
                      </Link>
                    </div>
                  )}
                  {errorType === 'connection' && (
                    <div className="mt-3">
                      <button 
                        onClick={() => window.location.reload()} 
                        className="text-sm text-brand-orange hover:underline"
                      >
                        Refresh page and try again →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('first_name')}
                  type="text"
                  className={`input-field pl-10 ${errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('last_name')}
                  type="text"
                  className={`input-field pl-10 ${errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username *
              </label>
              <input
                {...register('username')}
                type="text"
                className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="johndoe123"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={watch('phone')}
                onChange={(value) => setValue('phone', value || '')}
                className="phone-input"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must have: 8+ characters, uppercase, lowercase, number & special character (!@#$%^&*)
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-green-500 text-xs mt-1 flex items-center">
                  <Check className="h-3 w-3 mr-1" /> ✓ Passwords match
                </p>
              )}
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 h-4 w-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => window.open('/terms', '_blank')}
                  className="text-brand-orange hover:underline"
                >
                  Terms & Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => window.open('/privacy', '_blank')}
                  className="text-brand-orange hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Sign up with Google</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-brand-orange hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;