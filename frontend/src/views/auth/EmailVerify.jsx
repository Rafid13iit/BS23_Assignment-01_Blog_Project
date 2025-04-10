import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { verifyOtpSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const EmailVerify = () => {
  const { verifyEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: { email }
  });

  // Get email from localStorage if available
  React.useEffect(() => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setEmail(parsedUserData.email || '');
      }
    } catch (error) {
      console.error('Error retrieving email:', error);
    }
  }, []);

  const onSubmit = async (data) => {
    await verifyEmail(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                {...register('email')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input
                id="email_otp"
                type="text"
                {...register('email_otp')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
              />
              {errors.email_otp && (
                <p className="mt-1 text-sm text-red-600">{errors.email_otp.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? <LoadingSpinner /> : 'Verify Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;