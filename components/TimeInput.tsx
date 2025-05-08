"use client"

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  onChange: (timeInSeconds: number) => void;
  className?: string;
}

const TimeInput = ({ onChange, className }: TimeInputProps) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(999, Number(e.target.value)));
    setHours(value);
    updateTotalTime(value, minutes, seconds);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, Number(e.target.value)));
    setMinutes(value);
    updateTotalTime(hours, value, seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, Number(e.target.value)));
    setSeconds(value);
    updateTotalTime(hours, minutes, value);
  };

  const updateTotalTime = (h: number, m: number, s: number) => {
    const totalSeconds = h * 3600 + m * 60 + s;
    onChange(totalSeconds);
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="hours" className="text-white">Hours</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            max="999"
            value={hours}
            onChange={handleHoursChange}
            className="bg-vault-dark/50 border-vault-accent/30 text-white"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="minutes" className="text-white">Minutes</Label>
          <Input
            id="minutes"
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={handleMinutesChange}
            className="bg-vault-dark/50 border-vault-accent/30 text-white"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="seconds" className="text-white">Seconds</Label>
          <Input
            id="seconds"
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={handleSecondsChange}
            className="bg-vault-dark/50 border-vault-accent/30 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
