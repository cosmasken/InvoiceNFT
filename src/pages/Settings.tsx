import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Wallet, Moon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span>Email Notifications</span>
              </div>
              <input type="checkbox" className="rounded text-indigo-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span>Push Notifications</span>
              </div>
              <input type="checkbox" className="rounded text-indigo-600" defaultChecked />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <button className="flex items-center gap-3 text-gray-700 hover:text-gray-900">
              <Lock className="w-5 h-5" />
              Change Password
            </button>
            <button className="flex items-center gap-3 text-gray-700 hover:text-gray-900">
              <Wallet className="w-5 h-5" />
              Connected Wallets
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span>Dark Mode</span>
              </div>
              <input type="checkbox" className="rounded text-indigo-600" />
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}