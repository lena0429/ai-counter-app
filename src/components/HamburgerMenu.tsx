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
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  voiceEnabled,
  onVoiceToggle,
  isRunning,
  onSetCountdown,
  isSpeechSupported
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

  const handlePresetClick = (seconds: number) => {
    onSetCountdown(seconds);
    onCloseMenu();
  };

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
            Theme: {theme} | Voice: {voiceEnabled ? 'ON' : 'OFF'}
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