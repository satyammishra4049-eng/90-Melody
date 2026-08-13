import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMusic, FaArrowLeft } from 'react-icons/fa';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SongList } from '../components/SongList';
import { Footer } from '../components/Footer';

export const MusicPage: React.FC = () => {
  const { playlist } = useMusicPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');

  const years = [...new Set(playlist.map(s => s.year).filter(Boolean))].sort();

  const filteredSongs = playlist.filter(song => {
    const matchesSearch = !searchQuery || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear = filterYear === 'all' || song.year?.toString() === filterYear;
    
    return matchesSearch && matchesYear;
  });

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
          <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#cc5500]/20 text-[#ff8c42] border border-[#cc5500]/30">
            🎵 Only 90s Classics
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Music Library</h2>
          <p className="text-white/40">Timeless 90s Bollywood classics that defined a generation</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#cc5500]/50 transition-colors"
            />
          </div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#cc5500]/50 appearance-none cursor-pointer"
          >
            <option value="all">All Years</option>
            {years.map(y => (
              <option key={y} value={y?.toString()}>{y}</option>
            ))}
          </select>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#ff8c42]">{playlist.length}</p>
            <p className="text-white/40 text-xs mt-1">Total Songs</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#ff8c42]">1990-99</p>
            <p className="text-white/40 text-xs mt-1">Era</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#ff8c42]">
              <FaMusic className="inline" />
            </p>
            <p className="text-white/40 text-xs mt-1">Bollywood</p>
          </div>
        </div>

        {/* Song List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden"
        >
          {filteredSongs.length > 0 ? (
            <SongList />
          ) : (
            <div className="py-16 text-center">
              <p className="text-white/30 text-sm">No songs found matching your search</p>
            </div>
          )}
        </motion.div>
      </main>

      <div className="h-24" /> {/* Spacer for fixed player */}
      <Footer />
    </div>
  );
};
