import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Clock, DollarSign, Users, Boxes } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [units, setUnits] = useState(1);

  // Mock invoice data - In production, fetch from API
  const invoice = {
    id,
    sellerId: 'seller1',
    amount: 5000,
    currency: 'USD',
    dueDate: '2024-04-01',
    status: 'tokenized',
    createdAt: '2024-03-01',
    fileUrl: 'https://example.com/invoice1.pdf',
    description: 'Web Development Services',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    fractionalized: false,
    totalUnits: 100,
    availableUnits: 100,
    pricePerUnit: 50, // amount / totalUnits
  };

  const handleFractionalize = () => {
    // In production, call API to fractionalize the invoice
    console.log('Fractionalizing invoice:', id);
  };

  const handleBuyUnits = () => {
    // In production, call API to purchase units
    console.log('Buying units:', { invoiceId: id, units });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Invoice #{invoice.id}</h2>
                <p className="text-sm text-gray-500">{invoice.description}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              invoice.status === 'paid' 
                ? 'bg-green-100 text-green-800'
                : invoice.status === 'tokenized'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-semibold text-gray-900">
                {invoice.currency} {invoice.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-semibold text-gray-900">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{invoice.clientName}</p>
                <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
              </div>
            </div>
          </div>

          {invoice.status === 'tokenized' && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Units</h3>
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {invoice.availableUnits} / {invoice.totalUnits} available
                  </p>
                  <p className="text-sm text-gray-500">
                    {invoice.currency} {invoice.pricePerUnit} per unit
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {user?.role === 'seller' && invoice.status === 'tokenized' && !invoice.fractionalized && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleFractionalize}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Fractionalize Invoice (100 units)
            </button>
          </div>
        )}

        {user?.role === 'buyer' && invoice.status === 'tokenized' && invoice.fractionalized && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Fund Invoice
            </button>
          </div>
        )}
      </div>

      {/* Buy Units Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase Units</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units
              </label>
              <input
                type="number"
                min="1"
                max={invoice.availableUnits}
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Total Cost: {invoice.currency} {(units * invoice.pricePerUnit).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyUnits}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Purchase
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}