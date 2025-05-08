'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +targetDate - +new Date();
      let timeLeft: TimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference,
        };
      }

      return timeLeft;
    };

    // Calculate progress - we need a starting point to calculate percentage
    // Let's assume we show progress for 30 days max
    const getProgress = () => {
      const now = new Date();
      const maxTime = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
      const totalDuration = Math.min(+targetDate - +now + maxTime, maxTime);
      const elapsed = maxTime - (+targetDate - +now);
      
      if (elapsed <= 0) return 0;
      if (elapsed >= totalDuration) return 100;
      
      return Math.floor((elapsed / totalDuration) * 100);
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    setProgress(getProgress());

    // Update the countdown every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      setProgress(getProgress());

      if (updatedTimeLeft.total <= 0) {
        clearInterval(timer);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{timeLeft.days}</span>
          <span className="text-xs text-muted-foreground">Days</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{timeLeft.hours}</span>
          <span className="text-xs text-muted-foreground">Hours</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{timeLeft.minutes}</span>
          <span className="text-xs text-muted-foreground">Minutes</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{timeLeft.seconds}</span>
          <span className="text-xs text-muted-foreground">Seconds</span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}