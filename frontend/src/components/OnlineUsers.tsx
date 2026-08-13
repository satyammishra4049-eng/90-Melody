import React from 'react';
import { motion } from 'framer-motion';
import { useOnlineUsers } from '../hooks/useOnlineUsers';

export const OnlineUsers: React.FC = () => {
  const count = useOnlineUsers();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-white/90 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 z-20"
    >
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </div>
      <span className="font-medium text-sm tracking-wide">{count} online</span>
    </motion.div>
  );
};
