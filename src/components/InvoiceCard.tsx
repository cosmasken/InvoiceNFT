import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Invoice } from '../types';

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Invoice #{invoice.id}</h3>
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
      
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {invoice.currency} {invoice.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
        <button 
          onClick={() => navigate(`/invoices/${invoice.id}`)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}