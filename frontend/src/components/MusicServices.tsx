import React from 'react';
import { SiYoutubemusic } from 'react-icons/si';
import { FiArrowUpRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

function getYouTubeMusicUrl(song: Song | null): string {
  if (song?.youtubeVideoId) {
    return `https://music.youtube.com/watch?v=${song.youtubeVideoId}`;
  }

  if (song?.youtubeUrl) {
    const match = song.youtubeUrl.match(/(?:youtu\.be\/|v=)([\w-]+)/);
    if (match?.[1]) {
      return `https://music.youtube.com/watch?v=${match[1]}`;
    }
  }

  return 'https://music.youtube.com';
}

export const MusicServices: React.FC = () => {
  const { currentSong } = useMusicPlayer();
  const ytMusicUrl = getYouTubeMusicUrl(currentSong);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="absolute top-5 md:top-6 right-4 md:right-6 flex items-center z-20"
    >
      <a 
        href={ytMusicUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="group flex items-center space-x-1.5 text-white/90 hover:text-white transition-colors duration-300"
        title={currentSong ? `Open "${currentSong.title}" on YouTube Music` : 'Open YouTube Music'}
      >
        <SiYoutubemusic className="text-base md:text-lg" />
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">YT Music</span>
        <FiArrowUpRight className="text-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </motion.div>
  );
};
