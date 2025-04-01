import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  TrendingUp
} from 'lucide-react';

// Mock transaction data - In production, fetch from API
const mockTransaction = {
  id: '1',
  type: 'purchase',
  status: 'completed',
  amount: 5000,
  currency: 'USD',
  timestamp: '2024-03-01T10:30:00Z',
  description: 'Purchase of Invoice #1234',
  fromAddress: '0x1234567890abcdef1234567890abcdef12345678',
  toAddress: '0x9876543210fedcba9876543210fedcba98765432',
  txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  fee: 2.5,
  invoiceId: '1234',
  units: 50,
  nftMetadata: {
    name: 'Invoice #1234 NFT',
    description: 'Tokenized invoice for web development services',
    image: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?w=800',
    attributes: [
      { trait_type: 'Type', value: 'Invoice' },
      { trait_type: 'Amount', value: '5000 USD' },
      { trait_type: 'Due Date', value: '2024-04-01' }
    ],
    ownershipHistory: [
      {
        address: '0x1234...5678',
        timestamp: '2024-03-01T10:30:00Z',
        type: 'mint'
      },
      {
        address: '0x8765...4321',
        timestamp: '2024-03-01T10:35:00Z',
        type: 'transfer'
      }
    ]
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: { icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
    pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
    failed: { icon: XCircle, className: 'bg-red-100 text-red-800' }
  }[status];

  const Icon = statusConfig.icon;

  return (
    <span className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.className}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium capitalize">{status}</span>
    </span>
  );
};

const AddressDisplay = ({ address }: { address: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-gray-100 rounded-full"
        title="Copy address"
      >
        <Copy className="w-4 h-4 text-gray-500" />
      </button>
      <a
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 hover:bg-gray-100 rounded-full"
        title="View on Etherscan"
      >
        <ExternalLink className="w-4 h-4 text-gray-500" />
      </a>
    </div>
  );
};

export default function TransactionDetails() {
  const { id } = useParams();
  const transaction = mockTransaction; // In production, fetch based on id

  const TypeIcon = {
    deposit: ArrowUpRight,
    withdrawal: ArrowDownRight,
    purchase: FileText,
    sale: TrendingUp
  }[transaction.type];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/transactions"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                transaction.type === 'deposit' ? 'bg-green-100' :
                transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <TypeIcon className={`w-6 h-6 ${
                  transaction.type === 'deposit' ? 'text-green-600' :
                  transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {transaction.description}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <StatusBadge status={transaction.status} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
              <p className={`text-2xl font-bold ${
                transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === 'withdrawal' ? '-' : '+'}
                {transaction.currency} {transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Fee: {transaction.currency} {transaction.fee}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction Hash</h3>
              <AddressDisplay address={transaction.txHash} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
              <AddressDisplay address={transaction.fromAddress} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">To</h3>
              <AddressDisplay address={transaction.toAddress} />
            </div>

            {transaction.units && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Units</h3>
                <p className="text-lg font-semibold text-gray-900">{transaction.units} units</p>
              </div>
            )}
          </div>
        </motion.div>

        {transaction.nftMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">NFT Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={transaction.nftMetadata.image}
                  alt={transaction.nftMetadata.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {transaction.nftMetadata.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {transaction.nftMetadata.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Attributes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {transaction.nftMetadata.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 rounded-lg"
                      >
                        <p className="text-sm text-gray-500">{attr.trait_type}</p>
                        <p className="font-medium text-gray-900">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Ownership History</h4>
                  <div className="space-y-2">
                    {transaction.nftMetadata.ownershipHistory.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize text-gray-900">
                            {record.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            by {record.address}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}