import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function UserTypeSelection() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const handleRoleSelect = async (role: 'buyer' | 'seller') => {
    if (!user) return; // Shouldn't happen, but safety check

    // Optionally persist role to backend if needed
    const token = localStorage.getItem('token');
    try {
      // Assuming you add a backend endpoint to update user profile
      await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT', // Add this endpoint to your backend if needed
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
    } catch (err) {
      console.error('Failed to persist role:', err);
    }

    setUser({
      ...user,
      role,
      name: user.name || 'User',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      walletBalance: user.walletBalance || 0,
      stakedAmount: user.stakedAmount || 0,
    });

    navigate(role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to InvoiceNFT</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('buyer')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:border-indigo-500 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <Store className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">I'm a Buyer</h2>
            <p className="text-gray-600">Browse and purchase tokenized invoices from the marketplace</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect('seller')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:border-indigo-500 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">I'm a Seller</h2>
            <p className="text-gray-600">Upload and tokenize your invoices to receive early payments</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}