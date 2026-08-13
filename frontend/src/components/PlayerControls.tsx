import React from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const PlayerControls: React.FC = () => {
  const { isPlaying, togglePlay, nextSong, prevSong } = useMusicPlayer();

  return (
    <div className="flex items-center justify-center space-x-3 md:space-x-5">
      <motion.button 
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSong}
        aria-label="Previous song"
        className="text-white/70 hover:text-white transition-colors p-1"
      >
        <FaStepBackward className="text-base md:text-lg" />
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        {isPlaying ? (
          <FaPause className="text-[#3e0c06] text-sm md:text-base" />
        ) : (
          <FaPlay className="text-[#3e0c06] text-sm md:text-base ml-0.5" />
        )}
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSong}
        aria-label="Next song"
        className="text-white/70 hover:text-white transition-colors p-1"
      >
        <FaStepForward className="text-base md:text-lg" />
      </motion.button>
    </div>
  );
};
