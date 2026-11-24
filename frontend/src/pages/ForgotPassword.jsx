import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('auth/password-reset/', { email });
      setMessage(res.data.message || 'If an account exists, a password reset link has been dispatched.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-primary">Reset Password</h2>
          <p className="mt-2 text-xs text-gray-600">
            Enter your registered email address to receive a secure password reset token.
          </p>
        </div>

        {message && (
          <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-xl text-xs font-semibold mb-4 leading-relaxed">
            {message}
            <div className="mt-2 pt-2 border-t border-teal-200">
              <span className="font-bold">Next step: </span>
              <Link to="/reset-password" className="underline font-black text-secondary">
                Enter your token & set a new password here
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-bold py-3 rounded-xl hover:bg-teal-600 transition shadow-md disabled:opacity-50 text-sm"
          >
            {loading ? 'Sending Request...' : 'Send Password Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
          <div>
            Remember your password?{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

