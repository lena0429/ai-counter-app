import React, { useState, useEffect, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = 0.8; // Slightly slower for better clarity
      speechRef.current.pitch = 1;
      speechRef.current.volume = 0.8;
    }
  }, []);

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

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    // Stop any current speech when toggling off
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
    }
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Counter App</h1>
        
        {/* Mode Selector */}
        <div className="mode-selector">
          <button 
            onClick={() => handleModeSwitch('countup')}
            className={`mode-btn ${mode === 'countup' ? 'active' : ''}`}
          >
            Count Up
          </button>
          <button 
            onClick={() => handleModeSwitch('countdown')}
            className={`mode-btn ${mode === 'countdown' ? 'active' : ''}`}
          >
            Countdown
          </button>
        </div>

        {/* Voice Toggle */}
        {isSpeechSupported && (
          <div className="voice-toggle-section">
            <button
              onClick={handleVoiceToggle}
              className={`voice-toggle-btn ${voiceEnabled ? 'enabled' : 'disabled'}`}
              title={voiceEnabled ? 'Disable voice announcements' : 'Enable voice announcements'}
            >
              <span className="voice-icon">🔊</span>
              <span className="voice-text">
                {voiceEnabled ? 'Voice ON' : 'Voice OFF'}
              </span>
            </button>
            {voiceEnabled && (
              <div className="voice-info">
                Will announce numbers from 10 to 1 during countdown
              </div>
            )}
          </div>
        )}

        {/* Custom Countdown Input */}
        {mode === 'countdown' && (
          <div className="custom-countdown-section">
            <div className="input-group">
              <label htmlFor="countdown-input" className="input-label">
                Set Countdown Time (seconds):
              </label>
              <div className="input-container">
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
                />
                <button
                  onClick={handleSetCustomCountdown}
                  disabled={isRunning || !!inputError}
                  className="set-countdown-btn"
                >
                  Set
                </button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>
          </div>
        )}

        <div className="counter-display">
          <h2>{mode === 'countdown' ? formatTime(getDisplayValue()) : getDisplayValue()}</h2>
          {mode === 'countdown' && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {Math.round(getProgressPercentage())}% Complete
              </div>
            </div>
          )}
        </div>

        <div className="button-container">
          <button 
            onClick={handleStart} 
            disabled={isRunning || (mode === 'countdown' && countdownTime === 0)}
            className="btn btn-start"
          >
            Start
          </button>
          <button 
            onClick={handlePause} 
            disabled={!isRunning}
            className="btn btn-pause"
          >
            Pause
          </button>
          <button 
            onClick={handleReset}
            className="btn btn-reset"
          >
            Reset
          </button>
        </div>
        
        <div className="status">
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
