import React from 'react';
import { motion } from 'framer-motion';

export const BrandLogo: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 pointer-events-none w-full"
    >
      <h1 className="text-[120px] md:text-[180px] font-bold leading-none embossed-text tracking-tighter">
        90
      </h1>
      <h2 className="text-[80px] md:text-[120px] font-devanagari font-bold leading-none -mt-4 md:-mt-8 embossed-text">
        मेलोडी
      </h2>
      <p className="mt-4 md:mt-6 text-xl md:text-3xl font-devanagari text-white/90 tracking-wider font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
        सिर्फ़ 90s की यादें
      </p>
    </motion.div>
  );
};
