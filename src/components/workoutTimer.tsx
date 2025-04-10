"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";

export default function WorkoutTimer({
  seconds,
  setSeconds,
}: {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [pause, setPause] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pause) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pause, setSeconds]);

  const formatTime = (s: number) => {
    const secs = s % 60;
    const mins = Math.floor((s / 60) % 60);
    const hrs = Math.floor(s / 3600);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Button
      className="bg-muted text-primary inline-flex items-center justify-center rounded-3xl px-4 py-4 font-mono text-lg font-semibold tracking-widest shadow-sm"
      onClick={() => setPause((prev) => !prev)}
    >
      ⏱ {formatTime(seconds)} {pause ? <Play /> : <Pause />}
    </Button>
  );
}
