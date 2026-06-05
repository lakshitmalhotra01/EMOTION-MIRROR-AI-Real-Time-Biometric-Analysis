import { useState, useCallback, useRef } from 'react';
import { calculatePositivityScore } from '../utils/emotionHelpers';

/**
 * Circular buffer hook to store historical readings at a readable, throttled rate.
 */
export function useEmotionHistory(maxSize = 50, throttleMs = 1000) {
  const [history, setHistory] = useState([]);
  const lastAddRef = useRef(0);

  const addReading = useCallback((detections) => {
    const now = Date.now();
    if (now - lastAddRef.current < throttleMs) {
      return; // Throttle log frequency
    }
    lastAddRef.current = now;

    const faceCount = detections.length;
    let dominantEmotion = 'none';
    let confidence = 0;
    let emoji = '✖';
    let positivityScore = 50;

    if (faceCount > 0) {
      const primaryFace = detections[0];
      dominantEmotion = primaryFace.dominantEmotion;
      confidence = primaryFace.confidence;
      emoji = primaryFace.emoji;
      positivityScore = calculatePositivityScore(primaryFace.expressions);
    }

    const newEntry = {
      id: `hist_${now}`,
      timestamp: new Date(),
      faceCount,
      dominantEmotion,
      confidence,
      emoji,
      positivityScore
    };

    setHistory((prev) => {
      // Append newest to front and slice to limit size
      const updated = [newEntry, ...prev];
      if (updated.length > maxSize) {
        return updated.slice(0, maxSize);
      }
      return updated;
    });
  }, [maxSize, throttleMs]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    lastAddRef.current = 0;
  }, []);

  return {
    history,
    addReading,
    clearHistory
  };
}
