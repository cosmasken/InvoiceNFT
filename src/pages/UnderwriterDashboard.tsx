import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter,
  DollarSign,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface LoanApplication {
  id: string;
  nftId: string;
  applicant: {
    name: string;
    companyName: string;
    creditScore: number;
  };
  requestedAmount: number;
  duration: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  nftValue: number;
}

const mockApplications: LoanApplication[] = [
  {
    id: '1',
    nftId: 'NFT-001',
    applicant: {
      name: 'John Doe',
      companyName: 'Tech Solutions Inc.',
      creditScore: 750
    },
    requestedAmount: 50000,
    duration: 90,
    status: 'pending',
    submittedAt: '2024-03-15T10:30:00Z',
    nftValue: 75000
  },
  {
    id: '2',
    nftId: 'NFT-002',
    applicant: {
      name: 'Jane Smith',
      companyName: 'Digital Marketing Pro',
      creditScore: 800
    },
    requestedAmount: 25000,
    duration: 60,
    status: 'approved',
    submittedAt: '2024-03-14T15:45:00Z',
    nftValue: 40000
  }
];

export default function UnderwriterDashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = mockApplications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nftId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    // In production, call API to update status
    console.log('Updating application status:', { applicationId, newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredApplications.map((application) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {application.applicant.companyName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    NFT ID: {application.nftId}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {application.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                 application.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                 <AlertCircle className="w-4 h-4" />}
                <span className="text-sm font-medium capitalize">{application.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Requested Amount</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ${application.requestedAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Credit Score</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {application.applicant.creditScore}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Duration</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {application.duration} days
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">NFT Value</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ${application.nftValue.toLocaleString()}
                </p>
              </div>
            </div>

            {application.status === 'pending' && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleStatusChange(application.id, 'rejected')}
                  className="px-4 py-2 border border-gray-200 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusChange(application.id, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}