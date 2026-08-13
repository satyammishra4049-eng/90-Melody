import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaMusic, FaUsers, FaChartBar, FaSignOutAlt, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../services/api';
import type { Song } from '../types';

interface SongFormData {
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  year: number;
  genre: string;
}

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState<SongFormData>({
    title: '', artist: '', album: '', duration: 300, coverUrl: '', audioUrl: '', year: 1995, genre: 'Bollywood'
  });

  // Check existing token on mount
  useEffect(() => {
    if (token) {
      verifyAndLoad();
    }
  }, []);

  const verifyAndLoad = async () => {
    try {
      const data = await api.getAdminStats(token);
      setStats(data);
      setIsLoggedIn(true);
      loadSongs();
    } catch {
      setToken('');
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await api.adminLogin(email, password);
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      loadSongs();
      loadStats();
    } catch (err) {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const loadSongs = async () => {
    try {
      const data = await api.getSongs();
      setSongs(data);
    } catch (err) {
      console.error('Failed to load songs:', err);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSong) {
        const songId = editingSong.id ?? editingSong._id;
        if (!songId) throw new Error('Song ID is missing');
        await api.adminUpdateSong(token, songId, formData);
      } else {
        await api.adminCreateSong(token, formData);
      }
      setShowForm(false);
      setEditingSong(null);
      setFormData({ title: '', artist: '', album: '', duration: 300, coverUrl: '', audioUrl: '', year: 1995, genre: 'Bollywood' });
      loadSongs();
    } catch (err) {
      console.error('Failed to save song:', err);
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setFormData({
      title: song.title || '', artist: song.artist || '', album: song.album || '',
      duration: song.duration || 300, coverUrl: song.coverUrl || '', audioUrl: song.audioUrl || '',
      year: song.year || 1995, genre: song.genre || 'Bollywood'
    });
    setShowForm(true);
  };

  const handleDelete = async (song: Song) => {
    if (!confirm(`Delete "${song.title}"?`)) return;
    try {
      const songId = song.id ?? song._id;
      if (!songId) throw new Error('Song ID is missing');
      await api.adminDeleteSong(token, songId);
      loadSongs();
    } catch (err) {
      console.error('Failed to delete song:', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-gray-900 rounded-2xl p-8 border border-gray-800"
        >
          <div className="text-center mb-8">
            <h1 className="font-devanagari text-2xl font-bold text-white mb-1">90 मेलोडी</h1>
            <p className="text-gray-500 text-sm">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-devanagari font-bold text-lg text-white">90 मेलोडी</h1>
          <span className="text-gray-600 text-sm">Admin</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FaMusic, label: 'Songs', value: songs.length, color: 'blue' },
            { icon: FaUsers, label: 'Online Users', value: stats?.onlineUsers || 0, color: 'green' },
            { icon: FaChartBar, label: 'Total Plays', value: stats?.totalPlays || 0, color: 'purple' },
            { icon: FaChartBar, label: 'Total Views', value: stats?.totalViews || 0, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <stat.icon className="text-gray-600 mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Songs Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Songs</h2>
          <button onClick={() => { setEditingSong(null); setFormData({ title: '', artist: '', album: '', duration: 300, coverUrl: '', audioUrl: '', year: 1995, genre: 'Bollywood' }); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <FaPlus /> Add Song
          </button>
        </div>

        {/* Song Form Modal */}
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{editingSong ? 'Edit Song' : 'Add Song'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-3">
                {(['title', 'artist', 'album', 'audioUrl', 'coverUrl'] as const).map(field => (
                  <div key={field}>
                    <label className="text-gray-400 text-xs mb-1 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input value={formData[field]} onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" required={field === 'title' || field === 'artist'} />
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Year</label>
                    <input type="number" min="1990" max="1999" value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Duration (s)</label>
                    <input type="number" value={formData.duration} onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Genre</label>
                    <input value={formData.genre} onChange={e => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 mt-4 transition-colors">
                  <FaSave /> {editingSong ? 'Update' : 'Create'} Song
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Songs Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">#</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Title</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Artist</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Album</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Year</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, i) => (
                  <tr key={song.id || i} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{song.title}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{song.artist}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{song.album}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{song.year}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(song)} className="text-blue-400 hover:text-blue-300 p-1 transition-colors" aria-label="Edit song">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(song)} className="text-red-400 hover:text-red-300 p-1 transition-colors" aria-label="Delete song">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {songs.length === 0 && (
            <div className="py-12 text-center text-gray-500">No songs yet. Add your first song!</div>
          )}
        </div>
      </div>
    </div>
  );
};
