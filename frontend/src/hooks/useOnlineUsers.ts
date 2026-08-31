import { useState, useEffect, useRef } from 'react';
import { sendHeartbeat, fetchOnlineCount } from '../services/socket';

// Heartbeat must be < ACTIVE_THRESHOLD_MS (20s) on the server.
// 5s gives plenty of margin even with slow networks.
const HEARTBEAT_INTERVAL = 5_000;  // keep session alive every 5s
const COUNT_INTERVAL     = 2_000;  // refresh display every 2s

export const useOnlineUsers = (initialCount = 1) => {
  const [count, setCount] = useState(initialCount);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    // ── 1. Register immediately on mount ─────────────────────────────────
    sendHeartbeat().then((n) => {
      if (!cancelled.current && n > 0) setCount(n);
    });

    // ── 2. Poll count every 2 seconds ─────────────────────────────────────
    const countTimer = setInterval(async () => {
      if (document.hidden) return;
      const n = await fetchOnlineCount();
      if (!cancelled.current && n > 0) setCount(n);
    }, COUNT_INTERVAL);

    // ── 3. Send heartbeat every 5 seconds to keep session alive ───────────
    const heartTimer = setInterval(async () => {
      if (document.hidden) return;
      const n = await sendHeartbeat();
      if (!cancelled.current && n > 0) setCount(n);
    }, HEARTBEAT_INTERVAL);

    // ── 4. Re-register immediately when tab becomes visible ───────────────
    const onVisible = () => {
      if (!document.hidden) {
        sendHeartbeat().then((n) => {
          if (!cancelled.current && n > 0) setCount(n);
        });
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled.current = true;
      clearInterval(countTimer);
      clearInterval(heartTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return count;
};
