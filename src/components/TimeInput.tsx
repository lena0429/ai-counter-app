import React, { useState, useEffect } from 'react';
import './TimeInput.css';

interface TimeInputProps {
  totalSeconds: number;
  onTimeChange: (totalSeconds: number) => void;
  onSetTime: () => void;
  isRunning: boolean;
  inputError: string;
  placeholder?: string;
  label: string;
  subtitle: string;
  disabled?: boolean;
}

interface TimeValues {
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  totalSeconds,
  onTimeChange,
  onSetTime,
  isRunning,
  inputError,
  placeholder = "Set time",
  label,
  subtitle,
  disabled = false
}) => {
  const [timeValues, setTimeValues] = useState<TimeValues>({ hours: 0, minutes: 0, seconds: 0 });
  const [localError, setLocalError] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Convert total seconds to hours, minutes, seconds
  useEffect(() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    setTimeValues({ hours, minutes, seconds });
  }, [totalSeconds]);

  // Convert hours, minutes, seconds back to total seconds
  const updateTotalSeconds = (newTimeValues: TimeValues) => {
    const total = newTimeValues.hours * 3600 + newTimeValues.minutes * 60 + newTimeValues.seconds;
    onTimeChange(total);
  };

  const handleInputChange = (field: keyof TimeValues, value: string) => {
    const numValue = parseInt(value) || 0;
    let newTimeValues = { ...timeValues, [field]: numValue };
    
    // Validate input ranges
    if (field === 'hours' && numValue > 99) {
      setLocalError('Hours cannot exceed 99');
      return;
    }
    if (field === 'minutes' && numValue > 59) {
      setLocalError('Minutes cannot exceed 59');
      return;
    }
    if (field === 'seconds' && numValue > 59) {
      setLocalError('Seconds cannot exceed 59');
      return;
    }
    if (numValue < 0) {
      setLocalError('Time values cannot be negative');
      return;
    }

    setLocalError('');
    setTimeValues(newTimeValues);
    updateTotalSeconds(newTimeValues);
  };

  const handleBlur = () => {
    // Normalize time values (e.g., 70 seconds becomes 1 minute 10 seconds)
    let { hours, minutes, seconds } = timeValues;
    
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    
    if (hours > 99) {
      hours = 99;
      minutes = 59;
      seconds = 59;
    }
    
    const normalizedValues = { hours, minutes, seconds };
    setTimeValues(normalizedValues);
    updateTotalSeconds(normalizedValues);
  };

  const formatTimeDisplay = (): string => {
    const { hours, minutes, seconds } = timeValues;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof TimeValues) => {
    if (e.key === 'Enter') {
      onSetTime();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentValue = timeValues[field];
      const maxValue = field === 'hours' ? 99 : 59;
      const newValue = currentValue >= maxValue ? 0 : currentValue + 1;
      handleInputChange(field, newValue.toString());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentValue = timeValues[field];
      const maxValue = field === 'hours' ? 99 : 59;
      const newValue = currentValue <= 0 ? maxValue : currentValue - 1;
      handleInputChange(field, newValue.toString());
    }
  };

  const hasError = inputError || localError;
  const errorMessage = inputError || localError;
  const isValid = totalSeconds > 0 && !hasError;

  return (
    <div className="time-input-section">
      <div className="time-input-header">
        <div className="header-content">
          <span className="header-icon" role="img" aria-hidden="true">⏱️</span>
          <div className="header-text">
            <h3 className="input-title">{label}</h3>
            <p className="input-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className={`time-input-container ${isValid ? 'valid' : ''} ${hasError ? 'error' : ''}`}>
        <div className="time-input-fields">
          <div className={`time-field ${isFocused === 'hours' ? 'focused' : ''}`}>
            <input
              type="number"
              min="0"
              max="99"
              value={timeValues.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              onBlur={() => { handleBlur(); setIsFocused(null); }}
              onFocus={() => setIsFocused('hours')}
              onKeyDown={(e) => handleKeyDown(e, 'hours')}
              className="time-input"
              placeholder="0"
              disabled={isRunning || disabled}
              aria-label="Hours"
            />
            <span className="time-label">Hours</span>
          </div>
          
          <div className="time-separator">:</div>
          
          <div className={`time-field ${isFocused === 'minutes' ? 'focused' : ''}`}>
            <input
              type="number"
              min="0"
              max="59"
              value={timeValues.minutes}
              onChange={(e) => handleInputChange('minutes', e.target.value)}
              onBlur={() => { handleBlur(); setIsFocused(null); }}
              onFocus={() => setIsFocused('minutes')}
              onKeyDown={(e) => handleKeyDown(e, 'minutes')}
              className="time-input"
              placeholder="0"
              disabled={isRunning || disabled}
              aria-label="Minutes"
            />
            <span className="time-label">Minutes</span>
          </div>
          
          <div className="time-separator">:</div>
          
          <div className={`time-field ${isFocused === 'seconds' ? 'focused' : ''}`}>
            <input
              type="number"
              min="0"
              max="59"
              value={timeValues.seconds}
              onChange={(e) => handleInputChange('seconds', e.target.value)}
              onBlur={() => { handleBlur(); setIsFocused(null); }}
              onFocus={() => setIsFocused('seconds')}
              onKeyDown={(e) => handleKeyDown(e, 'seconds')}
              className="time-input"
              placeholder="0"
              disabled={isRunning || disabled}
              aria-label="Seconds"
            />
            <span className="time-label">Seconds</span>
          </div>
          
          <button
            onClick={onSetTime}
            disabled={isRunning || disabled || !!hasError || totalSeconds === 0}
            className="set-time-btn"
            aria-label="Set time"
          >
            <span className="btn-icon" role="img" aria-hidden="true">✓</span>
            <span className="btn-text">Set</span>
          </button>
        </div>
      </div>
      
      {hasError && (
        <div className="error-message" role="alert">
          <span className="error-icon" role="img" aria-hidden="true">⚠️</span>
          <span className="error-text">{errorMessage}</span>
        </div>
      )}
      
      <div className="input-help">
        <span className="help-icon" role="img" aria-hidden="true">💡</span>
        <span className="help-text">
          Use arrow keys to adjust values • Press Enter to set time
        </span>
      </div>
    </div>
  );
}; 