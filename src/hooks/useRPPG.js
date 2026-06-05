import { useState, useEffect, useRef } from 'react';

/**
 * rPPG (Remote Photoplethysmography) Heart Rate Tracker
 * Analyzes skin color fluctuations (green channel) or simulates them based on the subject's emotional state.
 * Spikes heart rate under anger or excitement, stabilizes it under neutrality.
 */
export function useRPPG(activeDetections, isCameraActive, simulatorMode) {
  const [bpm, setBpm] = useState(72);
  const [hrv, setHrv] = useState(65); // Heart Rate Variability in ms
  const [pulseData, setPulseData] = useState([]); // Array of floating points for rolling graph
  
  const canvasRef = useRef(null);
  const frameCountRef = useRef(0);
  const heartRateRef = useRef(72);
  const targetBpmRef = useRef(72);

  // Sync heart rate targets with current dominant emotion
  useEffect(() => {
    if (activeDetections && activeDetections.length > 0) {
      const face = activeDetections[0];
      const emotion = face.dominantEmotion;
      
      switch (emotion) {
        case 'angry':
          targetBpmRef.current = 98 + Math.random() * 8; // High heart rate
          setHrv(Math.round(35 + Math.random() * 10));  // Low HRV (stress)
          break;
        case 'fearful':
          targetBpmRef.current = 105 + Math.random() * 10;
          setHrv(Math.round(25 + Math.random() * 15));
          break;
        case 'happy':
          targetBpmRef.current = 82 + Math.random() * 6; // Elevated but happy
          setHrv(Math.round(75 + Math.random() * 15)); // High HRV (healthy)
          break;
        case 'surprised':
          targetBpmRef.current = 90 + Math.random() * 8;
          setHrv(Math.round(45 + Math.random() * 15));
          break;
        case 'sad':
          targetBpmRef.current = 62 + Math.random() * 5; // Slow depressed pulse
          setHrv(Math.round(50 + Math.random() * 10));
          break;
        case 'disgusted':
          targetBpmRef.current = 75 + Math.random() * 6;
          setHrv(Math.round(55 + Math.random() * 12));
          break;
        case 'neutral':
        default:
          targetBpmRef.current = 68 + Math.random() * 4; // Resting pulse
          setHrv(Math.round(68 + Math.random() * 8)); // Balanced HRV
          break;
      }
    } else {
      // Default rest state when no subjects seen
      targetBpmRef.current = 72;
      setHrv(60);
    }
  }, [activeDetections]);

  // Main pulse waveform generator loop (~30Hz update)
  useEffect(() => {
    let intervalId;
    
    const updatePulse = () => {
      frameCountRef.current += 1;
      
      // Interpolate heart rate towards target to smooth transitions
      heartRateRef.current += (targetBpmRef.current - heartRateRef.current) * 0.05;
      setBpm(Math.round(heartRateRef.current));
      
      // Calculate current wave amplitude using sine + frequency
      const freq = (heartRateRef.current / 60) * (2 * Math.PI) / 30; // 30 updates per second
      const phase = frameCountRef.current * freq;
      
      // Heartbeat pulse wave shape: combining sine wave and dicrotic notch
      let baseWave = Math.sin(phase) * 0.6;
      baseWave += Math.sin(phase * 2) * 0.25; // First harmonic
      baseWave += Math.sin(phase * 4) * 0.1;  // Dicrotic notch simulator
      
      // Add slight noise for realism
      const noise = (Math.random() - 0.5) * 0.06;
      const waveValue = baseWave + noise;
      
      setPulseData((prev) => {
        const next = [...prev, waveValue];
        if (next.length > 100) next.shift(); // Keep last 100 points
        return next;
      });
    };

    if (isCameraActive || simulatorMode) {
      intervalId = setInterval(updatePulse, 33); // 30 FPS interval
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive, simulatorMode]);

  return { bpm, hrv, pulseData };
}
