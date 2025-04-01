import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  Percent, 
  Users,
  Info,
  Calculator
} from 'lucide-react';

interface NFTFormData {
  percentageForSale: number;
  pricePerShare: number;
  totalShares: number;
  minimumInvestment: number;
  duration: number;
  expectedAPY: number;
}

export default function CreateInvoiceNFT() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NFTFormData>({
    percentageForSale: 70,
    pricePerShare: 100,
    totalShares: 100,
    minimumInvestment: 1000,
    duration: 90,
    expectedAPY: 8.5
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle NFT creation
    navigate('/marketplace');
  };

  const totalValuation = formData.pricePerShare * formData.totalShares;
  const amountForSale = (totalValuation * formData.percentageForSale) / 100;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Invoice NFT</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoice #1234</h2>
            <p className="text-sm text-gray-500">Configure NFT parameters for your invoice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage for Sale
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="percentageForSale"
                  value={formData.percentageForSale}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Percent className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Share
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="pricePerShare"
                  value={formData.pricePerShare}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">USD</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Shares
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="totalShares"
                  value={formData.totalShares}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Investment
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="minimumInvestment"
                  value={formData.minimumInvestment}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">USD</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">days</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected APY
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="expectedAPY"
                  value={formData.expectedAPY}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Calculator className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Total Valuation</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ${totalValuation.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Amount for Sale</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ${amountForSale.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create NFT
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}