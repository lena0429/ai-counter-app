import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

interface HamburgerMenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  isRunning: boolean;
  onSetCountdown: (seconds: number) => void;
  isSpeechSupported: boolean;
  // Background cycling props
  isCycling: boolean;
  onToggleCycling: () => void;
  cycleInterval: number;
  onSetCycleInterval: (seconds: number) => void;
  useImages: boolean;
  onToggleUseImages: () => void;
  isLoadingImage: boolean;
  currentThemeName: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  voiceEnabled,
  onVoiceToggle,
  isRunning,
  onSetCountdown,
  isSpeechSupported,
  // Background cycling props
  isCycling,
  onToggleCycling,
  cycleInterval,
  onSetCycleInterval,
  useImages,
  onToggleUseImages,
  isLoadingImage,
  currentThemeName
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme, isDark } = useTheme();

  // Escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        console.log('Escape key pressed, closing menu');
        onCloseMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, onCloseMenu]);

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
    onVoiceToggle();
    
    // Reset toggling state after animation
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleCyclingToggle = () => {
    console.log('Background cycling toggle clicked! Current isCycling:', isCycling);
    
    if (isToggling) return; // Prevent rapid clicking
    
    setIsToggling(true);
    onToggleCycling();
    
    // Reset toggling state after animation
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleImagesToggle = () => {
    console.log('Images toggle clicked! Current useImages:', useImages);
    
    if (isToggling) return; // Prevent rapid clicking
    
    setIsToggling(true);
    onToggleUseImages();
    
    // Reset toggling state after animation
    setTimeout(() => setIsToggling(false), 300);
  };

  const handlePresetClick = (seconds: number) => {
    onSetCountdown(seconds);
    onCloseMenu();
  };

  const intervalOptions = [
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
  ];

  return (
    <div className="menu-container">
      <button
        ref={hamburgerRef}
        onClick={onToggleMenu}
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
            Theme: {theme} | Voice: {voiceEnabled ? 'ON' : 'OFF'} | Cycling: {isCycling ? 'ON' : 'OFF'}
          </div>
          <button
            onClick={onCloseMenu}
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

          <div className="menu-section">
            <h4>Background Cycling</h4>
            <button
              onClick={handleCyclingToggle}
              className={`menu-item ${isCycling ? 'active' : ''} ${isToggling ? 'toggling' : ''}`}
              aria-pressed={isCycling}
              aria-label={`${isCycling ? 'Disable' : 'Enable'} background cycling`}
              disabled={isToggling}
            >
              <span className="menu-icon" role="img" aria-hidden="true">
                {isCycling ? '🔄' : '⏸️'}
              </span>
              <span className="menu-text">
                Background Cycling
              </span>
              <span className="menu-status">
                {isToggling ? 'Toggling...' : (isCycling ? 'ON' : 'OFF')}
              </span>
            </button>

            <button
              onClick={handleImagesToggle}
              className={`menu-item ${useImages ? 'active' : ''} ${isToggling ? 'toggling' : ''}`}
              aria-pressed={useImages}
              aria-label={`${useImages ? 'Disable' : 'Enable'} background images`}
              disabled={isToggling}
            >
              <span className="menu-icon" role="img" aria-hidden="true">
                {isLoadingImage ? '⏳' : useImages ? '🖼️' : '🎨'}
              </span>
              <span className="menu-text">
                Background Images
              </span>
              <span className="menu-status">
                {isToggling ? 'Toggling...' : (useImages ? 'ON' : 'OFF')}
              </span>
            </button>

            {isCycling && (
              <div className="menu-subsection">
                <div className="subsection-header">
                  <span className="subsection-label">Cycle Interval:</span>
                  <span className="current-interval">{cycleInterval}s</span>
                </div>
                <div className="interval-options">
                  {intervalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSetCycleInterval(option.value)}
                      className={`interval-btn ${cycleInterval === option.value ? 'active' : ''}`}
                      aria-label={`Set cycle interval to ${option.label}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {isCycling && isRunning && (
                  <div className="current-theme-info">
                    <span className="theme-label">Current:</span>
                    <span className="theme-name">{currentThemeName}</span>
                    {isLoadingImage && (
                      <span className="loading-indicator">⏳</span>
                    )}
                  </div>
                )}
              </div>
            )}
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
                onClick={() => handlePresetClick(60)}
                className="preset-btn"
                disabled={isRunning}
              >
                1 min
              </button>
              <button
                onClick={() => handlePresetClick(300)}
                className="preset-btn"
                disabled={isRunning}
              >
                5 min
              </button>
              <button
                onClick={() => handlePresetClick(1800)}
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
  );
};

export default HamburgerMenu; 