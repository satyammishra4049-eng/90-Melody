import type { Song, AnalyticsEvent } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api'
);

const fetchWrapper = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    if (response.status === 204) return {} as T;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Transform MongoDB _id to id for frontend consistency
const transformSong = (song: any): Song => ({
  ...song,
  id: song._id || song.id,
  coverUrl: song.coverUrl || song.thumbnailUrl,
  youtubeVideoId: song.youtubeVideoId,
  youtubeUrl: song.youtubeUrl,
});

const transformSongs = (songs: any[]): Song[] => songs.map(transformSong);

export const api = {
  // Songs
  getSongs: async () => {
    const data = await fetchWrapper<any[]>('/songs');
    return transformSongs(data);
  },
  getSongById: async (id: string) => {
    const data = await fetchWrapper<any>(`/songs/${id}`);
    return transformSong(data);
  },
  createSong: (song: Partial<Song>) =>
    fetchWrapper<Song>('/songs', { method: 'POST', body: JSON.stringify(song) }),
  updateSong: (id: string, song: Partial<Song>) =>
    fetchWrapper<Song>(`/songs/${id}`, { method: 'PUT', body: JSON.stringify(song) }),
  deleteSong: (id: string) =>
    fetchWrapper<void>(`/songs/${id}`, { method: 'DELETE' }),

  // Online Users
  getOnlineUsers: () => fetchWrapper<{ count: number }>('/online-users/count'),

  // Player
  getNowPlaying: () => fetchWrapper<any>('/player/now-playing'),

  // Playlists
  getPlaylists: () => fetchWrapper<any[]>('/playlist'),
  createPlaylist: (data: any) =>
    fetchWrapper<any>('/playlist', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  trackEvent: (event: AnalyticsEvent) =>
    fetchWrapper<void>('/analytics/track', { method: 'POST', body: JSON.stringify(event) }),

  // Admin
  adminLogin: (email: string, password: string) =>
    fetchWrapper<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getAdminStats: (token: string) =>
    fetchWrapper<any>('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAdminOnlineUsers: (token: string) =>
    fetchWrapper<any>('/admin/online-users', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminCreateSong: (token: string, song: Partial<Song>) =>
    fetchWrapper<Song>('/admin/songs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(song),
    }),
  adminUpdateSong: (token: string, id: string, song: Partial<Song>) =>
    fetchWrapper<Song>(`/admin/songs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(song),
    }),
  adminDeleteSong: (token: string, id: string) =>
    fetchWrapper<void>(`/admin/songs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Health
  healthCheck: () => fetchWrapper<{ status: string }>('/health'),
};
