import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Wallet, Shield, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

interface BuyerOnboardingData {
  fullName: string;
  email: string;
  phone: string;
  investmentGoals: string;
  riskTolerance: 'low' | 'medium' | 'high';
  preferredInvestmentSize: string;
}

export default function OnboardingBuyer() {
  const navigate = useNavigate();
  const updateUserProfile = useStore(state => state.updateUserProfile);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BuyerOnboardingData>({
    fullName: '',
    email: '',
    phone: '',
    investmentGoals: '',
    riskTolerance: 'medium',
    preferredInvestmentSize: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      try {
        await updateUserProfile({
          ...formData,
          onboardingCompleted: true
        });
        navigate('/');
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself'
    },
    {
      title: 'Investment Preferences',
      description: 'Help us understand your investment style'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to InvoiceNFT</h2>
          <p className="mt-2 text-gray-600">Let's set up your investor account</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step > i ? 'bg-green-600' :
                step === i + 1 ? 'bg-indigo-600' : 'bg-gray-200'
              } text-white font-semibold`}>
                {step > i ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-24 h-1 ${
                  step > i + 1 ? 'bg-green-600' :
                  step === i + 1 ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {steps[step - 1].title}
          </h3>
          <p className="text-gray-500 mb-6">{steps[step - 1].description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Investment Size
                  </label>
                  <div className="relative">
                    <select
                      name="preferredInvestmentSize"
                      value={formData.preferredInvestmentSize}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select range</option>
                      <option value="0-1000">$0 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                    <Wallet className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Tolerance
                  </label>
                  <div className="relative">
                    <select
                      name="riskTolerance"
                      value={formData.riskTolerance}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="low">Conservative</option>
                      <option value="medium">Moderate</option>
                      <option value="high">Aggressive</option>
                    </select>
                    <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Goals
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="investmentGoals"
                      value={formData.investmentGoals}
                      onChange={handleInputChange}
                      placeholder="e.g., Regular income, Capital appreciation"
                      className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <Wallet className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ml-auto"
              >
                {step === 2 ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}