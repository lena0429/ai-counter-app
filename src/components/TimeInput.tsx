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
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const hasError = inputError || localError;
  const errorMessage = inputError || localError;

  return (
    <div className="time-input-section">
      <div className="input-group">
        <div className="input-header">
          <span className="input-icon" role="img" aria-hidden="true">⏱️</span>
          <div>
            <label className="input-label">
              {label}
            </label>
            <p className="input-subtitle">
              {subtitle}
            </p>
          </div>
        </div>
        
        <div className={`time-input-container ${totalSeconds > 0 ? 'valid' : ''} ${hasError ? 'error' : ''}`}>
          <div className="time-input-fields">
            <div className="time-field">
              <input
                type="number"
                min="0"
                max="99"
                value={timeValues.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                onBlur={handleBlur}
                className="time-input"
                placeholder="0"
                disabled={isRunning || disabled}
                aria-label="Hours"
              />
              <span className="time-label">h</span>
            </div>
            
            <div className="time-separator">:</div>
            
            <div className="time-field">
              <input
                type="number"
                min="0"
                max="59"
                value={timeValues.minutes}
                onChange={(e) => handleInputChange('minutes', e.target.value)}
                onBlur={handleBlur}
                className="time-input"
                placeholder="0"
                disabled={isRunning || disabled}
                aria-label="Minutes"
              />
              <span className="time-label">m</span>
            </div>
            
            <div className="time-separator">:</div>
            
            <div className="time-field">
              <input
                type="number"
                min="0"
                max="59"
                value={timeValues.seconds}
                onChange={(e) => handleInputChange('seconds', e.target.value)}
                onBlur={handleBlur}
                className="time-input"
                placeholder="0"
                disabled={isRunning || disabled}
                aria-label="Seconds"
              />
              <span className="time-label">s</span>
            </div>
          </div>
          
          <div className="time-display">
            <span className="time-display-text">{formatTimeDisplay()}</span>
          </div>
          
          <button
            onClick={onSetTime}
            disabled={isRunning || disabled || !!hasError || totalSeconds === 0}
            className="set-time-btn"
            aria-label="Set time"
          >
            Set Time
          </button>
        </div>
        
        {hasError && (
          <div className="error-message" role="alert">
            <span className="error-icon" role="img" aria-hidden="true">⚠️</span>
            {errorMessage}
          </div>
        )}
        
        <div className="input-subtitle" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          💡 Tip: Enter hours, minutes, and seconds separately for precise time setting
        </div>
      </div>
    </div>
  );
}; 