// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Mail, ArrowLeft } from 'lucide-react';
// import { authService } from '../../services/auth';
// import toast from 'react-hot-toast';

// const forgotSchema = z.object({
//   email: z.string().email('Invalid email address'),
// });

// const ForgotPassword = () => {
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(forgotSchema),
//   });

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       await authService.forgotPassword(data.email);
//       setIsSubmitted(true);
//       toast.success('Reset link sent to your email!');
//     } catch (error) {
//       toast.error(error.response?.data?.detail || 'Failed to send reset link');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
//         <div className="max-w-md mx-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Mail className="h-8 w-8 text-green-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               We've sent a password reset link to your email address. The link will expire in 15 minutes.
//             </p>
//             <Link to="/signin" className="btn-primary inline-block">
//               Return to Sign In
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         <Link to="/signin" className="inline-flex items-center text-brand-orange mb-6 hover:underline">
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Sign In
//         </Link>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Enter your email address and we'll send you a link to reset your password.
//             </p>
//           </div>

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
//                   className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full py-3"
//             >
//               {isLoading ? 'Sending...' : 'Send Reset Link'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      // Redirect to OTP verification page instead of showing success message
      navigate('/verify-reset-otp', { state: { email: data.email } });
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We've sent a verification code to <br />
              <span className="font-semibold text-brand-orange">{submittedEmail}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Enter the code on the next page to reset your password.
            </p>
            <button
              onClick={() => navigate('/verify-reset-otp', { state: { email: submittedEmail } })}
              className="btn-primary inline-block"
            >
              Enter Verification Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link to="/signin" className="inline-flex items-center text-brand-orange mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a verification code.
            </p>
          </div>

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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Remember your password?{' '}
            <Link to="/signin" className="text-brand-orange hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;