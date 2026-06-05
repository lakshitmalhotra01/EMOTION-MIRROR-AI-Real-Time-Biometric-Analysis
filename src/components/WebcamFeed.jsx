import React, { useRef, useEffect } from 'react';
import NoFaceState from './NoFaceState';

/**
 * Webcam Feed component. Handles rendering of video stream, canvas detection overlays,
 * remote photoplethysmography (rPPG) cardiac monitor, and liveness banners.
 */
export default function WebcamFeed({ 
  videoRef, 
  canvasRef, 
  faceCount, 
  onCapture,
  isCameraActive,
  livenessStatus = 'STANDBY',
  isSpoofAlert = false,
  pulseData = [],
  bpm = 72,
  hrv = 65,
  simulatorMode = false
}) {
  const pulseCanvasRef = useRef(null);

  // Draw real-time cardiac waveform on the custom mini-canvas overlay
  useEffect(() => {
    const canvas = pulseCanvasRef.current;
    if (!canvas || !pulseData || pulseData.length === 0) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    // Draw mini background grid coordinates
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let i = 0; i < h; i += 8) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Draw the rolling skin absorption waveform
    ctx.strokeStyle = isSpoofAlert ? '#ef4444' : 'rgb(var(--color-accent-glow))';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    const sliceWidth = w / 100;
    for (let i = 0; i < pulseData.length; i++) {
      const x = i * sliceWidth;
      const y = h / 2 - (pulseData[i] * (h / 2.5));
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }, [pulseData, isSpoofAlert]);

  const showOverlay = isCameraActive || simulatorMode;

  return (
    <div className="w-full glass-panel rounded-lg overflow-hidden relative border-slate-800/80 shadow-2xl flex flex-col">
      {/* High-tech scanner header - No emojis, bolder titles */}
      <div className="h-10 border-b border-slate-800 bg-slate-950/60 px-4 flex items-center justify-between font-mono text-[10px] text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="h-1.5 w-1.5 bg-themeAccent rounded-full animate-pulse" />
          <span className="font-orbitron font-extrabold text-themeAccent tracking-wider uppercase">
            SENSOR FEED: {simulatorMode ? 'NEURAL_SIMULATOR' : 'WEBCAM_PRIMARY'}
          </span>
        </div>
        <div>
          <span>RESOL: 640x480</span>
          <span className="mx-2">|</span>
          <span>DEV_TYPE: BIOMETRIC_HUD</span>
        </div>
      </div>

      {/* Frame wrapper */}
      <div className="relative w-full aspect-video bg-slate-950 scanline-container overflow-hidden flex items-center justify-center">
        {/* Neon corner bracket decorations inside viewport */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-themeAccent/40 pointer-events-none z-20" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-themeAccent/40 pointer-events-none z-20" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-themeAccent/40 pointer-events-none z-20" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-themeAccent/40 pointer-events-none z-20" />

        {/* Floating Scan line */}
        {showOverlay && <div className="scanline-element" />}

        {/* Video Element (Hidden if simulatorMode is active) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive && !simulatorMode ? 'opacity-90' : 'opacity-0 absolute'}`}
        />

        {/* Canvas Overlay Element */}
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10 transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Liveness HUD Badge overlay */}
        {showOverlay && (
          <div className={`absolute top-4 right-4 px-2.5 py-0.5 border rounded font-orbitron font-extrabold text-[9px] uppercase tracking-wider z-20 transition-all ${
            isSpoofAlert 
              ? 'border-rose-500 text-rose-400 bg-rose-950/40 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
              : livenessStatus.includes('VERIFIED')
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-slate-800 text-slate-500 bg-slate-950/60'
          }`}>
            Liveness: {livenessStatus}
          </div>
        )}

        {/* rPPG Cardiac Wave Monitor panel overlay */}
        {showOverlay && (
          <div className="absolute bottom-4 left-4 p-2 rounded border border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-20 flex items-center space-x-3 w-[205px]">
            <div className="flex flex-col justify-center select-none">
              <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest block mb-0.5">rPPG PULSE</span>
              <div className="flex items-center space-x-1.5">
                <svg className={`w-3 h-3 text-rose-500 ${bpm > 90 ? '[animation-duration:0.6s]' : '[animation-duration:1s]'} animate-pulse`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-orbitron font-black text-xs text-slate-200">
                  {bpm} <span className="font-mono text-[7px] text-slate-500 font-normal">BPM</span>
                </span>
              </div>
              <span className="font-mono text-[7px] text-slate-400 mt-0.5">HRV: <span className="font-bold">{hrv} ms</span></span>
            </div>
            <canvas 
              ref={pulseCanvasRef} 
              width="105" 
              height="30" 
              className="bg-slate-950/90 border border-slate-900 rounded"
            />
          </div>
        )}

        {/* Standby / Shutdown overlay */}
        {!showOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/95 z-20">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <span className="font-orbitron font-extrabold text-xs tracking-widest text-slate-400">FEED OFFLINE</span>
            <span className="font-mono text-[9px] text-slate-600 mt-1 uppercase max-w-[200px] leading-relaxed">
              Press the power icon or toggle neural simulator to activate imaging sensor
            </span>
          </div>
        )}

        {/* Render target warning if camera is on but zero faces seen */}
        {showOverlay && faceCount === 0 && <NoFaceState />}
      </div>

      {/* Snapshot Control Footer */}
      {showOverlay && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center">
          <div className="font-mono text-[9px] text-slate-500">
            Biometrics analysis running. Press capture to compile metadata.
          </div>
          <button
            onClick={onCapture}
            disabled={faceCount === 0}
            className={`px-4 py-1.5 rounded font-orbitron font-extrabold text-xs tracking-wider uppercase border flex items-center space-x-2 transition-all ${
              faceCount > 0
                ? 'border-themeAccent text-themeAccent bg-themeAccent/10 hover:bg-themeAccent/20 cursor-pointer shadow-[0_0_12px_rgba(var(--color-accent),0.15)]'
                : 'border-slate-800 text-slate-600 bg-slate-900/40 cursor-not-allowed'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Capture Biometrics</span>
          </button>
        </div>
      )}
    </div>
  );
}
