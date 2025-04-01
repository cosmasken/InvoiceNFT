import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import type { Transaction, TransactionStatus } from '../types';

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    status: 'completed',
    amount: 5000,
    currency: 'USD',
    timestamp: '2024-03-01T10:30:00Z',
    description: 'Purchase of Invoice #1234',
    fromAddress: '0x1234...5678',
    toAddress: '0x8765...4321',
    txHash: '0xabcd...efgh',
    fee: 2.5,
    invoiceId: '1234',
    units: 50
  },
  {
    id: '2',
    type: 'deposit',
    status: 'pending',
    amount: 10000,
    currency: 'USD',
    timestamp: '2024-03-02T15:45:00Z',
    description: 'Deposit to wallet',
    fromAddress: '0x9876...5432',
    toAddress: '0x2345...6789',
    txHash: '0xijkl...mnop',
    fee: 1.5
  },
  {
    id: '3',
    type: 'withdrawal',
    status: 'failed',
    amount: 3000,
    currency: 'USD',
    timestamp: '2024-03-03T09:15:00Z',
    description: 'Withdrawal attempt',
    fromAddress: '0x3456...7890',
    toAddress: '0x7890...1234',
    txHash: '0xqrst...uvwx',
    fee: 1.0
  }
];

const statusColors: Record<TransactionStatus, { bg: string; text: string; icon: React.ComponentType }> = {
  completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
};

export default function Transactions() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => {
            const StatusIcon = statusColors[transaction.status].icon;
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/transactions/${transaction.id}`)}
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
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}
                      {transaction.currency} {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fee: {transaction.currency} {transaction.fee}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                    statusColors[transaction.status].bg
                  }`}>
                    <StatusIcon className={`w-4 h-4 ${statusColors[transaction.status].text}`} />
                    <span className={`text-sm font-medium ${statusColors[transaction.status].text}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}