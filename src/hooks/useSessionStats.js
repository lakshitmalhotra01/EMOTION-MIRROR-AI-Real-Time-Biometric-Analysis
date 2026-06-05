import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage session stats including active timer, cumulative subjects,
 * and dominant emotion distributions.
 */
export function useSessionStats() {
  const [startTime] = useState(new Date());
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [maxConcurrentFaces, setMaxConcurrentFaces] = useState(0);
  const [emotionFrequency, setEmotionFrequency] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    neutral: 0,
    fearful: 0,
    disgusted: 0
  });

  const lastUpdateRef = useRef(0);

  // Increment Uptime Chronometer
  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateStats = useCallback((detections) => {
    const faceCount = detections.length;
    if (faceCount === 0) return;

    // Throttle stats aggregation to once every 500ms to save CPU
    const now = Date.now();
    if (now - lastUpdateRef.current < 500) return;
    lastUpdateRef.current = now;

    // Track peak concurrency
    if (faceCount > maxConcurrentFaces) {
      setMaxConcurrentFaces(faceCount);
    }

    // Increment frequencies of all detected emotions in frame
    setEmotionFrequency((prev) => {
      const updated = { ...prev };
      detections.forEach((face) => {
        const emo = face.dominantEmotion;
        if (emo && emo !== 'unknown' && emo in updated) {
          updated[emo]++;
        }
      });
      return updated;
    });
  }, [maxConcurrentFaces]);

  const resetStats = useCallback(() => {
    setMaxConcurrentFaces(0);
    setEmotionFrequency({
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      neutral: 0,
      fearful: 0,
      disgusted: 0
    });
    setUptimeSeconds(0);
  }, []);

  // Compute overall dominant emotion for the session
  const getSessionDominantEmotion = useCallback(() => {
    let dominant = 'neutral';
    let maxFreq = -1;
    
    Object.entries(emotionFrequency).forEach(([emo, count]) => {
      if (count > maxFreq) {
        maxFreq = count;
        dominant = emo;
      }
    });

    return maxFreq === 0 ? 'neutral' : dominant;
  }, [emotionFrequency]);

  // Format uptime to HH:MM:SS
  const formatUptime = useCallback(() => {
    const hrs = Math.floor(uptimeSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((uptimeSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (uptimeSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }, [uptimeSeconds]);

  return {
    uptimeSeconds,
    maxConcurrentFaces,
    emotionFrequency,
    updateStats,
    resetStats,
    getSessionDominantEmotion,
    formatUptime
  };
}
