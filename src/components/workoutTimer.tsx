"use client";

import { useState, useEffect } from "react";

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
    return `${String(Math.floor(hours)).padStart(2, "0")}:${String(Math.floor(minutes)).padStart(2, "0")}:${String(Math.floor(seconds)).padStart(2, "0")}`;
  };

  return (
    <div className="bg-muted inline-flex items-center justify-center rounded-3xl px-4 py-2 font-mono text-lg font-semibold tracking-widest shadow-sm">
      ⏱ {formatTime(seconds)}
    </div>
  );
}
