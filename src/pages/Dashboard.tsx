import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Users, Activity, FileText } from 'lucide-react';
import InvoiceCard from '../components/InvoiceCard';

// Mock data
const stats = [
  { 
    label: 'Total Value Locked',
    value: '$2.5M',
    icon: Wallet,
    change: '+12.5%',
    positive: true
  },
  {
    label: 'Active Invoices',
    value: '156',
    icon: FileText,
    change: '+5.3%',
    positive: true
  },
  {
    label: 'APY',
    value: '8.2%',
    icon: TrendingUp,
    change: '-0.5%',
    positive: false
  },
  {
    label: 'Total Users',
    value: '2,451',
    icon: Users,
    change: '+15.2%',
    positive: true
  }
];

const recentInvoices = [
  {
    id: '1',
    sellerId: 'seller1',
    amount: 5000,
    currency: 'USD',
    dueDate: '2024-04-01',
    status: 'pending',
    createdAt: '2024-03-01',
    fileUrl: 'https://example.com/invoice1.pdf',
    description: 'Web Development Services'
  },
  {
    id: '2',
    sellerId: 'seller2',
    amount: 7500,
    currency: 'USD',
    dueDate: '2024-03-25',
    status: 'tokenized',
    createdAt: '2024-03-02',
    fileUrl: 'https://example.com/invoice2.pdf',
    description: 'Marketing Campaign'
  }
];

export default function Dashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={`flex items-center text-sm ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                <Activity className="w-4 h-4 ml-1" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Invoices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </div>
    </div>
  );
}