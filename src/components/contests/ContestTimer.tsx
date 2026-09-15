import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
  endTime: string;
  onExpire?: () => void;
}

export const ContestTimer: React.FC<ContestTimerProps> = ({ endTime, onExpire }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0, isEnded: true };

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEnded: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.isEnded) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  return (
    <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono font-bold text-amber-800">
      <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
      {timeLeft.isEnded ? (
        <span className="text-rose-600">CONTEST ENDED</span>
      ) : (
        <span>
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      )}
    </div>
  );
};
