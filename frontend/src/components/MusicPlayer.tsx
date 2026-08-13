import React from 'react';
import { motion } from 'framer-motion';
import { AlbumArtwork } from './AlbumArtwork';
import { SongInformation } from './SongInformation';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { FaListUl } from 'react-icons/fa';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const MusicPlayer: React.FC = () => {
  const { setShowPlaylist, showPlaylist } = useMusicPlayer();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: 'spring', damping: 22, stiffness: 100 }}
      className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[92%] md:w-[65%] lg:w-[55%] max-w-3xl z-30"
    >
      <div className="glass-player rounded-[40px] md:rounded-[50px] px-4 md:px-6 py-3 md:py-4 shadow-2xl">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-4">
          <AlbumArtwork />
          <SongInformation />
          <div className="flex-1 px-2">
            <ProgressBar />
          </div>
          <PlayerControls />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlaylist(!showPlaylist)}
            aria-label="Toggle playlist"
            className="text-white/50 hover:text-white transition-colors ml-1"
          >
            <FaListUl className="text-sm" />
          </motion.button>
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden flex-col gap-2">
          <div className="flex items-center gap-3">
            <AlbumArtwork />
            <SongInformation />
            <div className="ml-auto">
              <PlayerControls />
            </div>
          </div>
          <div className="px-1">
            <ProgressBar />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
