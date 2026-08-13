import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0202] border-t border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-devanagari font-bold text-lg text-[#fdf5e6]">
            90 <span className="font-devanagari">मेलोडी</span>
          </h3>
          <p className="text-white/30 text-xs mt-1">A nostalgic music experience</p>
        </div>
        
        <nav className="flex items-center space-x-6 text-sm">
          <Link to="/" className="text-white/40 hover:text-white/80 transition-colors">Home</Link>
          <Link to="/music" className="text-white/40 hover:text-white/80 transition-colors">Music</Link>
          <Link to="/about" className="text-white/40 hover:text-white/80 transition-colors">About</Link>
        </nav>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} 90 मेलोडी. Only 90s Classics.
        </p>
      </div>
    </footer>
  );
};
