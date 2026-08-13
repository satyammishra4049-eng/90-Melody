import React, { useRef } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds <= 0) return '0:00';
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const ProgressBar: React.FC = () => {
  const { currentTime, duration, seek } = useMusicPlayer();
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    seek(percentage * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center space-x-2 md:space-x-3 w-full">
      <span className="text-[10px] md:text-xs text-white/70 w-8 md:w-10 text-right tabular-nums shrink-0">
        {formatTime(currentTime)}
      </span>
      
      <div 
        ref={progressBarRef}
        className="flex-1 h-1 md:h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-white/80 rounded-full group-hover:bg-[#cc5500] transition-colors"
          style={{ width: `${progressPercent}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity"
          style={{ left: `calc(${progressPercent}% - 5px)` }}
        />
      </div>

      <span className="text-[10px] md:text-xs text-white/70 w-8 md:w-10 tabular-nums shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  );
};
