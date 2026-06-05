import { useState, useEffect, useRef } from 'react';

/**
 * Biometric Liveness Detection Hook (Anti-Spoofing telemetry)
 * Analyzes Eye Aspect Ratio (EAR) to detect blinking, and measures head rotation/variance
 * to prevent presentation attacks (static photos held in front of the camera).
 */
export function useLivenessDetection(activeDetections, isCameraActive, simulatorMode) {
  const [livenessStatus, setLivenessStatus] = useState('VERIFYING...');
  const [blinkCount, setBlinkCount] = useState(0);
  const [isSpoofAlert, setIsSpoofAlert] = useState(false);

  // References for tracking state across frames
  const lastEyeStateRef = useRef('open'); // 'open' or 'closed'
  const coordinateHistoryRef = useRef([]); // Track face box center coordinates
  const lastBlinkTimeRef = useRef(performance.now());
  const livenessScoreRef = useRef(1.0); // 0.0 to 1.0 liveness score

  // Calculate Euclidean Distance
  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Calculate Eye Aspect Ratio (EAR)
  const calculateEAR = (eyePoints) => {
    if (!eyePoints || eyePoints.length < 6) return 0.3;
    const v1 = getDistance(eyePoints[1], eyePoints[5]);
    const v2 = getDistance(eyePoints[2], eyePoints[4]);
    const h = getDistance(eyePoints[0], eyePoints[3]);
    return (v1 + v2) / (2.0 * h);
  };

  useEffect(() => {
    if (!isCameraActive && !simulatorMode) {
      setLivenessStatus('STANDBY');
      setIsSpoofAlert(false);
      return;
    }

    if (simulatorMode) {
      // In simulator mode, mock liveness: simulate blinking every 4-8 seconds
      const interval = setInterval(() => {
        setBlinkCount((b) => b + 1);
        setLivenessStatus('VERIFIED (SECURE)');
        setIsSpoofAlert(false);
        lastBlinkTimeRef.current = performance.now();
      }, 5000 + Math.random() * 3000);

      setLivenessStatus('VERIFIED (SECURE)');
      return () => clearInterval(interval);
    }

    // Camera Mode Analytics
    if (activeDetections && activeDetections.length > 0) {
      const face = activeDetections[0];
      const landmarks = face.landmarks;
      
      if (landmarks) {
        // Extract eye coordinates
        // Left eye indices: 36 - 41
        // Right eye indices: 42 - 47
        const positions = landmarks.positions;
        const leftEye = positions.slice(36, 42);
        const rightEye = positions.slice(42, 48);

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2.0;

        // Detect Blink State (EAR threshold typically 0.22)
        const isClosed = avgEAR < 0.22;
        const currentState = isClosed ? 'closed' : 'open';

        if (currentState === 'open' && lastEyeStateRef.current === 'closed') {
          // Transitions from closed back to open = Blink registered!
          setBlinkCount((prev) => prev + 1);
          lastBlinkTimeRef.current = performance.now();
        }
        lastEyeStateRef.current = currentState;

        // Track box center variance to check for static images (photo-spoofing)
        const centerX = face.box.x + face.box.width / 2;
        const centerY = face.box.y + face.box.height / 2;
        
        coordinateHistoryRef.current.push({ x: centerX, y: centerY, time: performance.now() });
        // Keep last 60 frames (2 seconds at 30 fps)
        if (coordinateHistoryRef.current.length > 60) {
          coordinateHistoryRef.current.shift();
        }

        // Calculate variance in movement
        if (coordinateHistoryRef.current.length >= 30) {
          const xs = coordinateHistoryRef.current.map(c => c.x);
          const ys = coordinateHistoryRef.current.map(c => c.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);

          const diffX = maxX - minX;
          const diffY = maxY - minY;

          // If the face remains *perfectly* still for 2 seconds (e.g. standard deviation/range is near zero),
          // it could be a photo presentation attack.
          // Real human faces, even when trying to stay still, have natural micro-tremors (at least 1-2 pixels).
          const timeSinceLastBlink = (performance.now() - lastBlinkTimeRef.current) / 1000;
          
          if (diffX < 0.5 && diffY < 0.5 && timeSinceLastBlink > 12) {
            // Suspicious: static coordinate structure and no blinking for 12+ seconds
            livenessScoreRef.current = Math.max(0, livenessScoreRef.current - 0.05);
          } else {
            // Normal human movement/blinking resets score
            livenessScoreRef.current = Math.min(1.0, livenessScoreRef.current + 0.02);
          }

          if (livenessScoreRef.current < 0.4) {
            setLivenessStatus('STATIC (SUSPECT)');
            setIsSpoofAlert(true);
          } else {
            setLivenessStatus('VERIFIED (SECURE)');
            setIsSpoofAlert(false);
          }
        }
      }
    } else {
      // Reset if no face detected
      lastEyeStateRef.current = 'open';
      if (performance.now() - lastBlinkTimeRef.current > 10000) {
        setLivenessStatus('AWAITING SUBJECT');
      }
    }
  }, [activeDetections, isCameraActive, simulatorMode]);

  return { livenessStatus, blinkCount, isSpoofAlert };
}
