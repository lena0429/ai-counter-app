import React, { useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  const { theme } = useTheme();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay theme-${theme}`} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">
          <p id="modal-message" className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-button" 
            onClick={onClose}
            autoFocus
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 