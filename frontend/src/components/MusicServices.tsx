import React, { useState } from 'react';
import { SiYoutubemusic } from 'react-icons/si';
import { FiArrowUpRight, FiX } from 'react-icons/fi';
import { MdFavorite } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute top-5 md:top-6 right-4 md:right-6 flex items-center gap-2 md:gap-3 z-20"
      >
        {/* Support Button */}
        <button
          onClick={() => setShowSupport(true)}
          className="group flex items-center space-x-1 sm:space-x-1.5 text-white/80 hover:text-pink-400 transition-colors duration-300 bg-black/20 backdrop-blur-md p-2 sm:px-2.5 sm:py-1.5 rounded-full border border-white/10 hover:border-pink-400/40"
          title="Support us"
        >
          <MdFavorite className="text-sm md:text-base text-pink-400" />
          <span className="hidden sm:inline-block text-xs font-medium whitespace-nowrap">Support</span>
        </button>

        {/* YT Music Link */}
        <a
          href={ytMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-1 sm:space-x-1.5 text-white/90 hover:text-white transition-colors duration-300 p-1"
          title={currentSong ? `Open "${currentSong.title}" on YouTube Music` : 'Open YouTube Music'}
        >
          <SiYoutubemusic className="text-base md:text-lg" />
          <span className="hidden sm:inline-block text-xs md:text-sm font-medium whitespace-nowrap">YT Music</span>
          <FiArrowUpRight className="hidden sm:inline-block text-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      {/* Support QR Modal */}
      <AnimatePresence>
        {showSupport && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupport(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
            >
              <div className="pointer-events-auto relative bg-gradient-to-b from-[#1a0a0a] to-[#0f0505] border border-white/10 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">

                {/* Close button */}
                <button
                  onClick={() => setShowSupport(false)}
                  className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                >
                  <FiX className="text-lg" />
                </button>

                {/* Heart icon */}
                <div className="flex justify-center mb-3">
                  <div className="bg-pink-500/20 rounded-full p-3 border border-pink-500/30">
                    <MdFavorite className="text-2xl text-pink-400" />
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-1">Support Us 💖</h3>
                <p className="text-white/50 text-xs mb-4 leading-relaxed">
                  Agar aapko yeh website pasand aayi toh ek chota sa support karo!<br />
                  Scan karein aur contribute karein 🙏
                </p>

                {/* QR Code */}
                <div className="bg-white rounded-2xl p-3 mx-auto w-fit mb-4 shadow-lg">
                  <img
                    src="/support-qr.jpg"
                    alt="Google Pay QR Code"
                    className="w-48 h-48 md:w-52 md:h-52 object-contain rounded-xl"
                  />
                </div>

                {/* Support text */}
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">via Google Pay</p>
                  <p className="text-white font-semibold text-sm">Scan QR to Support</p>
                </div>

                <p className="text-white/30 text-xs mt-3">
                  ❤️ Thank you for your love & support!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
