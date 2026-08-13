import React from 'react';
import { motion } from 'framer-motion';
import { useClock } from '../hooks/useClock';

export const Clock: React.FC = () => {
  const timeString = useClock();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="absolute top-5 md:top-6 left-4 md:left-6 text-white/90 font-medium tracking-wide z-20 text-sm md:text-base"
    >
      {timeString}
    </motion.div>
  );
};
