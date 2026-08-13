import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMusic, FaHeart } from 'react-icons/fa';
import { Footer } from '../components/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0505] via-[#2a0a05] to-[#1a0505]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1a0505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-white/60 hover:text-white transition-colors">
            <FaArrowLeft />
          </Link>
          <h1 className="font-devanagari font-bold text-xl text-[#fdf5e6]">
            90 <span className="font-devanagari">मेलोडी</span>
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero */}
          <div className="text-center mb-16">
            <h2 className="font-devanagari text-5xl md:text-7xl font-bold embossed-text mb-2">90</h2>
            <h3 className="font-devanagari text-3xl md:text-5xl font-bold embossed-text mb-6">मेलोडी</h3>
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              A nostalgic music experience inspired by timeless Indian melodies 
              and the golden atmosphere of the 1990s.
            </p>
          </div>

          {/* Story */}
          <div className="space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] rounded-2xl p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaMusic className="text-[#cc5500]" />
                <h3 className="text-xl font-bold text-white">The Golden Era</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                The 1990s were a magical decade for Indian cinema and music. From the soulful 
                melodies of Kumar Sanu and Alka Yagnik to the revolutionary compositions of A.R. Rahman, 
                this era produced timeless classics that continue to resonate with millions. 
                90 मेलोडी celebrates this golden period of Bollywood music.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/[0.03] rounded-2xl p-8 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaHeart className="text-[#cc5500]" />
                <h3 className="text-xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-white/50 leading-relaxed">
                We believe that great music transcends time. Our mission is to bring the warmth 
                and nostalgia of 90s Bollywood music to a new generation, while giving those who 
                grew up with these melodies a beautiful way to relive their memories. Every song 
                in our collection was released between 1990 and 1999 — only authentic 90s classics.
              </p>
            </motion.section>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { emoji: '🎵', title: 'Curated Collection', desc: 'Hand-picked 90s Bollywood classics' },
                { emoji: '🎨', title: 'Nostalgic Design', desc: 'Visual tribute to 90s Indian culture' },
                { emoji: '🔴', title: 'Live Community', desc: 'See who else is listening right now' },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] rounded-2xl p-6 text-center border border-white/5">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
