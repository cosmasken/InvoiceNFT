import React from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NFTShare {
  id: string;
  invoiceNumber: string;
  description: string;
  totalValue: number;
  availableShares: number;
  pricePerShare: number;
  expectedAPY: number;
  duration: number;
  seller: {
    name: string;
    rating: number;
  };
}

const mockShares: NFTShare[] = [
  {
    id: '1',
    invoiceNumber: '1234',
    description: 'Web Development Services',
    totalValue: 50000,
    availableShares: 70,
    pricePerShare: 100,
    expectedAPY: 8.5,
    duration: 90,
    seller: {
      name: 'Tech Solutions Inc.',
      rating: 4.8
    }
  },
  {
    id: '2',
    invoiceNumber: '1235',
    description: 'Marketing Campaign',
    totalValue: 75000,
    availableShares: 85,
    pricePerShare: 150,
    expectedAPY: 9.2,
    duration: 60,
    seller: {
      name: 'Digital Marketing Pro',
      rating: 4.6
    }
  }
];

export default function InvestorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            My Investments
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockShares.map((share) => (
          <motion.div
            key={share.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-indigo-500 transition-colors cursor-pointer"
            onClick={() => navigate(`/invoices/${share.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Invoice #{share.invoiceNumber}</h2>
                  <p className="text-sm text-gray-500">{share.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Seller Rating</p>
                <p className="font-medium text-gray-900">⭐ {share.seller.rating}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Total Value</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ${share.totalValue.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Available Shares</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {share.availableShares} units
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Expected APY</span>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  {share.expectedAPY}%
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Duration</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {share.duration} days
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Price per Share</p>
                <p className="text-xl font-bold text-gray-900">
                  ${share.pricePerShare}
                </p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Invest Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}