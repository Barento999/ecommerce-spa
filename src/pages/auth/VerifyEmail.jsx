import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiCheckCircle, FiFrown } from 'react-icons/fi';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendVerificationEmail, user } = useAuth();
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [error, setError] = useState('');
  
  const email = location.state?.email || (user ? user.email : '');
  
  const handleResendEmail = async () => {
    if (!email) return;
    
    try {
      setStatus('sending');
      const { success, message } = await sendVerificationEmail();
      
      if (success) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(message);
      }
    } catch (err) {
      setStatus('error');
      setError('An unexpected error occurred. Please try again.');
      console.error('Failed to send verification email:', err);
    }
  };

  // If user is already verified, redirect to home
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to verify your email address.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiMail className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification link to{' '}
          <span className="font-medium text-indigo-600">{email}</span>
        </p>

        {status === 'sent' && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  A new verification email has been sent. Please check your inbox.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiFrown className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error || 'Failed to send verification email. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleResendEmail}
            disabled={status === 'sending'}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              status === 'sending'
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {status === 'sending' ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            Already verified?{' '}
            <button
              onClick={() => window.location.reload()}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Refresh the page
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
