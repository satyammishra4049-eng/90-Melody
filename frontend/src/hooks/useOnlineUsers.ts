import { useState, useEffect } from 'react';
import { fetchOnlineCount } from '../services/socket';

export const useOnlineUsers = (initialCount = 39) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const n = await fetchOnlineCount();
      if (!cancelled && n > 0) setCount(n);
    };

    // Fetch immediately on mount, then every 30 seconds
    refresh();
    const interval = setInterval(refresh, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
};

