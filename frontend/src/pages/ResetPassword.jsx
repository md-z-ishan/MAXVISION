import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { uid: paramUid, token: paramToken } = useParams();
  const navigate = useNavigate();

  const [uid, setUid] = useState(paramUid || '');
  const [token, setToken] = useState(paramToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('auth/password-reset/confirm/', {
        uid: uid.trim(),
        token: token.trim(),
        new_password: newPassword
      });
      setMessage(res.data.message || 'Password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired token. Please request a new link.');
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
          <h2 className="text-2xl font-black text-primary">Set New Password</h2>
          <p className="mt-2 text-xs text-gray-600">
            Enter your reset credentials and choose a strong new password.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs font-semibold mb-4 leading-relaxed">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              User ID Token (UID)
            </label>
            <input
              type="text"
              required
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g. MTI="
              className="w-full border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Security Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste security token from email/console..."
              className="w-full border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength="6"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength="6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-bold py-3 rounded-xl hover:bg-teal-600 transition shadow-md disabled:opacity-50 text-sm mt-2"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

