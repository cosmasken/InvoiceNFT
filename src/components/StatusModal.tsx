import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileText, 
  Brain,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export type ModalState = 'loading' | 'success' | 'error' | 'ai-review' | 'ai-complete' | 'warning';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ModalState;
  title: string;
  message: string;
  aiSteps?: string[];
}

export default function StatusModal({ 
  isOpen, 
  onClose, 
  state, 
  title, 
  message,
  aiSteps = []
}: StatusModalProps) {
  const [currentAiStep, setCurrentAiStep] = React.useState(0);

  React.useEffect(() => {
    if (state === 'ai-review' && currentAiStep < aiSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentAiStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, currentAiStep, aiSteps.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex flex-col items-center text-center">
              {state === 'loading' && (
                <div className="p-3 bg-indigo-100 rounded-full mb-4">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}
              
              {state === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-green-100 rounded-full mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </motion.div>
              )}
              
              {state === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-red-100 rounded-full mb-4"
                >
                  <XCircle className="w-8 h-8 text-red-600" />
                </motion.div>
              )}

              {state === 'warning' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-yellow-100 rounded-full mb-4"
                >
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </motion.div>
              )}
              
              {state === 'ai-review' && (
                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="space-y-4">
                    {aiSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: currentAiStep >= index ? 1 : 0.5,
                          y: 0 
                        }}
                        className={`flex items-center gap-3 ${
                          currentAiStep >= index ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {currentAiStep > index ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : currentAiStep === index ? (
                          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                        )}
                        <span className="text-sm text-left">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {state === 'ai-complete' && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-100 rounded-full inline-flex">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    {aiSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-900 mt-4">{title}</h2>
              <p className="text-gray-600 mt-2">{message}</p>

              {state !== 'ai-review' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={onClose}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {state === 'success' ? 'Continue' : 
                   state === 'error' ? 'Try Again' : 
                   state === 'ai-complete' ? 'View Results' : 'Close'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}