import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification, 3: New password

  // Pre-fill email if user is logged in
  useState(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setMessage('');

      await axios.post(`${config.apiUrl}/api/password-reset/forgot-password`, { email });

      setIsSuccess(true);
      setMessage('If an account with that email exists, a password reset OTP has been sent.');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.error('Error requesting password reset OTP:', err);
      setIsSuccess(false);
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setMessage('');

      const response = await axios.post(`${config.apiUrl}/api/password-reset/verify-otp`, {
        email,
        otp
      });

      // Store the token if provided
      if (response.data.token) {
        localStorage.setItem('resetToken', response.data.token);
      }

      setIsSuccess(true);
      setMessage('OTP verified successfully. Please set your new password.');

      // Reset isSuccess and clear message when moving to password reset step
      setTimeout(() => {
        setIsSuccess(false);
        setMessage(''); // Clear the success message
        setStep(3); // Move to password reset step
      }, 1500);
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setIsSuccess(false);
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setMessage('');

      // Make sure we have the OTP from the previous step
      if (!otp) {
        setError('OTP is missing. Please go back and verify your OTP again.');
        setIsSubmitting(false);
        return;
      }

      // Create a clean axios instance without any default headers
      const axiosInstance = axios.create();
      delete axiosInstance.defaults.headers.common['Authorization'];

      const response = await axiosInstance.post(
        `${config.apiUrl}/api/password-reset/reset-password-with-otp`,
        {
          email,
          otp,
          password
        }
      );

      setIsSuccess(true);
      setMessage('Your password has been reset successfully! You can now log in with your new password.');
      toast.success('Password reset successful!');

      // Clear form
      setPassword('');
      setConfirmPassword('');
      setOtp('');

      // Return to step 1 after a delay
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setIsSuccess(false);

      // More specific error messages
      if (err.response?.status === 500) {
        setError('Server error. Please try again later or contact support.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid request. Please check your information and try again.');
      } else if (err.response?.status === 401) {
        setError('Authentication error. Please try requesting a new password reset.');
      } else if (err.code === 'ECONNABORTED' || !err.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.message || 'An error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-800">
          <h3 className="text-lg leading-6 font-medium text-white">Reset Password</h3>
          <p className="mt-1 max-w-2xl text-sm text-primary-200">
            Reset your password using OTP verification
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {isSuccess && message && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{message}</p>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleRequestOTP}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md text-center tracking-widest"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  disabled={isSubmitting}
                  maxLength={6}
                />
                <p className="mt-2 text-xs text-gray-500">
                  A 6-digit OTP has been sent to {email}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6}
                  className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !password || !confirmPassword}
                  className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
