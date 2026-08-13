import { useState, useEffect, useRef, useCallback } from 'react';
import type { Song } from '../types';

interface UseAudioPlayerResult {
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
  ended: boolean;
  play: (song?: Song) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSongInfo: (song: Song) => void;
}

export const useAudioPlayer = (): UseAudioPlayerResult => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setEnded(false);
    };
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setEnded(true);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setEnded(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setLoading(true);
    const handlePlaying = () => {
      setLoading(false);
      setError(null);
    };
    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      // Don't set error if no src is loaded yet
      if (audio.src && audio.src !== window.location.href) {
        setError('Error loading audio. Audio files need to be provided.');
      }
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Set song info without playing (for initial display)
  const setSongInfo = useCallback((song: Song) => {
    setCurrentSong(song);
    setDuration(song.duration || 0);
    setCurrentTime(0);
  }, []);

  const play = useCallback(async (song?: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (song && (!currentSong || currentSong.id !== song.id)) {
        setCurrentSong(song);
        setDuration(song.duration || 0);
        setCurrentTime(0);
        setEnded(false);
        audio.src = song.audioUrl || '';
        audio.load();
      }
      await audio.play();
      setError(null);
    } catch (err: any) {
      console.error('Playback error:', err);
      if (err.name !== 'AbortError') {
        setError('Audio playback failed. Ensure audio files are available.');
      }
      setIsPlaying(false);
    }
  }, [currentSong]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      const clampedTime = Math.max(0, Math.min(time, audioRef.current.duration || duration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  }, [duration]);

  const setVolume = useCallback((val: number) => {
    if (audioRef.current) {
      const clamped = Math.max(0, Math.min(val, 1));
      audioRef.current.volume = clamped;
      setVolumeState(clamped);
      if (clamped > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  return {
    isPlaying,
    currentSong,
    volume,
    isMuted,
    currentTime,
    duration,
    loading,
    error,
    ended,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setSongInfo,
  };
};
