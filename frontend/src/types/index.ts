export interface Song {
  id: string;
  _id?: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  thumbnailUrl?: string;
  audioUrl?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  duration?: number;
  year?: number;
  genre?: string;
}

export interface Playlist {
  id: string;
  _id?: string;
  name: string;
  songs: Song[];
  description?: string;
}

export interface OnlineUsers {
  count: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  playlist: Song[];
  currentIndex: number;
}

export interface AnalyticsEvent {
  event: string;
  songId?: string;
  sessionId?: string;
}

export interface AdminStats {
  totalSongs: number;
  totalPlays: number;
  onlineUsers: number;
  totalVisitors: number;
}
