import React from 'react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-4xl mb-4">😔</div>
      <h3 className="text-white font-semibold text-lg mb-2">Oops!</h3>
      <p className="text-white/50 text-sm mb-6 max-w-md">{message}</p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#cc5500] hover:bg-[#e06000] text-white rounded-full text-sm font-medium transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </div>
  );
};
