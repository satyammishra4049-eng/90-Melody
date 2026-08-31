// socket.ts — HTTP polling for Vercel serverless
// Socket.io requires persistent TCP connections; Vercel serverless doesn't support that.
// Instead: heartbeat every 10s (registers session + returns count in ONE call),
// count polled every 1s from cache, immediate remove on page unload.

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api');

// ── Session ID (stable per tab) ────────────────────────────────────────────
const getSessionId = (): string => {
  let sid = sessionStorage.getItem('melody_session_id');
  if (!sid) {
    sid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('melody_session_id', sid);
  }
  return sid;
};

// ── Heartbeat: sends keep-alive AND gets count in one request ─────────────
export const sendHeartbeat = async (): Promise<number> => {
  try {
    const res = await fetch(`${API_BASE}/online-users/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: getSessionId() }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.count === 'number' ? data.count : 0;
  } catch {
    return 0;
  }
};

// ── Remove session immediately (fire-and-forget on page unload) ────────────
const removeSession = () => {
  const sessionId = sessionStorage.getItem('melody_session_id');
  if (!sessionId) return;
  // Use sendBeacon so the request survives page unload
  const blob = new Blob(
    [JSON.stringify({ sessionId })],
    { type: 'application/json' }
  );
  navigator.sendBeacon(`${API_BASE}/online-users/remove`, blob);
};

// Register unload listeners once
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', removeSession);
  window.addEventListener('beforeunload', removeSession);
}

// ── Fetch online count (only count, no heartbeat) ──────────────────────────
export const fetchOnlineCount = async (): Promise<number> => {
  try {
    const res = await fetch(`${API_BASE}/online-users/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.count === 'number' ? data.count : 0;
  } catch {
    return 0;
  }
};

// Legacy no-ops
export const getSocket = () => null;
export const disconnectSocket = () => undefined;
