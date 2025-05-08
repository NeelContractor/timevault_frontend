'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ControllerRenderProps } from 'react-hook-form';

interface TimePickerProps {
  field?: ControllerRenderProps<any, "unlockTime">;
}

export function TimePicker({ field }: TimePickerProps) {
  const [hours, setHours] = useState<string>('12');
  const [minutes, setMinutes] = useState<string>('00');
  const [seconds, setSeconds] = useState<string>('00');
  const [isOpen, setIsOpen] = useState(false);
  
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (field?.value) {
      const [h, m, s] = field.value.split(':');
      setHours(h);
      setMinutes(m);
      setSeconds(s || '00');
    }
  }, [field?.value]);
  
  const updateField = () => {
    if (!field) return;
    
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const formattedSeconds = seconds.padStart(2, '0');
    field.onChange(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
  };
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setHours('');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue >= 0 && numValue <= 23) {
        setHours(numValue.toString());
      }
    }
  };
  
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setMinutes('');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue >= 0 && numValue <= 59) {
        setMinutes(numValue.toString());
      }
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setSeconds('');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue >= 0 && numValue <= 59) {
        setSeconds(numValue.toString());
      }
    }
  };
  
  const handleHoursBlur = () => {
    if (hours === '') {
      setHours('00');
    } else {
      setHours(hours.padStart(2, '0'));
    }
    updateField();
  };
  
  const handleMinutesBlur = () => {
    if (minutes === '') {
      setMinutes('00');
    } else {
      setMinutes(minutes.padStart(2, '0'));
    }
    updateField();
  };

  const handleSecondsBlur = () => {
    if (seconds === '') {
      setSeconds('00');
    } else {
      setSeconds(seconds.padStart(2, '0'));
    }
    updateField();
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'hours' | 'minutes' | 'seconds') => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const step = e.key === 'ArrowUp' ? 1 : -1;
      
      if (type === 'hours') {
        let newValue = parseInt(hours || '0', 10) + step;
        if (newValue > 23) newValue = 0;
        if (newValue < 0) newValue = 23;
        setHours(newValue.toString().padStart(2, '0'));
      } else if (type === 'minutes') {
        let newValue = parseInt(minutes || '0', 10) + step;
        if (newValue > 59) newValue = 0;
        if (newValue < 0) newValue = 59;
        setMinutes(newValue.toString().padStart(2, '0'));
      } else {
        let newValue = parseInt(seconds || '0', 10) + step;
        if (newValue > 59) newValue = 0;
        if (newValue < 0) newValue = 59;
        setSeconds(newValue.toString().padStart(2, '0'));
      }
      
      setTimeout(updateField, 0);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-black/30 border-white/10"
          type="button"
        >
          <Clock className="mr-2 h-4 w-4 opacity-50" />
          {hours.padStart(2, '0')}:{minutes.padStart(2, '0')}:{seconds.padStart(2, '0')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="start">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hours (0-23)</label>
              <Input
                ref={hoursInputRef}
                type="text"
                inputMode="numeric"
                value={hours}
                onChange={handleHoursChange}
                onBlur={handleHoursBlur}
                onKeyDown={(e) => handleKeyDown(e, 'hours')}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Minutes (0-59)</label>
              <Input
                ref={minutesInputRef}
                type="text"
                inputMode="numeric"
                value={minutes}
                onChange={handleMinutesChange}
                onBlur={handleMinutesBlur}
                onKeyDown={(e) => handleKeyDown(e, 'minutes')}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Seconds (0-59)</label>
              <Input
                ref={secondsInputRef}
                type="text"
                inputMode="numeric"
                value={seconds}
                onChange={handleSecondsChange}
                onBlur={handleSecondsBlur}
                onKeyDown={(e) => handleKeyDown(e, 'seconds')}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {['00', '06', '12', '18'].map((hour) => (
              <Button
                key={hour}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setHours(hour);
                  updateField();
                }}
                className={hours === hour ? 'bg-primary text-primary-foreground' : ''}
              >
                {hour}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {['00', '15', '30', '45'].map((minute) => (
              <Button
                key={minute}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMinutes(minute);
                  updateField();
                }}
                className={minutes === minute ? 'bg-primary text-primary-foreground' : ''}
              >
                {minute}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['00', '15', '30', '45'].map((second) => (
              <Button
                key={second}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSeconds(second);
                  updateField();
                }}
                className={seconds === second ? 'bg-primary text-primary-foreground' : ''}
              >
                {second}
              </Button>
            ))}
          </div>
          
          <Button
            type="button"
            onClick={() => {
              updateField();
              setIsOpen(false);
            }}
          >
            Set Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}