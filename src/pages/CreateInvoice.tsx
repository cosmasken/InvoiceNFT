import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusModal from '../components/StatusModal';

type UploadMethod = 'manual' | 'file';
type SupportingDocument = {
  file: File;
  preview: string;
};

const aiReviewSteps = [
  "Analyzing invoice content and structure...",
  "Verifying payment terms and conditions...",
  "Checking for compliance requirements...",
  "Validating client information...",
  "Assessing invoice authenticity...",
  "Generating risk assessment report..."
];

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('manual');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<SupportingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    state: 'loading' | 'success' | 'error' | 'ai-review' | 'ai-complete';
    title: string;
    message: string;
  }>({
    isOpen: false,
    state: 'loading',
    title: '',
    message: ''
  });

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    amount: '',
    currency: 'USD',
    dueDate: '',
    description: '',
    clientName: '',
    clientEmail: '',
  });

  const onInvoiceDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setInvoiceFile(acceptedFiles[0]);
      // Start AI review process
      setModalState({
        isOpen: true,
        state: 'ai-review',
        title: 'AI Review in Progress',
        message: 'Our AI is analyzing your invoice...'
      });

      // Simulate AI review completion
      setTimeout(() => {
        setModalState({
          isOpen: true,
          state: 'ai-complete',
          title: 'AI Review Complete',
          message: 'Invoice analysis completed successfully!'
        });
      }, 12000); // After all steps complete
    }
  }, []);

  const onSupportingDocsDrop = useCallback((acceptedFiles: File[]) => {
    const newDocs = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setSupportingDocs(prev => [...prev, ...newDocs]);
  }, []);

  const { getRootProps: getInvoiceRootProps, getInputProps: getInvoiceInputProps } = useDropzone({
    onDrop: onInvoiceDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const { getRootProps: getSupportingRootProps, getInputProps: getSupportingInputProps } = useDropzone({
    onDrop: onSupportingDocsDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeSupportingDoc = (index: number) => {
    setSupportingDocs(prev => {
      const newDocs = [...prev];
      URL.revokeObjectURL(newDocs[index].preview);
      newDocs.splice(index, 1);
      return newDocs;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setModalState({
      isOpen: true,
      state: 'loading',
      title: 'Creating Invoice',
      message: 'Please wait while we process your invoice...'
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModalState({
        isOpen: true,
        state: 'success',
        title: 'Invoice Created',
        message: 'Your invoice has been created successfully!'
      });

      // Navigate after modal is closed
    } catch (error) {
      setModalState({
        isOpen: true,
        state: 'error',
        title: 'Error',
        message: 'Failed to create invoice. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.state === 'success') {
      navigate('/marketplace');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Invoice</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Method</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setUploadMethod('manual')}
              className={`flex-1 p-4 rounded-lg border-2 ${
                uploadMethod === 'manual'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <FileText className="w-6 h-6 mb-2 mx-auto text-indigo-600" />
              <p className="font-medium text-gray-900">Manual Entry</p>
              <p className="text-sm text-gray-500">Enter invoice details manually</p>
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 p-4 rounded-lg border-2 ${
                uploadMethod === 'file'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <Upload className="w-6 h-6 mb-2 mx-auto text-indigo-600" />
              <p className="font-medium text-gray-900">File Upload</p>
              <p className="text-sm text-gray-500">Upload invoice PDF</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {uploadMethod === 'file' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Invoice</h2>
              <div
                {...getInvoiceRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <input {...getInvoiceInputProps()} />
                {invoiceFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <span className="font-medium text-gray-900">{invoiceFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInvoiceFile(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mb-2 mx-auto text-gray-400" />
                    <p className="text-gray-600">Drag and drop your invoice PDF here, or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="absolute left-0 top-0 bottom-0 w-20 border-r border-gray-300 rounded-l-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-24 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {supportingDocs.map((doc, index) => (
                <motion.div
                  key={doc.preview}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {doc.file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSupportingDoc(index)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </motion.div>
              ))}
            </div>
            <div
              {...getSupportingRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <input {...getSupportingInputProps()} />
              <Plus className="w-6 h-6 mb-2 mx-auto text-gray-400" />
              <p className="text-gray-600">Add supporting documents (optional)</p>
              <p className="text-sm text-gray-500">PDF, PNG, or JPG files</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        state={modalState.state}
        title={modalState.title}
        message={modalState.message}
        aiSteps={aiReviewSteps}
      />
    </div>
  );
}