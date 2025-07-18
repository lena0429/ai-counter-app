import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useTimer } from './hooks/useTimer';
import Modal from './Modal';
import HamburgerMenu from './components/HamburgerMenu';
import CircularProgress from './components/CircularProgress';
import { TimeInput } from './components/TimeInput';
import './App.css';

function App() {
  const {
    // State
    count,
    isRunning,
    mode,
    countdownTime,
    customCountdown,
    countUpTarget,
    showModal,
    inputError,
    
    // Functions
    startTimer,
    pauseTimer,
    resetTimer,
    setCountdown,
    switchMode,
    closeModal,
    handleCustomCountdownChange,
    handleCountUpTargetChange,
    handleSetCustomCountdown,
    handleSetCountUpTarget,
    handlePresetTarget,
    
    // Computed values
    getDisplayValue,
    getProgressPercentage,
    getStatusText,
    formatTime,
    formatCountUpDisplay,
    getCountUpTargetDisplay,
  } = useTimer();

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { theme } = useTheme();

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = 0.8; // Slightly slower for better clarity
      speechRef.current.pitch = 1;
      speechRef.current.volume = 0.8;
    }
  }, []);

  // Show modal when countdown reaches 0 or count up reaches target
  useEffect(() => {
    if (mode === 'countdown' && countdownTime === 0 && !isRunning) {
      // Speak "Time's up!" when countdown completes
      if (voiceEnabled && speechRef.current) {
        speechRef.current.text = "Time's up!";
        window.speechSynthesis.speak(speechRef.current);
      }
    } else if (mode === 'countup' && countUpTarget > 0 && count >= countUpTarget && !isRunning) {
      // Speak completion message when count up completes
      if (voiceEnabled && speechRef.current) {
        speechRef.current.text = "Time goal reached!";
        window.speechSynthesis.speak(speechRef.current);
      }
    }
  }, [countdownTime, count, countUpTarget, mode, isRunning, voiceEnabled]);

  // Speak countdown numbers
  useEffect(() => {
    if (voiceEnabled && mode === 'countdown' && isRunning && countdownTime > 0 && countdownTime <= 10) {
      if (speechRef.current) {
        speechRef.current.text = countdownTime.toString();
        window.speechSynthesis.speak(speechRef.current);
      }
    }
  }, [countdownTime, voiceEnabled, mode, isRunning]);

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    // Stop any current speech when toggling off
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSetCountdown = (seconds: number) => {
    setCountdown(seconds);
  };

  const isSpeechSupported = 'speechSynthesis' in window;

  return (
    <div className={`App theme-${theme}`}>
      <header className="App-header">
        {/* Header with Hamburger Menu */}
        <div className="app-header-top">
          <h1 className="app-title">SnapTimer</h1>
          <HamburgerMenu
            isMenuOpen={isMenuOpen}
            onToggleMenu={toggleMenu}
            onCloseMenu={closeMenu}
            voiceEnabled={voiceEnabled}
            onVoiceToggle={handleVoiceToggle}
            isRunning={isRunning}
            onSetCountdown={handleSetCountdown}
            isSpeechSupported={isSpeechSupported}
          />
        </div>

        {/* Mode Selector */}
        <div className="mode-selector" role="tablist" aria-label="Counter modes">
          <button 
            onClick={() => switchMode('countup')}
            className={`mode-btn ${mode === 'countup' ? 'active' : ''}`}
            role="tab"
            aria-selected={mode === 'countup'}
            aria-label="Count up mode"
          >
            Count Up
          </button>
          <button 
            onClick={() => switchMode('countdown')}
            className={`mode-btn ${mode === 'countdown' ? 'active' : ''}`}
            role="tab"
            aria-selected={mode === 'countdown'}
            aria-label="Countdown mode"
          >
            Countdown
          </button>
        </div>

        {/* Count Up Target Input */}
        {mode === 'countup' && (
          <TimeInput
            totalSeconds={countUpTarget}
            onTimeChange={handleCountUpTargetChange}
            onSetTime={handleSetCountUpTarget}
            isRunning={isRunning}
            inputError={inputError}
            label="Set Time Goal"
            subtitle="Enter hours, minutes, and seconds for your count up target"
          />
        )}

        {/* Count Up Preset Buttons */}
        {mode === 'countup' && (
          <div className="preset-section">
            <div className="preset-header">
              <span className="preset-icon" role="img" aria-hidden="true">⚡</span>
              <span className="preset-label">Quick Presets</span>
            </div>
            <div className="preset-buttons">
              <button onClick={() => handlePresetTarget(60)} className="preset-btn" aria-label="Set 1 minute target">1m</button>
              <button onClick={() => handlePresetTarget(300)} className="preset-btn" aria-label="Set 5 minutes target">5m</button>
              <button onClick={() => handlePresetTarget(900)} className="preset-btn" aria-label="Set 15 minutes target">15m</button>
              <button onClick={() => handlePresetTarget(1800)} className="preset-btn" aria-label="Set 30 minutes target">30m</button>
              <button onClick={() => handlePresetTarget(3600)} className="preset-btn" aria-label="Set 1 hour target">1h</button>
              <button onClick={() => handlePresetTarget(7200)} className="preset-btn" aria-label="Set 2 hours target">2h</button>
            </div>
          </div>
        )}

        {/* Custom Countdown Input */}
        {mode === 'countdown' && (
          <TimeInput
            totalSeconds={customCountdown}
            onTimeChange={handleCustomCountdownChange}
            onSetTime={handleSetCustomCountdown}
            isRunning={isRunning}
            inputError={inputError}
            label="Set Countdown Time"
            subtitle="Enter hours, minutes, and seconds for your countdown"
          />
        )}

        {/* Main Counter Display */}
        <div className="counter-display" role="region" aria-label="Counter display">
          <h2 className="counter-value" aria-live="polite">
            {mode === 'countdown' ? formatTime(getDisplayValue()) : formatCountUpDisplay()}
          </h2>
          {mode === 'countup' && countUpTarget > 0 && (
            <div className="target-info">
              <span className="target-label">Target:</span>
              <span className="target-value">{getCountUpTargetDisplay()}</span>
            </div>
          )}
          <CircularProgress
            percentage={getProgressPercentage()}
            size={200}
            strokeWidth={8}
            showPercentage={true}
            showLabel={true}
            label={mode === 'countup' ? 'Progress' : 'Complete'}
            ariaLabel={`${mode === 'countup' ? 'Count up' : 'Countdown'} progress: ${Math.round(getProgressPercentage())}% complete`}
          />
        </div>

        {/* Control Buttons */}
        <div className="button-container" role="group" aria-label="Counter controls">
          <button 
            onClick={startTimer} 
            disabled={isRunning || (mode === 'countdown' && countdownTime === 0)}
            className="btn btn-start"
            aria-label="Start counter"
          >
            Start
          </button>
          <button 
            onClick={pauseTimer} 
            disabled={!isRunning}
            className="btn btn-pause"
            aria-label="Pause counter"
          >
            Pause
          </button>
          <button 
            onClick={resetTimer}
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
        onClose={closeModal}
        title={mode === 'countdown' ? "⏰ Countdown Complete!" : "🎯 Count Up Complete!"}
        message={mode === 'countdown' 
          ? `Your ${customCountdown}-second countdown has finished. Time is up!`
          : `You've reached your time goal of ${getCountUpTargetDisplay()}!`
        }
      />
    </div>
  );
}

export default App;
