import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { HomePage } from './pages/HomePage';
import { MusicPage } from './pages/MusicPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { MusicPlayer } from './components/MusicPlayer';
import { PlaylistDrawer } from './components/PlaylistDrawer';

const GlobalPlayer: React.FC = () => {
  const location = useLocation();
  // Only show global player on music/about pages (HomePage has its own, Admin is separate)
  if (location.pathname === '/' || location.pathname === '/admin') return null;
  
  return (
    <>
      <div className="fixed bottom-0 left-0 w-full flex justify-center pb-4 z-40 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl px-4">
          <MusicPlayer />
        </div>
      </div>
      <PlaylistDrawer />
    </>
  );
};

function App() {
  return (
    <MusicPlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <GlobalPlayer />
      </Router>
    </MusicPlayerProvider>
  );
}

export default App;
