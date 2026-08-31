import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Song } from '../types';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { api } from '../services/api';

interface MusicPlayerContextType {
  playlist: Song[];
  currentIndex: number;
  setPlaylist: (songs: Song[]) => void;
  playSong: (index: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (song: Song) => void;
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

const DEFAULT_SONGS: Song[] = [
  {
    id: 'default-1',
    title: 'Is Tarah Aashiqui Ka Asar',
    artist: 'Kumar Sanu',
    album: 'Imtihaan',
    coverUrl: 'https://i.ytimg.com/vi/x8AIGcNTjvs/hqdefault.jpg',
    youtubeVideoId: 'x8AIGcNTjvs',
    youtubeUrl: 'https://youtu.be/x8AIGcNTjvs',
    year: 1994,
  },
  {
    id: 'default-2',
    title: 'Aap Ke Pyaar Mein',
    artist: 'Alka Yagnik',
    album: 'Raaz',
    coverUrl: 'https://i.ytimg.com/vi/B72_HsUR0Vc/hqdefault.jpg',
    youtubeVideoId: 'B72_HsUR0Vc',
    youtubeUrl: 'https://youtu.be/B72_HsUR0Vc',
    year: 2002,
  },
  {
    id: 'default-3',
    title: 'Kitna Pyaara Hai Yeh Chehra',
    artist: 'Alka Yagnik, Udit Narayan',
    album: 'Raaz',
    coverUrl: 'https://i.ytimg.com/vi/6ohA8ZkGfWM/hqdefault.jpg',
    youtubeVideoId: '6ohA8ZkGfWM',
    youtubeUrl: 'https://youtu.be/6ohA8ZkGfWM',
    year: 2002,
  },
  {
    id: 'default-4',
    title: 'Pehli Pehli Baar Baliye',
    artist: 'Sonu Nigam, Alka Yagnik',
    album: 'Sangharsh',
    coverUrl: 'https://i.ytimg.com/vi/siw7-MTgE4s/hqdefault.jpg',
    youtubeVideoId: 'siw7-MTgE4s',
    youtubeUrl: 'https://youtu.be/siw7-MTgE4s',
    year: 1999,
  },
  {
    id: 'default-5',
    title: 'Sochenge Tumhe Pyar',
    artist: 'Kumar Sanu',
    album: 'Deewana',
    coverUrl: 'https://i.ytimg.com/vi/-_eCSVfsvCQ/hqdefault.jpg',
    youtubeVideoId: '-_eCSVfsvCQ',
    youtubeUrl: 'https://youtu.be/-_eCSVfsvCQ',
    year: 1992,
  },
  {
    id: 'default-6',
    title: 'Jhuki Jhuki Nazar Teri',
    artist: 'Alka Yagnik, Udit Narayan',
    album: 'Raja',
    coverUrl: 'https://i.ytimg.com/vi/cBGDDBHN22U/hqdefault.jpg',
    youtubeVideoId: 'cBGDDBHN22U',
    youtubeUrl: 'https://youtu.be/cBGDDBHN22U',
    year: 1995,
  },
  {
    id: 'default-7',
    title: 'Jo Bhi Kasmein',
    artist: 'Alka Yagnik, Udit Narayan',
    album: 'Raaz',
    coverUrl: 'https://i.ytimg.com/vi/B2aHXbnu9dI/hqdefault.jpg',
    youtubeVideoId: 'B2aHXbnu9dI',
    youtubeUrl: 'https://youtu.be/B2aHXbnu9dI',
    year: 2002,
  },
  {
    id: 'default-8',
    title: 'Shaam Bhi Khoob Hai',
    artist: 'Kumar Sanu, Alka Yagnik',
    album: 'Karz',
    coverUrl: 'https://i.ytimg.com/vi/clp9VpVA8Tg/hqdefault.jpg',
    youtubeVideoId: 'clp9VpVA8Tg',
    youtubeUrl: 'https://youtu.be/clp9VpVA8Tg',
    year: 2002,
  },
  {
    id: 'default-9',
    title: 'Hamein Tumse Hua Hai Pyar',
    artist: 'Alka Yagnik, Udit Narayan',
    album: 'Ab Tumhare Hawale Watan Sathiyo',
    coverUrl: 'https://i.ytimg.com/vi/lFdSi01tpYM/hqdefault.jpg',
    youtubeVideoId: 'lFdSi01tpYM',
    youtubeUrl: 'https://youtu.be/lFdSi01tpYM',
    year: 2004,
  },
  {
    id: 'default-10',
    title: 'Main Agar Saamne',
    artist: 'Abhijeet, Alka Yagnik',
    album: 'Raaz',
    coverUrl: 'https://i.ytimg.com/vi/vf0au_2CYYE/hqdefault.jpg',
    youtubeVideoId: 'vf0au_2CYYE',
    youtubeUrl: 'https://youtu.be/vf0au_2CYYE',
    year: 2002,
  }
];

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Song[]>(DEFAULT_SONGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const player = useYouTubePlayer();

  // Fetch songs from API on mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await api.getSongs();
        if (songs && songs.length > 0) {
          setPlaylist(songs);
          player.setSongInfo(songs[0]);
        } else {
          // If DB is empty, set default info
          player.setSongInfo(DEFAULT_SONGS[0]);
        }
      } catch (err) {
        console.error('Failed to fetch songs:', err);
        // Keep default songs and set info
        player.setSongInfo(DEFAULT_SONGS[0]);
      }
    };
    fetchSongs();
  }, []); // Run once on mount

  const playSong = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
      player.play(playlist[index]);
    }
  }, [playlist, player]);

  const selectSong = useCallback((song: Song) => {
    const idx = playlist.findIndex(s => s.id === song.id);
    if (idx >= 0) {
      playSong(idx);
    }
  }, [playlist, playSong]);

  const nextSong = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIdx = (currentIndex + 1) % playlist.length;
    playSong(nextIdx);
  }, [playlist, currentIndex, playSong]);

  const prevSong = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(prevIdx);
  }, [playlist, currentIndex, playSong]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          player.togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.seek(player.currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.seek(player.currentTime - 5);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  // Auto-play next song when current ends
  useEffect(() => {
    if (player.ended) {
      nextSong();
    }
  }, [player.ended, nextSong]);

  const currentSong = currentIndex >= 0 && currentIndex < playlist.length 
    ? playlist[currentIndex] 
    : playlist[0] || null;

  return (
    <MusicPlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        setPlaylist,
        playSong,
        nextSong,
        prevSong,
        selectSong,
        showPlaylist,
        setShowPlaylist,
        isPlaying: player.isPlaying,
        currentSong: player.currentSong || currentSong,
        volume: player.volume,
        isMuted: player.isMuted,
        currentTime: player.currentTime,
        duration: player.duration || (currentSong?.duration || 0),
        loading: player.loading,
        error: player.error,
        togglePlay: () => {
          if (player.isPlaying) {
            player.pause();
          } else {
            player.play(player.currentSong || currentSong || undefined);
          }
        },
        seek: player.seek,
        setVolume: player.setVolume,
        toggleMute: player.toggleMute,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
