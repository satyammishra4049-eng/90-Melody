import { useState, useEffect, useRef, useCallback } from 'react';
import type { Song } from '../types';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: Record<string, unknown>
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

const PLAYER_ELEMENT_ID = 'youtube-audio-player';

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

function getVideoId(song: Song): string | null {
  return song.youtubeVideoId || null;
}

export const useYouTubePlayer = () => {
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  
  const activeVideoIdRef = useRef<string | null>(null);
  // Store a pending song to play in case user clicks play before YT API is ready
  const pendingPlayRef = useRef<Song | null>(null);

  useEffect(() => {
    let intervalId: number | null = null;
    let cancelled = false;

    const initPlayer = async () => {
      await loadYouTubeAPI();
      if (cancelled) return;

      if (!document.getElementById(PLAYER_ELEMENT_ID)) {
        const container = document.createElement('div');
        container.id = PLAYER_ELEMENT_ID;
        // 200x200 offscreen guarantees browsers won't throttle it for being too small
        container.className = 'fixed -left-[9999px] top-0 w-[200px] h-[200px] opacity-0 pointer-events-none';
        document.body.appendChild(container);
      }

      playerRef.current = new window.YT.Player(PLAYER_ELEMENT_ID, {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1, // Crucial for mobile playback
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            playerRef.current?.setVolume(Math.round(volume * 100));
            setIsReady(true);
            setLoading(false);
            
            // If user clicked play while loading, play it now!
            if (pendingPlayRef.current) {
              const song = pendingPlayRef.current;
              pendingPlayRef.current = null;
              play(song);
            }
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setLoading(false);
              setEnded(false);
              setError(null);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.BUFFERING) {
              setLoading(true);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setEnded(true);
            }
          },
          onError: (e: any) => {
            console.error('YT Player Error:', e);
            setLoading(false);
            setError('Unable to play this YouTube video.');
            setIsPlaying(false);
          },
        },
      });

      intervalId = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime) return;

        const nextTime = player.getCurrentTime() || 0;
        const nextDuration = player.getDuration() || 0;
        setCurrentTime(nextTime);
        if (nextDuration > 0) setDuration(nextDuration);
      }, 400);
    };

    initPlayer();

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      playerRef.current?.destroy?.();
      playerRef.current = null;
      document.getElementById(PLAYER_ELEMENT_ID)?.remove();
    };
  }, []); // Empty deps, only run once

  const setSongInfo = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration || 0);
    setEnded(false);
    setError(null);
  }, []);

  const play = useCallback((song?: Song) => {
    const targetSong = song || currentSong;
    if (!targetSong) return;

    // If API isn't ready yet, queue the song and return
    if (!playerRef.current || !isReady) {
      pendingPlayRef.current = targetSong;
      setLoading(true);
      return;
    }

    const videoId = getVideoId(targetSong);
    if (!videoId) {
      setError('This song does not have a YouTube video.');
      return;
    }

    try {
      setLoading(true);
      setCurrentSong(targetSong);
      setEnded(false);
      setError(null);
      setIsPlaying(true);

      const player = playerRef.current;
      if (activeVideoIdRef.current !== videoId) {
        player.loadVideoById(videoId);
        activeVideoIdRef.current = videoId;
      } else {
        player.playVideo();
      }
    } catch (err) {
      console.error('YouTube playback error:', err);
      setError('YouTube playback failed.');
      setIsPlaying(false);
      setLoading(false);
    }
  }, [currentSong, isReady]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    playerRef.current?.pauseVideo();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const player = playerRef.current;
    if (!player) return;
    const maxDuration = player.getDuration() || duration;
    const clampedTime = Math.max(0, Math.min(time, maxDuration));
    player.seekTo(clampedTime, true);
    setCurrentTime(clampedTime);
  }, [duration]);

  const setVolume = useCallback((val: number) => {
    const player = playerRef.current;
    if (!player) return;
    const clamped = Math.max(0, Math.min(val, 1));
    player.setVolume(Math.round(clamped * 100));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      player.unMute();
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
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
