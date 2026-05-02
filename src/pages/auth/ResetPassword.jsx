import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const resetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    }
  });

  const resetToken = location.state?.resetToken;
  const email = location.state?.email;

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error('Invalid reset token. Please restart the password reset process.');
      setTimeout(() => navigate('/forgot-password'), 2000);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, data.password);
      setIsSuccess(true);
      toast.success('Password reset successfully! Please login with your new password.');
      
      // Clear stored data
      localStorage.removeItem('reset_password_email');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error('Reset error:', error);
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen - redirects to login
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your password has been reset successfully.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Redirecting you to login page...
            </p>
            <Link 
              to="/signin" 
              className="btn-primary inline-block"
            >
              Go to Sign In Now
            </Link>
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
            <div className="mx-auto w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-brand-orange" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Password</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your new password below.
            </p>
            {email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                For: <span className="text-brand-orange">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your new password"
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
              {watch('password') && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`h-1 flex-1 rounded-full ${watch('password').length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(watch('password')) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[a-z]/.test(watch('password')) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(watch('password')) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(watch('password')) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use 8+ characters with uppercase, lowercase, number & special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
              )}
              {watch('confirm_password') && watch('password') === watch('confirm_password') && watch('password') && (
                <p className="text-green-500 text-xs mt-1 flex items-center">
                  ✓ Passwords match
                </p>
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
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signin" className="text-sm text-gray-500 hover:text-brand-orange">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;