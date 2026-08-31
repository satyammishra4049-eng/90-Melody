import { useState, useEffect, useRef } from 'react';
import { sendHeartbeat, fetchOnlineCount } from '../services/socket';

const HEARTBEAT_INTERVAL = 10_000; // send keep-alive every 10s (well within 15s TTL)
const COUNT_INTERVAL     =  1_000; // refresh count display every 1s

export const useOnlineUsers = (initialCount = 1) => {
  const [count, setCount] = useState(initialCount);
  const countRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    // ── 1. Register immediately via heartbeat (also gets count) ──────────
    const boot = async () => {
      const n = await sendHeartbeat();
      if (!cancelled.current && n > 0) setCount(n);
    };
    boot();

    // ── 2. Poll count every 1 second ─────────────────────────────────────
    countRef.current = setInterval(async () => {
      if (document.hidden) return; // skip when tab is hidden
      const n = await fetchOnlineCount();
      if (!cancelled.current && n > 0) setCount(n);
    }, COUNT_INTERVAL);

    // ── 3. Send heartbeat every 10 seconds to keep session alive ─────────
    heartRef.current = setInterval(async () => {
      if (document.hidden) return;
      const n = await sendHeartbeat();
      if (!cancelled.current && n > 0) setCount(n);
    }, HEARTBEAT_INTERVAL);

    // ── 4. When tab becomes visible again, re-register immediately ────────
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
      if (countRef.current) clearInterval(countRef.current);
      if (heartRef.current) clearInterval(heartRef.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return count;
};
