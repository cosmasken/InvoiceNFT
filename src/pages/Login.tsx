/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Mail, Lock, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, setUser, setWalletAddress } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'wallet'>('email');
  const [error, setError] = useState<string | null>(null);

  

// Backend API URL (adjust as needed)
const API_URL =  'https://hedera-invoicenft-backend.onrender.com/api/auth';
// const API_URL = 'http://localhost:5000/api/auth';

const loginWithEmail = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`${API_URL}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const { token, userId } = await response.json();
    localStorage.setItem('token', token);

    // const profileResponse = await fetch(`${API_URL}/profile`, {
    //   headers: { 'Authorization': `Bearer ${token}` },
    // });
    // const userData = await profileResponse.json();

    setUser({
      id: userId,
      email:  email,
      walletAddress: '',
      name: 'User',
      role: null, // Role will be set in UserTypeSelection
      avatar: '',
      walletBalance: 0,
      stakedAmount: 0,
      onboardingCompleted: false,
    });
    navigate('/select-type');

    //navigate(userData.wallet_address ? '/select-type' : '/link-account');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};

const loginWithMetaMask = async () => {
  setIsLoading(true);
  setError(null);

  try {
    if (!window.ethereum) throw new Error('MetaMask not detected');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    const message = 'Login to Invoice NFT Marketplace';
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    const response = await fetch(`${API_URL}/metamask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message }),
    });

    if (!response.ok) throw new Error('MetaMask login failed');

    const { token, userId } = await response.json();
    localStorage.setItem('token', token);

    const profileResponse = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const userData = await profileResponse.json();

    setUser({
      id: userId,
      email: userData.email,
      walletAddress: address,
      name: 'User',
      role: null, // Role will be set in UserTypeSelection
      avatar: '',
      walletBalance: 0,
      stakedAmount: 0,
      onboardingCompleted: !userData.email,
    });

    navigate(userData.email ? '/select-type' : '/link-account');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'email'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-500 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'wallet'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-500 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
        </div>

        {activeTab === 'email' ? (
          <form onSubmit={loginWithEmail} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <button
              onClick={loginWithMetaMask}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="w-5 h-5"
              />
              Connect with MetaMask
            </button>

            {/* <button
              onClick={handleWalletConnect}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                src="https://registry.walletconnect.com/api/v1/logo/lg/c57ca95b-5b39-46c3-bac8-ec23d8d5c45c"
                alt="WalletConnect"
                className="w-5 h-5"
              />
              Connect with WalletConnect
            </button> */}

            {/* <button
              onClick={handleWalletConnect}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Wallet className="w-5 h-5" />
              Connect with Blade
            </button> */}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}