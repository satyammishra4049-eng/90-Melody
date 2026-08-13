import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from '../components/Clock';
import { OnlineUsers } from '../components/OnlineUsers';
import { MusicServices } from '../components/MusicServices';
import { Hero } from '../components/Hero';
import { MusicPlayer } from '../components/MusicPlayer';
import { PlaylistDrawer } from '../components/PlaylistDrawer';

export const HomePage: React.FC = () => {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Hero Section with Background and Brand Logo */}
      <Hero />

      {/* Top Bar Elements */}
      <Clock />
      <OnlineUsers />
      <MusicServices />
      
      {/* Bottom Music Player */}
      <MusicPlayer />

      {/* Playlist Drawer */}
      <PlaylistDrawer />
    </div>
  );
};
