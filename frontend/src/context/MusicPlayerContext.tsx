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

// Default songs to show even before API loads
const DEFAULT_SONGS: Song[] = [
  {
    id: 'default-1',
    title: 'Zindagi Ban Gaye Ho Tum',
    artist: 'Udit Narayan, Alka Yagnik',
    album: 'Kasoor',
    coverUrl: 'https://i.ytimg.com/vi/LpX-fCgat1M/hqdefault.jpg',
    youtubeVideoId: 'LpX-fCgat1M',
    youtubeUrl: 'https://youtu.be/LpX-fCgat1M',
    year: 2001,
  },
  {
    id: 'default-2',
    title: 'Tujhe Dekha Toh',
    artist: 'Kumar Sanu, Lata Mangeshkar',
    album: 'Dilwale Dulhania Le Jayenge',
    coverUrl: 'https://i.ytimg.com/vi/cNV5hLSa9H8/hqdefault.jpg',
    youtubeVideoId: 'cNV5hLSa9H8',
    youtubeUrl: 'https://youtu.be/cNV5hLSa9H8',
    year: 1995,
  },
  {
    id: 'default-3',
    title: 'Chura Ke Dil Mera',
    artist: 'Kumar Sanu, Alka Yagnik',
    album: 'Main Khiladi Tu Anari',
    coverUrl: 'https://i.ytimg.com/vi/bzi4_qG71H8/hqdefault.jpg',
    youtubeVideoId: 'bzi4_qG71H8',
    youtubeUrl: 'https://youtu.be/bzi4_qG71H8',
    year: 1994,
  },
  {
    id: 'default-4',
    title: 'New Request 1',
    artist: 'Various Artists',
    album: '90s Hits',
    coverUrl: 'https://i.ytimg.com/vi/Qsk8onj4Zh8/hqdefault.jpg',
    youtubeVideoId: 'Qsk8onj4Zh8',
    youtubeUrl: 'https://youtu.be/Qsk8onj4Zh8',
    year: 1998,
  },
  {
    id: 'default-5',
    title: 'New Request 2',
    artist: 'Various Artists',
    album: '90s Hits',
    coverUrl: 'https://i.ytimg.com/vi/KRpHH4bcnKQ/hqdefault.jpg',
    youtubeVideoId: 'KRpHH4bcnKQ',
    youtubeUrl: 'https://youtu.be/KRpHH4bcnKQ',
    year: 1998,
  },
  {
    id: 'default-6',
    title: 'New Request 3',
    artist: 'Various Artists',
    album: '90s Hits',
    coverUrl: 'https://i.ytimg.com/vi/ka12rSs9Enc/hqdefault.jpg',
    youtubeVideoId: 'ka12rSs9Enc',
    youtubeUrl: 'https://youtu.be/ka12rSs9Enc',
    year: 1998,
  },
  {
    id: 'default-7',
    title: 'New Request 4',
    artist: 'Various Artists',
    album: '90s Hits',
    coverUrl: 'https://i.ytimg.com/vi/MbIRbYjLdqM/hqdefault.jpg',
    youtubeVideoId: 'MbIRbYjLdqM',
    youtubeUrl: 'https://youtu.be/MbIRbYjLdqM',
    year: 1998,
  },
  {
    id: 'default-8',
    title: 'New Request 5',
    artist: 'Various Artists',
    album: '90s Hits',
    coverUrl: 'https://i.ytimg.com/vi/siw7-MTgE4s/hqdefault.jpg',
    youtubeVideoId: 'siw7-MTgE4s',
    youtubeUrl: 'https://youtu.be/siw7-MTgE4s',
    year: 1998,
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
          // Set default song info without autoplay
          player.setSongInfo(songs[0]);
        }
      } catch (err) {
        console.error('Failed to fetch songs:', err);
        // Keep default songs
      }
    };
    fetchSongs();
  }, []);

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
        togglePlay: player.togglePlay,
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
