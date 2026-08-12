# 90 मेलोडी — 90s Music & Nostalgia

> A nostalgic music experience inspired by timeless Indian melodies and the atmosphere of the 90s.

![90 Melody](frontend/public/hero-bg.jpg)

## 🎵 Overview

**90 मेलोडी** is a full-stack music web application that celebrates the golden era of 90s Bollywood music. The app features a stunning visual design inspired by 1990s Indian street life, combined with a premium modern music player.

### Features

- 🎶 **Functional Music Player** — Play, pause, seek, skip, volume control with real audio playback
- 🟢 **Real-Time Online Users** — Live visitor count powered by Socket.IO
- 🕐 **Live Clock** — Dynamic local time display
- 🎨 **90s Nostalgia Design** — Painterly Indian street scene with warm cinematic lighting
- 📱 **Fully Responsive** — Desktop, tablet, and mobile layouts
- 🔐 **Admin Dashboard** — Song management, analytics, and user tracking
- 📊 **Analytics** — Anonymous play tracking and visitor statistics
- 🎵 **Playlist System** — Browse, search, and filter 90s Bollywood classics
- ⌨️ **Keyboard Shortcuts** — Space (play/pause), arrows (seek), M (mute)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Real-time** | Socket.IO |
| **Auth** | JWT |
| **Security** | Helmet, CORS, express-rate-limit |

## 📁 Folder Structure

```
90-melody/
├── frontend/                 # React frontend
│   ├── public/              # Static assets
│   │   └── hero-bg.jpg     # Hero background image
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context providers
│   │   ├── services/        # API & Socket services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app with routing
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles + Tailwind
│   ├── index.html           # HTML template with SEO
│   └── vite.config.ts       # Vite configuration
├── server/                   # Express backend
│   ├── config/              # Database & env config
│   ├── controllers/         # Route controllers
│   ├── middleware/           # Auth, rate-limit, validation
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── services/            # Background services
│   ├── sockets/             # Socket.IO handlers
│   ├── utils/               # Utilities & seed script
│   └── server.js            # Server entry point
├── .env.example             # Environment template
├── .gitignore
├── package.json             # Root package with scripts
└── README.md                # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd 90-melody
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example server/.env
   ```
   Edit `server/.env` with your MongoDB connection string and other settings.

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This starts both frontend (http://localhost:5173) and backend (http://localhost:5000) concurrently.

## ⚙️ Environment Variables

Create `server/.env` from `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/melody90` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret | — |
| `ADMIN_EMAIL` | Admin login email | `admin@90melody.com` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `NODE_ENV` | Environment | `development` |

## 🏃 Running

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |
| `npm run seed` | Seed database with demo songs |

## 📡 API Documentation

### Health Check
```
GET /api/health
→ { "status": "ok" }
```

### Songs
```
GET    /api/songs          # List all songs
GET    /api/songs/:id      # Get single song
POST   /api/songs          # Create song
PUT    /api/songs/:id      # Update song
DELETE /api/songs/:id      # Delete song
```

### Online Users
```
GET    /api/online-users           # Get online count → { "count": 39 }
POST   /api/online-users/heartbeat # Send heartbeat → { "sessionId": "..." }
DELETE /api/online-users/:sessionId # Remove session
```

### Player
```
GET /api/player/now-playing  # Current song info
```

### Playlists
```
GET    /api/playlist         # List playlists
POST   /api/playlist         # Create playlist
PUT    /api/playlist/:id     # Update playlist
DELETE /api/playlist/:id     # Delete playlist
```

### Analytics
```
POST /api/analytics/event    # Track event → { "event": "songPlay", "songId": "..." }
```

### Admin
```
POST   /api/admin/login         # Login → { "token": "..." }
GET    /api/admin/stats          # Dashboard stats (protected)
GET    /api/admin/online-users   # Online users (protected)
POST   /api/admin/songs          # Create song (protected)
PUT    /api/admin/songs/:id      # Update song (protected)
DELETE /api/admin/songs/:id      # Delete song (protected)
```

## 🔌 Socket.IO

The app uses Socket.IO for real-time features:

### Events

| Event | Direction | Data | Description |
|-------|-----------|------|-------------|
| `connection` | Client → Server | — | New visitor connected |
| `heartbeat` | Client → Server | `{ sessionId }` | Keep session alive |
| `disconnect` | Client → Server | — | Visitor disconnected |
| `onlineUsersUpdated` | Server → Client | `{ count }` | Updated online count |

### Client Usage
```typescript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('onlineUsersUpdated', (data) => {
  console.log(`${data.count} online`);
});
```

## 🔐 Admin Setup

1. Default credentials are set in `.env`:
   - Email: `admin@90melody.com`
   - Password: `admin123`

2. Navigate to `/admin` in the browser

3. Log in with the credentials above

4. Dashboard features:
   - Add/edit/delete songs
   - View online users
   - View play statistics
   - View total visitors

## 🚢 Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set environment variables for production:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-production-mongodb-uri>
   JWT_SECRET=<strong-random-secret>
   ```

3. Start the server:
   ```bash
   npm start
   ```

The production server serves the built frontend from `frontend/dist/`.

## 🎵 Song Database

The app comes pre-seeded with 10 classic 90s Bollywood songs:

1. Saaton Janam Main Tere — Kumar Sanu & Alka Yagnik (Dilwale, 1994)
2. Tujhe Dekha Toh Yeh Jaana Sanam — Kumar Sanu & Lata Mangeshkar (DDLJ, 1995)
3. Chaiyya Chaiyya — Sukhwinder Singh & Sapna Awasthi (Dil Se, 1998)
4. Dil To Pagal Hai — Lata Mangeshkar & Udit Narayan (1997)
5. Pehla Nasha — Udit Narayan & Sadhana Sargam (1992)
6. Ae Mere Humsafar — Udit Narayan & Alka Yagnik (1990)
7. Kuch Kuch Hota Hai — Udit Narayan & Alka Yagnik (1998)
8. Dil Se Re — A.R. Rahman (1998)
9. Mere Khwabon Mein — Lata Mangeshkar (DDLJ, 1995)
10. Ek Ladki Ko Dekha — Kumar Sanu (1994)

> **Note:** Audio files are placeholders. Replace `audioUrl` in the database with your own licensed audio files.

## 📜 License

MIT
# 90-Melody
