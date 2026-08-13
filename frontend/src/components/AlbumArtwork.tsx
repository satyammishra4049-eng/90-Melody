import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const AlbumArtwork: React.FC = () => {
  const { currentSong } = useMusicPlayer();

  return (
    <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex-shrink-0 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-black/50">
      {currentSong?.coverUrl ? (
        <img 
          src={currentSong.coverUrl} 
          alt={`${currentSong.title || 'Song'} cover`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className={`w-full h-full flex items-center justify-center text-white/60 text-2xl ${currentSong?.coverUrl ? 'hidden' : ''}`}>
        🎵
      </div>
    </div>
  );
};
