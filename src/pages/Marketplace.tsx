import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import InvoiceCard from '../components/InvoiceCard';

const mockInvoices = [
  {
    id: '1',
    sellerId: 'seller1',
    amount: 5000,
    currency: 'USD',
    dueDate: '2024-04-01',
    status: 'tokenized',
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
  },
  {
    id: '3',
    sellerId: 'seller3',
    amount: 12000,
    currency: 'USD',
    dueDate: '2024-04-15',
    status: 'tokenized',
    createdAt: '2024-03-03',
    fileUrl: 'https://example.com/invoice3.pdf',
    description: 'Software License'
  }
];

export default function Marketplace() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockInvoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InvoiceCard invoice={invoice} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}