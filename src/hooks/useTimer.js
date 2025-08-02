import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (isRunning = false) => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(isRunning);
  const intervalRef = useRef(null);

  // Optimiser la fonction de mise à jour du timer
  const updateTimer = useCallback(() => {
    setTimer(prevTimer => prevTimer + 1);
  }, []);

  // Optimiser la gestion de l'intervalle
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning, updateTimer]);

  // Optimiser les fonctions de contrôle
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimer(0);
    setIsTimerRunning(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  return {
    timer,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
}; 