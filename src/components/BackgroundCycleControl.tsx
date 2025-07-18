import React from 'react';
import './BackgroundCycleControl.css';

interface BackgroundCycleControlProps {
  isCycling: boolean;
  onToggleCycling: () => void;
  cycleInterval: number;
  onSetCycleInterval: (seconds: number) => void;
  currentThemeName: string;
  isRunning: boolean;
  useImages: boolean;
  onToggleUseImages: () => void;
  isLoadingImage: boolean;
  disabled?: boolean;
}

export const BackgroundCycleControl: React.FC<BackgroundCycleControlProps> = ({
  isCycling,
  onToggleCycling,
  cycleInterval,
  onSetCycleInterval,
  currentThemeName,
  isRunning,
  useImages,
  onToggleUseImages,
  isLoadingImage,
  disabled = false
}) => {
  const intervalOptions = [
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
  ];

  return (
    <div className="background-cycle-control">
      <div className="cycle-control-header">
        <span className="cycle-icon" role="img" aria-hidden="true">🎨</span>
        <div>
          <h4 className="cycle-title">Background Cycling</h4>
          <p className="cycle-subtitle">
            {isCycling && isRunning 
              ? `Currently cycling every ${cycleInterval}s` 
              : 'Automatically change background while timer runs'
            }
          </p>
        </div>
      </div>

              <div className="cycle-controls">
          <div className="cycle-toggle-section">
            <button
              onClick={onToggleCycling}
              disabled={disabled}
              className={`cycle-toggle-btn ${isCycling ? 'enabled' : 'disabled'}`}
              aria-label={`${isCycling ? 'Disable' : 'Enable'} background cycling`}
            >
              <span className="toggle-icon" role="img" aria-hidden="true">
                {isCycling ? '🔄' : '⏸️'}
              </span>
              <span className="toggle-text">
                {isCycling ? 'Cycling' : 'Static'}
              </span>
            </button>
            
            <button
              onClick={onToggleUseImages}
              disabled={disabled}
              className={`image-toggle-btn ${useImages ? 'enabled' : 'disabled'}`}
              aria-label={`${useImages ? 'Disable' : 'Enable'} background images`}
            >
              <span className="toggle-icon" role="img" aria-hidden="true">
                {isLoadingImage ? '⏳' : useImages ? '🖼️' : '🎨'}
              </span>
              <span className="toggle-text">
                {isLoadingImage ? 'Loading...' : useImages ? 'Images' : 'Gradients'}
              </span>
            </button>
            
            {isCycling && isRunning && (
              <div className="current-theme-display">
                <span className="theme-label">Current:</span>
                <span className="theme-name">{currentThemeName}</span>
                {isLoadingImage && (
                  <span className="loading-indicator">⏳</span>
                )}
              </div>
            )}
          </div>

        {isCycling && (
          <div className="interval-control-section">
            <label className="interval-label">Cycle Interval:</label>
            <div className="interval-options">
              {intervalOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSetCycleInterval(option.value)}
                  className={`interval-btn ${cycleInterval === option.value ? 'active' : ''}`}
                  disabled={disabled}
                  aria-label={`Set cycle interval to ${option.label}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isCycling && !isRunning && (
        <div className="cycle-info">
          <span className="info-icon" role="img" aria-hidden="true">💡</span>
          <span>Background will start cycling when timer is running</span>
        </div>
      )}
    </div>
  );
}; 