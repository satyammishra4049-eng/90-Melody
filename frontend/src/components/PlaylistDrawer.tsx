import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SongList } from './SongList';

export const PlaylistDrawer: React.FC = () => {
  const { showPlaylist, setShowPlaylist, playlist } = useMusicPlayer();

  return (
    <AnimatePresence>
      {showPlaylist && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlaylist(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#2a0a05] to-[#1a0505] z-50 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Playlist</h2>
                <p className="text-white/50 text-sm mt-0.5">
                  {playlist.length} songs · Only 90s Classics
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPlaylist(false)}
                aria-label="Close playlist"
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>

            {/* Badge */}
            <div className="px-5 py-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#cc5500]/20 text-[#ff8c42] border border-[#cc5500]/30">
                🎵 Only 90s Classics
              </span>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <SongList />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
