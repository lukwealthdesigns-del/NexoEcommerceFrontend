import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

const VerifyResetOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('reset_password_email');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('reset_password_email', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error('No email found for password reset');
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    console.log('Verifying OTP:', otpCode, 'for email:', email);
    setLoading(true);
    
    try {
      const response = await authService.verifyResetOTP(email, otpCode);
      console.log('Full response from backend:', response);
      console.log('Reset token received:', response.reset_token);
      
      if (response.reset_token) {
        toast.success('OTP verified! Please enter your new password.');
        console.log('Navigating to reset-password with token:', response.reset_token);
        navigate('/reset-password', { 
          state: { 
            email: email, 
            resetToken: response.reset_token 
          } 
        });
      } else {
        console.error('No reset_token in response:', response);
        toast.error('Server did not return a reset token');
      }
    } catch (error) {
      console.error('Verification error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    try {
      await authService.forgotPassword(email);
      toast.success('New verification code sent! Check your terminal for the OTP.');
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Reset Code</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter the 6-digit code sent to
            </p>
            <p className="text-sm font-medium text-brand-orange mt-1">{email}</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-orange focus:ring-2 focus:ring-brand-orange dark:bg-gray-700 dark:text-white"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="btn-primary w-full py-3 mb-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendDisabled}
                className="text-brand-orange hover:underline font-medium disabled:opacity-50"
              >
                Resend {resendDisabled && `(${countdown}s)`}
              </button>
            </p>
          </div>

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

export default VerifyResetOTP;