import { useState, useEffect } from 'react';

export const useClock = () => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      
      setTimeString(`${hours}:${minutesStr}${ampm}`);
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeString;
};
