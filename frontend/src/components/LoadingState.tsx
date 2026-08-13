import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-3 border-white/20 border-t-[#cc5500] rounded-full animate-spin mb-4" />
      <p className="text-white/50 text-sm">{message}</p>
    </div>
  );
};
