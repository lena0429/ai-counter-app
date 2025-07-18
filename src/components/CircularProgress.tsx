import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  radius?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  ariaLabel?: string;
  backgroundCycle?: {
    currentBackground: string;
    nextBackground: string;
    isTransitioning: boolean;
    isCycling: boolean;
    isRunning: boolean;
  };
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 200,
  strokeWidth = 8,
  radius: customRadius,
  showPercentage = true,
  showLabel = true,
  label = 'Complete',
  className = '',
  ariaLabel,
  backgroundCycle
}) => {
  // Calculate radius if not provided
  const radius = customRadius || (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Default aria label if not provided
  const defaultAriaLabel = ariaLabel || `Progress: ${Math.round(percentage)}% complete`;

  return (
    <div 
      className={`circular-progress-container ${className} ${backgroundCycle?.isTransitioning ? 'transitioning' : ''}`}
      style={{
        background: backgroundCycle?.isCycling && backgroundCycle?.isRunning ? backgroundCycle.currentBackground : undefined,
        '--next-background': backgroundCycle?.isCycling && backgroundCycle?.isRunning ? backgroundCycle.nextBackground : undefined,
      } as React.CSSProperties}
      aria-label="Progress indicator"
    >
      <div className="circular-progress">
        <svg
          className="progress-ring"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={defaultAriaLabel}
        >
          {/* SVG Definitions for Gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="50%" stopColor="#8BC34A" />
              <stop offset="100%" stopColor="#CDDC39" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            className="progress-ring-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            className="progress-ring-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          
          {/* Animated dots */}
          <circle
            className="progress-dot"
            cx={size / 2}
            cy={strokeWidth + 4}
            r="4"
            fill="white"
          />
        </svg>
        
        {/* Progress text overlay */}
        {(showPercentage || showLabel) && (
          <div className="progress-text-overlay">
            {showPercentage && (
              <span className="progress-percentage" aria-live="polite">
                {Math.round(percentage)}%
              </span>
            )}
            {showLabel && (
              <span className="progress-label">{label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircularProgress; 