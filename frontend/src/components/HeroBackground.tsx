import React from 'react';
import { motion } from 'framer-motion';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a1208] z-0">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "linear" 
        }}
        className="absolute inset-0"
      >
        <img 
          src="/hero-bg.jpg" 
          alt="90s Nostalgia Background" 
          className="w-full h-full object-cover brightness-110 contrast-105 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffb347]/25 via-transparent to-transparent opacity-90 mix-blend-screen"></div>
      </motion.div>
      <div className="noise-overlay"></div>
    </div>
  );
};
