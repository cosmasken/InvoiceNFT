import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User as UserIcon } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Profile() {
  const user = useStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="relative h-32 bg-indigo-600">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 capitalize">{user.role}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Balance
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">${user.walletBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Update Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}