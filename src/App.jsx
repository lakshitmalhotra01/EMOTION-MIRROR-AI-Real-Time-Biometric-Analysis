import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import { useWebcam } from './hooks/useWebcam';
import { useFaceDetection } from './hooks/useFaceDetection';
import { useEmotionHistory } from './hooks/useEmotionHistory';
import { useSessionStats } from './hooks/useSessionStats';
import { useRPPG } from './hooks/useRPPG';
import { useLivenessDetection } from './hooks/useLivenessDetection';

// Utilities
import { loadAllModels } from './utils/modelLoader';
import { captureBiometricSnapshot } from './utils/snapshotUtils';
import { calculatePositivityScore, getEmotionColor } from './utils/emotionHelpers';

// Components
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import WebcamFeed from './components/WebcamFeed';
import PermissionError from './components/PermissionError';
import Dashboard from './components/Dashboard';
import SnapshotGallery from './components/SnapshotGallery';

export default function App() {
  // 1. Models loading states
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({
    tinyFaceDetector: { id: 'tinyFaceDetector', name: 'Tiny Face Detector', progress: 0, status: 'pending' },
    faceLandmark68Net: { id: 'faceLandmark68Net', name: '68 Facial Landmark Net', progress: 0, status: 'pending' },
    faceRecognitionNet: { id: 'faceRecognitionNet', name: 'Face Recognition Net', progress: 0, status: 'pending' },
    faceExpressionNet: { id: 'faceExpressionNet', name: 'Face Expression Net', progress: 0, status: 'pending' },
    ageGenderNet: { id: 'ageGenderNet', name: 'Age & Gender Net', progress: 0, status: 'pending' }
  });

  // 2. Theme & Simulator states
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('emotion_mirror_theme');
    return saved || 'cyberpunk';
  });

  const [simulatorMode, setSimulatorMode] = useState(() => {
    const saved = localStorage.getItem('emotion_mirror_simulator');
    return saved === 'true';
  });

  // 3. Settings states
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('emotion_mirror_settings');
    return saved ? JSON.parse(saved) : {
      showLandmarks: true,
      showAgeGender: true,
      showConfidenceBars: true,
      threshold: 0.5
    };
  });

  const [isCameraActive, setIsCameraActive] = useState(true);
  const [snapshots, setSnapshots] = useState(() => {
    const saved = localStorage.getItem('emotion_mirror_snapshots');
    return saved ? JSON.parse(saved).map(s => ({ ...s, timestamp: new Date(s.timestamp) })) : [];
  });

  // Save configurations changes
  useEffect(() => {
    localStorage.setItem('emotion_mirror_settings', JSON.stringify(settings));
  }, [settings]);

  // Save snapshots updates
  useEffect(() => {
    localStorage.setItem('emotion_mirror_snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  // Cache theme and apply class to documentElement
  useEffect(() => {
    localStorage.setItem('emotion_mirror_theme', theme);
    const root = document.documentElement;
    root.className = ''; // Reset
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Cache simulator mode state
  useEffect(() => {
    localStorage.setItem('emotion_mirror_simulator', simulatorMode.toString());
  }, [simulatorMode]);

  const updateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // 4. Initialize model download on mount
  useEffect(() => {
    let active = true;
    const runLoader = async () => {
      try {
        await loadAllModels('/models', (p) => {
          if (active) {
            setLoadingStatus((prev) => ({
              ...prev,
              [p.modelId]: p
            }));
          }
        });
        if (active) {
          setModelsLoaded(true);
        }
      } catch (err) {
        console.error('Failed downloading models weights files:', err);
      }
    };
    runLoader();
    return () => {
      active = false;
    };
  }, []);

  // 5. Hook triggers
  const {
    videoRef,
    permissionError,
    isLoading: isCameraLoading,
    startWebcam,
    stopWebcam
  } = useWebcam();

  const canvasRef = useRef(null);

  const { detections, fps } = useFaceDetection(
    videoRef,
    canvasRef,
    modelsLoaded,
    { ...settings, simulatorMode }
  );

  const { history, addReading, clearHistory } = useEmotionHistory(50, 1000);

  const {
    uptimeSeconds,
    maxConcurrentFaces,
    updateStats,
    resetStats,
    getSessionDominantEmotion,
    formatUptime
  } = useSessionStats();

  // 6. Real-Time Mind Tech Telemetry (rPPG Heart Rate & Liveness Anti-Spoofing)
  const { bpm, hrv, pulseData } = useRPPG(detections, isCameraActive, simulatorMode);
  const { livenessStatus, blinkCount, isSpoofAlert } = useLivenessDetection(detections, isCameraActive, simulatorMode);

  // 7. Connect camera lifecycle
  useEffect(() => {
    // If simulator mode is active, do not turn on camera
    if (modelsLoaded && isCameraActive && !simulatorMode) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [modelsLoaded, isCameraActive, simulatorMode, startWebcam, stopWebcam]);

  // 8. Connect detections telemetry to history and session recorders
  useEffect(() => {
    if ((modelsLoaded && isCameraActive) || simulatorMode) {
      updateStats(detections);
      addReading(detections);
    }
  }, [detections, modelsLoaded, isCameraActive, simulatorMode, updateStats, addReading]);

  // 9. Calculate overall Positivity Quotient
  const currentPositivityScore = detections.length > 0
    ? calculatePositivityScore(detections[0].expressions)
    : history.length > 0 && history[0].faceCount > 0
      ? history[0].positivityScore
      : 50;

  // 10. Dynamic Background Glow transition
  const activeEmotion = detections.length > 0 
    ? detections[0].dominantEmotion 
    : 'neutral';
  
  const activeColor = getEmotionColor(activeEmotion);

  const handleCapture = () => {
    if (canvasRef.current) {
      try {
        const snap = captureBiometricSnapshot(
          videoRef.current,
          canvasRef.current,
          detections
        );
        // Keep max 12 captures
        setSnapshots((prev) => [snap, ...prev.slice(0, 11)]);
      } catch (err) {
        console.error('Capture snapshot failed:', err);
      }
    }
  };

  const handleDeleteSnapshot = (id) => {
    setSnapshots((prev) => prev.filter(s => s.id !== id));
  };

  const handleToggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-darkBg text-slate-200 overflow-x-hidden bg-biometric-grid">
      
      {/* Dynamic Background Glow Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          style={{ 
            backgroundColor: activeColor,
            filter: 'blur(120px)'
          }} 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full opacity-[0.06] transition-colors duration-1000 ease-in-out" 
        />
      </div>

      {/* Boot Loading Screen overlay */}
      <AnimatePresence>
        {!modelsLoaded && (
          <LoadingScreen 
            loadingStatus={loadingStatus} 
            onBypass={() => {
              setSimulatorMode(true);
              setModelsLoaded(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main App HUD */}
      {modelsLoaded && (
        <div className="flex-1 flex flex-col z-10">
          <Header 
            fps={fps}
            faceCount={detections.length}
            settings={settings}
            updateSettings={updateSettings}
            isCameraActive={isCameraActive}
            toggleCamera={handleToggleCamera}
            theme={theme}
            setTheme={setTheme}
            simulatorMode={simulatorMode}
            setSimulatorMode={setSimulatorMode}
          />

          <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex flex-col space-y-6">
            
            {/* Top Layout Grid: Left Feed card vs Right Dashboard statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Webcam Card / Permissions errors */}
              <div className="lg:col-span-7 xl:col-span-7 w-full">
                {permissionError && !simulatorMode ? (
                  <PermissionError 
                    errorType={permissionError} 
                    onRetry={startWebcam} 
                  />
                ) : (
                  <WebcamFeed 
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    faceCount={detections.length}
                    onCapture={handleCapture}
                    isCameraActive={isCameraActive}
                    livenessStatus={livenessStatus}
                    isSpoofAlert={isSpoofAlert}
                    pulseData={pulseData}
                    bpm={bpm}
                    hrv={hrv}
                    simulatorMode={simulatorMode}
                  />
                )}
              </div>

              {/* Right Column: Dashboard grid analytics */}
              <div className="lg:col-span-5 xl:col-span-5 w-full">
                <Dashboard 
                  positivityScore={currentPositivityScore}
                  uptimeStr={formatUptime()}
                  maxFaces={maxConcurrentFaces}
                  sessionDominantEmotion={getSessionDominantEmotion()}
                  activeExpressions={detections.length > 0 ? detections[0].expressions : null}
                  history={history}
                  blinkCount={blinkCount}
                />
              </div>

            </div>

            {/* Bottom Row: Captured Snapshot grid gallery */}
            <SnapshotGallery 
              snapshots={snapshots}
              onDeleteSnapshot={handleDeleteSnapshot}
            />

          </main>
        </div>
      )}
    </div>
  );
}
