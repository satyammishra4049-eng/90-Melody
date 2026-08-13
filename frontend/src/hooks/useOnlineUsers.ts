import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';

export const useOnlineUsers = (initialCount = 39) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (data: { count: number }) => {
      if (data && typeof data.count === 'number') {
        setCount(data.count);
      }
    };

    socket.on('onlineUsersUpdated', handleUpdate);

    // Heartbeat every 20 seconds
    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat');
      }
    }, 20000);

    return () => {
      socket.off('onlineUsersUpdated', handleUpdate);
      clearInterval(heartbeat);
    };
  }, []);

  return count;
};
