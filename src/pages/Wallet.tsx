import React from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { useStore } from '../store/useStore';

const transactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    date: '2024-03-01',
    status: 'completed'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 2000,
    date: '2024-03-02',
    status: 'completed'
  },
  {
    id: '3',
    type: 'stake',
    amount: 3000,
    date: '2024-03-03',
    status: 'completed'
  }
];

export default function Wallet() {
  const user = useStore(state => state.user);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <WalletIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Available Balance</h2>
              <p className="text-sm text-gray-500">Total funds available in your wallet</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${user.walletBalance.toLocaleString()}</p>
          <div className="mt-4 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <ArrowUpRight className="w-4 h-4" />
              Deposit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <ArrowDownRight className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Staked Amount</h2>
              <p className="text-sm text-gray-500">Total funds staked in pools</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${user.stakedAmount.toLocaleString()}</p>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Current APY: <span className="text-green-600 font-semibold">8.2%</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'deposit' ? 'bg-green-100' : 
                  transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowUpRight className={`w-4 h-4 ${
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  ) : transaction.type === 'withdrawal' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'deposit' ? 'text-green-600' :
                  transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}