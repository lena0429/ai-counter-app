import { useState, useEffect, useRef } from 'react';

type Mode = 'countup' | 'countdown';

interface UseTimerReturn {
  // State
  count: number;
  isRunning: boolean;
  mode: Mode;
  countdownTime: number;
  customCountdown: number;
  countUpTarget: number;
  showModal: boolean;
  inputError: string;
  
  // Functions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setCountdown: (seconds: number) => void;
  setCountUpTarget: (target: number) => void;
  switchMode: (newMode: Mode) => void;
  closeModal: () => void;
  validateCountdownInput: (value: string) => boolean;
  validateCountUpTarget: (value: string) => boolean;
  handleCustomCountdownChange: (totalSeconds: number) => void;
  handleCountUpTargetChange: (totalSeconds: number) => void;
  handleSetCustomCountdown: () => void;
  handleSetCountUpTarget: () => void;
  handlePresetTarget: (target: number) => void;
  
  // Computed values
  getDisplayValue: () => number;
  getProgressPercentage: () => number;
  getStatusText: () => string;
  formatTime: (seconds: number) => string;
  formatCountUpDisplay: () => string;
  getCountUpTargetDisplay: () => string;
}

export const useTimer = (): UseTimerReturn => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>('countup');
  const [countdownTime, setCountdownTime] = useState(30);
  const [customCountdown, setCustomCountdown] = useState(30);
  const [countUpTarget, setCountUpTarget] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [inputError, setInputError] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Show modal when countdown reaches 0 or count up reaches target
  useEffect(() => {
    if (mode === 'countdown' && countdownTime === 0 && !isRunning) {
      setShowModal(true);
    } else if (mode === 'countup' && countUpTarget > 0 && count >= countUpTarget && !isRunning) {
      setShowModal(true);
    }
  }, [countdownTime, count, countUpTarget, mode, isRunning]);

  // Timer logic
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

  // Validation functions
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

  const validateCountUpTarget = (value: string): boolean => {
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

  // Event handlers
  const handleCustomCountdownChange = (totalSeconds: number) => {
    setCustomCountdown(totalSeconds);
    setInputError('');
  };

  const handleCountUpTargetChange = (totalSeconds: number) => {
    setCountUpTarget(totalSeconds);
    setInputError('');
  };

  const handleSetCustomCountdown = () => {
    if (validateCountdownInput(customCountdown.toString())) {
      setCountdownTime(customCountdown);
      setIsRunning(false);
    }
  };

  const handleSetCountUpTarget = () => {
    if (validateCountUpTarget(countUpTarget.toString())) {
      setIsRunning(false);
    }
  };

  const handlePresetTarget = (target: number) => {
    setCountUpTarget(target);
    setCount(0);
    setIsRunning(false);
    setInputError('');
  };

  // Timer control functions
  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'countup') {
      setCount(0);
    } else {
      setCountdownTime(customCountdown);
    }
  };

  const setCountdown = (seconds: number) => {
    setCustomCountdown(seconds);
    setCountdownTime(seconds);
  };

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'countup') {
      setCount(0);
      setCountUpTarget(60); // Reset count up target to 1 minute
    } else {
      setCountdownTime(customCountdown);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Computed values
  const getDisplayValue = () => {
    return mode === 'countdown' ? countdownTime : count;
  };

  const getProgressPercentage = () => {
    if (mode === 'countup') {
      if (countUpTarget <= 0) return 0;
      return Math.min((count / countUpTarget) * 100, 100);
    } else {
      return ((customCountdown - countdownTime) / customCountdown) * 100;
    }
  };

  const getStatusText = () => {
    if (mode === 'countdown' && countdownTime === 0) {
      return 'Countdown Complete!';
    }
    if (mode === 'countup' && countUpTarget > 0 && count >= countUpTarget) {
      return 'Count Up Complete!';
    }
    return isRunning ? 'Running' : 'Paused';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCountUpDisplay = () => {
    return formatTime(count);
  };

  const getCountUpTargetDisplay = () => {
    if (countUpTarget <= 0) return 'No target set';
    return formatTime(countUpTarget);
  };

  return {
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
    setCountUpTarget,
    switchMode,
    closeModal,
    validateCountdownInput,
    validateCountUpTarget,
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
  };
}; 