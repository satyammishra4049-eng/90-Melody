import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const SongInformation: React.FC = () => {
  const { currentSong } = useMusicPlayer();

  return (
    <div className="flex flex-col justify-center min-w-[100px] max-w-[180px] md:max-w-[250px] overflow-hidden">
      <h3 className="text-white font-semibold text-sm md:text-base truncate whitespace-nowrap">
        {currentSong?.title || 'Zindagi Ban Gaye Ho Tum'}
      </h3>
      <p className="text-white/60 text-xs md:text-sm truncate whitespace-nowrap">
        {currentSong?.artist || 'Udit Narayan, Alka Yagnik'}
      </p>
    </div>
  );
};
