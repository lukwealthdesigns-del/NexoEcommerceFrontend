// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';
// import { authService } from '../../services/auth';
// import toast from 'react-hot-toast';

// const signInSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(1, 'Please enter your password'),
// });

// const SignIn = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState('');
//   const [errorEmail, setErrorEmail] = useState('');
//   const navigate = useNavigate();
//   const { setUser } = useAuthStore();

//   const { register, handleSubmit, formState: { errors }, watch } = useForm({
//     resolver: zodResolver(signInSchema),
//   });

//   const currentEmail = watch('email');

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     setLoginError('');
//     setErrorEmail('');
    
//     try {
//       const response = await authService.signIn(data.email, data.password);
//       setUser(response.user);
//       toast.success('Welcome back!');
      
//       if (response.user.role === 'super_admin') {
//         navigate('/super-admin');
//       } else if (response.user.role === 'admin') {
//         navigate('/admin');
//       } else {
//         navigate('/dashboard');
//       }
//     } catch (error) {
//       console.error('Signin error:', error);
      
//       // Get status code and error message
//       const statusCode = error.response?.status;
//       const errorDetail = error.response?.data?.detail || error.message;
      
//       // Handle different error types with user-friendly messages
//       if (statusCode === 404) {
//         setLoginError("We couldn't connect to the server. Please make sure the backend is running.");
//         toast.error("Server connection failed. Please try again later.");
//       } else if (statusCode === 401) {
//         if (errorDetail === "USER_NOT_FOUND" || errorDetail === "Invalid email or password" || errorDetail?.includes("not found")) {
//           setLoginError("No account found with this email address.");
//           setErrorEmail(data.email);
//           toast.error("Account not found. Please check your email or sign up.");
//         } else if (errorDetail === "INVALID_PASSWORD") {
//           setLoginError("Incorrect password. Please try again.");
//           toast.error("Wrong password. Please check and try again.");
//         } else if (errorDetail === "EMAIL_NOT_VERIFIED" || errorDetail?.includes("verified")) {
//           setLoginError("Please verify your email address before logging in. Check your inbox for the verification code.");
//           toast.error("Email not verified. Please check your inbox.");
//           setTimeout(() => {
//             navigate('/verify-otp', { state: { email: data.email } });
//           }, 2000);
//         } else {
//           setLoginError("Invalid email or password. Please try again.");
//           toast.error("Invalid email or password");
//         }
//       } else if (statusCode === 403) {
//         setLoginError("Your account has been suspended. Please contact support for assistance.");
//         toast.error("Account suspended. Contact support.");
//       } else if (statusCode === 500) {
//         setLoginError("Server error. Please try again later or contact support.");
//         toast.error("Server error. Please try again.");
//       } else {
//         setLoginError("Unable to sign in. Please check your internet connection and try again.");
//         toast.error("Login failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
//           {/* Login Error Display */}
//           {loginError && (
//             <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
//               <div className="flex items-start space-x-3">
//                 <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
//                   {loginError.includes("No account found") && errorEmail && (
//                     <div className="mt-3">
//                       <Link 
//                         to="/signup" 
//                         state={{ prefillEmail: errorEmail }}
//                         className="inline-flex items-center space-x-2 text-sm text-brand-orange hover:underline"
//                       >
//                         <UserPlus className="h-4 w-4" />
//                         <span>Create a new account with {errorEmail}</span>
//                       </Link>
//                     </div>
//                   )}
//                   {loginError.includes("Incorrect password") && (
//                     <div className="mt-3">
//                       <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline">
//                         Forgot your password? Reset it here →
//                       </Link>
//                     </div>
//                   )}
//                   {loginError.includes("verify your email") && (
//                     <div className="mt-3">
//                       <Link to="/verify-otp" className="text-sm text-brand-orange hover:underline">
//                         Go to verification page →
//                       </Link>
//                     </div>
//                   )}
//                   {loginError.includes("connect to the server") && (
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
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email Address
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

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   {...register('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
//                   placeholder="Enter your password"
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
//             </div>

//             <div className="flex justify-end">
//               <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline">
//                 Forgot Password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
//               </div>
//             </div>

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
//               <span className="text-gray-700 dark:text-gray-300">Sign in with Google</span>
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-brand-orange hover:underline font-semibold">
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const currentEmail = watch('email');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    setErrorEmail('');
    
    console.log('Attempting login with:', { email: data.email });
    
    try {
      const response = await authService.signIn(data.email, data.password);
      console.log('Login response:', response);
      
      if (response.user) {
        setUser(response.user);
        toast.success(`Welcome back, ${response.user.first_name || response.user.username}!`);
        
        // Redirect based on role
        if (response.user.role === 'super_admin') {
          navigate('/super-admin');
        } else if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setLoginError('Invalid response from server');
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Signin error:', error);
      console.error('Error response:', error.response?.data);
      
      const statusCode = error.response?.status;
      const errorDetail = error.response?.data?.detail;
      
      if (statusCode === 404) {
        setLoginError("Unable to connect to server. Please make sure the backend is running on port 8080.");
        toast.error("Server connection failed");
      } else if (statusCode === 401) {
        if (errorDetail === "USER_NOT_FOUND" || errorDetail === "Invalid email or password") {
          setLoginError("No account found with this email address.");
          setErrorEmail(data.email);
          toast.error("Account not found");
        } else if (errorDetail === "INVALID_PASSWORD") {
          setLoginError("Incorrect password. Please try again.");
          toast.error("Wrong password");
        } else if (errorDetail === "EMAIL_NOT_VERIFIED") {
          setLoginError("Please verify your email address before logging in.");
          toast.error("Email not verified");
          setTimeout(() => {
            navigate('/verify-otp', { state: { email: data.email } });
          }, 2000);
        } else {
          setLoginError(errorDetail || "Invalid email or password");
          toast.error("Login failed");
        }
      } else if (statusCode === 403) {
        setLoginError("Your account has been suspended. Please contact support.");
        toast.error("Account suspended");
      } else {
        setLoginError("Login failed. Please try again.");
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Login Error Display */}
          {loginError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
                  {loginError.includes("No account found") && errorEmail && (
                    <div className="mt-3">
                      <Link 
                        to="/signup" 
                        className="inline-flex items-center space-x-2 text-sm text-brand-orange hover:underline"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Create a new account with {errorEmail}</span>
                      </Link>
                    </div>
                  )}
                  {loginError.includes("Incorrect password") && (
                    <div className="mt-3">
                      <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline">
                        Forgot your password? Reset it here →
                      </Link>
                    </div>
                  )}
                  {loginError.includes("verify your email") && (
                    <div className="mt-3">
                      <Link to="/verify-otp" className="text-sm text-brand-orange hover:underline">
                        Go to verification page →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
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
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-brand-orange hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

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
              <span className="text-gray-700 dark:text-gray-300">Sign in with Google</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-orange hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;