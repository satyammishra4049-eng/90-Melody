import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const SongList: React.FC = () => {
  const { playlist, currentSong, isPlaying, playSong } = useMusicPlayer();

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-1">
      {playlist.map((song, index) => {
        const isActive = currentSong?.id === song.id;
        return (
          <motion.button
            key={song.id || index}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => playSong(index)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${
              isActive ? 'bg-white/10' : ''
            }`}
          >
            {/* Track Number / Play indicator */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              {isActive && isPlaying ? (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-[#cc5500] rounded-full animate-pulse" style={{ height: '60%' }} />
                  <span className="w-1 bg-[#cc5500] rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                  <span className="w-1 bg-[#cc5500] rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                </div>
              ) : isActive ? (
                <FaPause className="text-[#cc5500] text-xs" />
              ) : (
                <span className="text-white/30 text-sm">{index + 1}</span>
              )}
            </div>

            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isActive ? 'text-[#ff8c42]' : 'text-white/90'}`}>
                {song.title}
              </p>
              <p className="text-xs text-white/40 truncate">
                {song.artist} · {song.album}
              </p>
            </div>

            {/* Year badge */}
            {song.year && (
              <span className="text-[10px] text-white/30 shrink-0">
                {song.year}
              </span>
            )}

            {/* Duration */}
            <span className="text-xs text-white/30 tabular-nums shrink-0">
              {song.duration ? formatDuration(song.duration) : '--:--'}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
