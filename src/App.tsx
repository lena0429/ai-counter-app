import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import Modal from './Modal';
import './App.css';

type Mode = 'countup' | 'countdown';

function App() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>('countup');
  const [countdownTime, setCountdownTime] = useState(30);
  const [customCountdown, setCustomCountdown] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [inputError, setInputError] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme, isDark } = useTheme();

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = 0.8; // Slightly slower for better clarity
      speechRef.current.pitch = 1;
      speechRef.current.volume = 0.8;
    }
  }, []);

  // Click outside to close menu - TEMPORARILY DISABLED
  useEffect(() => {
    // Escape key to close menu
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        console.log('Escape key pressed, closing menu');
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Temporarily disabled click outside handler to fix toggle issue
      // document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Show modal when countdown reaches 0
  useEffect(() => {
    if (mode === 'countdown' && countdownTime === 0 && !isRunning) {
      setShowModal(true);
      // Speak "Time's up!" when countdown completes
      if (voiceEnabled && speechRef.current) {
        speechRef.current.text = "Time's up!";
        window.speechSynthesis.speak(speechRef.current);
      }
    }
  }, [countdownTime, mode, isRunning, voiceEnabled]);

  // Speak countdown numbers
  useEffect(() => {
    if (voiceEnabled && mode === 'countdown' && isRunning && countdownTime > 0 && countdownTime <= 10) {
      if (speechRef.current) {
        speechRef.current.text = countdownTime.toString();
        window.speechSynthesis.speak(speechRef.current);
      }
    }
  }, [countdownTime, voiceEnabled, mode, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'countup') {
          setCount(prevCount => prevCount + 1);
        } else {
          setCountdownTime(prevTime => {
            if (prevTime <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const validateCountdownInput = (value: string): boolean => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setInputError('Please enter a valid number');
      return false;
    }
    if (num <= 0) {
      setInputError('Please enter a positive number');
      return false;
    }
    if (num > 9999) {
      setInputError('Please enter a number less than 10,000');
      return false;
    }
    if (!Number.isInteger(num)) {
      setInputError('Please enter a whole number');
      return false;
    }
    setInputError('');
    return true;
  };

  const handleCustomCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCountdown(parseInt(value) || 0);
    
    if (value === '') {
      setInputError('');
    } else {
      validateCountdownInput(value);
    }
  };

  const handleSetCustomCountdown = () => {
    if (validateCountdownInput(customCountdown.toString())) {
      setCountdownTime(customCountdown);
      setIsRunning(false);
    }
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked! Current theme:', theme, 'isDark:', isDark);
    
    if (isToggling) return; // Prevent rapid clicking
    
    setIsToggling(true);
    toggleTheme();
    
    // Reset toggling state after animation
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked! Current voiceEnabled:', voiceEnabled);
    
    if (isToggling) return; // Prevent rapid clicking
    
    setIsToggling(true);
    setVoiceEnabled(!voiceEnabled);
    
    // Stop any current speech when toggling off
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
    }
    
    // Reset toggling state after animation
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'countup') {
      setCount(0);
    } else {
      setCountdownTime(customCountdown);
    }
  };

  const handleModeSwitch = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'countup') {
      setCount(0);
    } else {
      setCountdownTime(customCountdown);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getDisplayValue = () => {
    return mode === 'countup' ? count : countdownTime;
  };

  const getProgressPercentage = () => {
    if (mode === 'countup') {
      return 0; // No progress bar for count up mode
    }
    return ((customCountdown - countdownTime) / customCountdown) * 100;
  };

  const getStatusText = () => {
    if (mode === 'countdown' && countdownTime === 0) {
      return 'Countdown Complete!';
    }
    return isRunning ? 'Running' : 'Paused';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isSpeechSupported = 'speechSynthesis' in window;

  // SVG Circle Progress Bar calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (getProgressPercentage() / 100) * circumference;

  return (
    <div className={`App theme-${theme}`}>
      {/* Menu Overlay - TEMPORARILY DISABLED */}
      {/* {isMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )} */}
      
      <header className="App-header">
        {/* Header with Hamburger Menu */}
        <div className="app-header-top">
          <h1 className="app-title">Counter App</h1>
          <div className="menu-container">
            <button
              ref={hamburgerRef}
              onClick={toggleMenu}
              className="hamburger-menu-btn"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="settings-menu"
            >
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Hamburger Menu - Responsive Design */}
            <div 
              ref={menuRef}
              id="settings-menu"
              className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
              aria-hidden={!isMenuOpen}
            >
              <div className="menu-header">
                <h3>Settings</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Theme: {theme} | Voice: {voiceEnabled ? 'ON' : 'OFF'}
                </div>
                <button
                  onClick={closeMenu}
                  className="menu-close-btn"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              
              <div className="menu-content">
                <div className="menu-section">
                  <h4>Appearance</h4>
                  <button
                    onClick={handleThemeToggle}
                    className={`menu-item ${isDark ? 'active' : ''} ${isToggling ? 'toggling' : ''}`}
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                    aria-pressed={isDark}
                    disabled={isToggling}
                  >
                    <span className="menu-icon" role="img" aria-hidden="true">
                      {isDark ? '🌞' : '🌙'}
                    </span>
                    <span className="menu-text">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className="menu-status">
                      {isToggling ? 'Toggling...' : (isDark ? 'ON' : 'OFF')}
                    </span>
                  </button>
                </div>

                {isSpeechSupported && (
                  <div className="menu-section">
                    <h4>Accessibility</h4>
                    <button
                      onClick={handleVoiceToggle}
                      className={`menu-item ${voiceEnabled ? 'active' : ''} ${isToggling ? 'toggling' : ''}`}
                      aria-pressed={voiceEnabled}
                      aria-label={`${voiceEnabled ? 'Disable' : 'Enable'} voice announcements`}
                      disabled={isToggling}
                    >
                      <span className="menu-icon" role="img" aria-hidden="true">🔊</span>
                      <span className="menu-text">
                        Voice Announcements
                      </span>
                      <span className="menu-status">
                        {isToggling ? 'Toggling...' : (voiceEnabled ? 'ON' : 'OFF')}
                      </span>
                    </button>
                  </div>
                )}

                <div className="menu-section">
                  <h4>Quick Presets</h4>
                  <div className="preset-buttons">
                    <button
                      onClick={() => {
                        setCustomCountdown(60);
                        setCountdownTime(60);
                        closeMenu();
                      }}
                      className="preset-btn"
                      disabled={isRunning}
                    >
                      1 min
                    </button>
                    <button
                      onClick={() => {
                        setCustomCountdown(300);
                        setCountdownTime(300);
                        closeMenu();
                      }}
                      className="preset-btn"
                      disabled={isRunning}
                    >
                      5 min
                    </button>
                    <button
                      onClick={() => {
                        setCustomCountdown(1800);
                        setCountdownTime(1800);
                        closeMenu();
                      }}
                      className="preset-btn"
                      disabled={isRunning}
                    >
                      30 min
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector" role="tablist" aria-label="Counter modes">
          <button 
            onClick={() => handleModeSwitch('countup')}
            className={`mode-btn ${mode === 'countup' ? 'active' : ''}`}
            role="tab"
            aria-selected={mode === 'countup'}
            aria-label="Count up mode"
          >
            Count Up
          </button>
          <button 
            onClick={() => handleModeSwitch('countdown')}
            className={`mode-btn ${mode === 'countdown' ? 'active' : ''}`}
            role="tab"
            aria-selected={mode === 'countdown'}
            aria-label="Countdown mode"
          >
            Countdown
          </button>
        </div>

        {/* Custom Countdown Input */}
        {mode === 'countdown' && (
          <div className="custom-countdown-section">
            <div className="input-group">
              <div className="input-header">
                <span className="input-icon" role="img" aria-hidden="true">⏱️</span>
                <div>
                  <label htmlFor="countdown-input" className="input-label">
                    Set Countdown Time
                  </label>
                  <p className="input-subtitle">
                    Enter a value between 1 and 9,999 seconds
                  </p>
                </div>
              </div>
              <div className={`input-container ${!inputError && customCountdown > 0 ? 'valid' : ''}`}>
                <input
                  id="countdown-input"
                  type="number"
                  min="1"
                  max="9999"
                  value={customCountdown}
                  onChange={handleCustomCountdownChange}
                  className={`countdown-input ${inputError ? 'error' : ''}`}
                  placeholder="Enter seconds (1-9999)"
                  disabled={isRunning}
                  aria-describedby={inputError ? "countdown-error" : "countdown-help"}
                  aria-invalid={!!inputError}
                />
                <button
                  onClick={handleSetCustomCountdown}
                  disabled={isRunning || !!inputError}
                  className="set-countdown-btn"
                  aria-label="Set countdown time"
                >
                  Set Time
                </button>
              </div>
              {inputError && (
                <div id="countdown-error" className="error-message" role="alert">
                  <span className="error-icon" role="img" aria-hidden="true">⚠️</span>
                  {inputError}
                </div>
              )}
              <div id="countdown-help" className="input-subtitle" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                💡 Tip: Use 60 for 1 minute, 300 for 5 minutes, 1800 for 30 minutes
              </div>
            </div>
          </div>
        )}

        {/* Main Counter Display */}
        <div className="counter-display" role="region" aria-label="Counter display">
          <h2 className="counter-value" aria-live="polite">
            {mode === 'countdown' ? formatTime(getDisplayValue()) : getDisplayValue()}
          </h2>
          {mode === 'countdown' && (
            <div className="circular-progress-container" aria-label="Countdown progress">
              <div className="circular-progress">
                <svg
                  className="progress-ring"
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  role="img"
                  aria-label={`Countdown progress: ${Math.round(getProgressPercentage())}% complete`}
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
                    cx="100"
                    cy="100"
                    r={radius}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <circle
                    className="progress-ring-fill"
                    cx="100"
                    cy="100"
                    r={radius}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  {/* Animated dots */}
                  <circle
                    className="progress-dot"
                    cx="100"
                    cy="20"
                    r="4"
                    fill="white"
                  />
                </svg>
                <div className="progress-text-overlay">
                  <span className="progress-percentage" aria-live="polite">
                    {Math.round(getProgressPercentage())}%
                  </span>
                  <span className="progress-label">Complete</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="button-container" role="group" aria-label="Counter controls">
          <button 
            onClick={handleStart} 
            disabled={isRunning || (mode === 'countdown' && countdownTime === 0)}
            className="btn btn-start"
            aria-label="Start counter"
          >
            Start
          </button>
          <button 
            onClick={handlePause} 
            disabled={!isRunning}
            className="btn btn-pause"
            aria-label="Pause counter"
          >
            Pause
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-reset"
            aria-label="Reset counter"
          >
            Reset
          </button>
        </div>
        
        {/* Status Display */}
        <div className="status" role="status" aria-live="polite">
          Status: {getStatusText()}
        </div>
      </header>

      {/* Custom Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="⏰ Countdown Complete!"
        message={`Your ${customCountdown}-second countdown has finished. Time is up!`}
      />
    </div>
  );
}

export default App;
