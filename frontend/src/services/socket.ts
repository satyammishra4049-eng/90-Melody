// socket.ts — HTTP polling fallback for Vercel serverless
// Socket.io requires a persistent TCP connection which Vercel's serverless
// functions do not support. We expose the same interface as the old socket
// service so the rest of the app needs no changes — but internally we
// use the existing REST API endpoints (/api/online-users/*).

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api');

/** Fetch the current online count from the REST API. */
export const fetchOnlineCount = async (): Promise<number> => {
  try {
    // 1. Get or create a session ID for this user
    let sessionId = sessionStorage.getItem('melody_session_id');
    if (!sessionId) {
      sessionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('melody_session_id', sessionId);
    }

    // 2. Send heartbeat to register/update session
    await fetch(`${API_BASE}/online-users/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });

    // 3. Get the count
    const res = await fetch(`${API_BASE}/online-users/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.count === 'number' ? data.count : 0;
  } catch {
    return 0;
  }
};

// Keep exports so any legacy import of getSocket / disconnectSocket
// doesn't break at compile-time. They are intentional no-ops here.
export const getSocket = () => null;
export const disconnectSocket = () => undefined;

