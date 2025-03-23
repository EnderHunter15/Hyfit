'use client';

import { useEffect, useState } from 'react';

export default function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const seconds = s % 60;
    const minutes = Math.floor(s / 60);
    const hours = Math.floor(s / 3600);
    return `${String(Math.floor(hours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  return (
    <div className='inline-flex items-center justify-center px-4 py-2 text-lg font-mono font-semibold tracking-widest bg-muted  shadow-sm rounded-3xl'>
      ⏱ {formatTime(seconds)}
    </div>
  );
}
