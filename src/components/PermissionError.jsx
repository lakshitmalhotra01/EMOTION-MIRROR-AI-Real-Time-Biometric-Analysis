import React from 'react';
import { motion } from 'framer-motion';

/**
 * Centered error dialog displaying detailed steps to grant camera permissions.
 */
export default function PermissionError({ errorType, onRetry }) {
  const isNotFound = errorType === 'not_found';

  return (
    <div className="w-full max-w-md mx-auto my-auto p-1 bg-gradient-to-br from-rose-500/30 via-slate-900 to-slate-950 rounded-lg">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-panel p-6 rounded-lg text-slate-200 border-rose-950/55 text-center relative overflow-hidden"
      >
        {/* Subtle background red glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />

        <div className="w-16 h-16 mx-auto mb-4 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full border border-rose-500/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="font-orbitron font-bold text-lg text-rose-400 tracking-wider uppercase mb-2">
          {isNotFound ? 'NO FEED DEVICE FOUND' : 'BIOMETRIC STREAM BLOCKED'}
        </h3>
        
        <p className="font-mono text-xs text-slate-400 mb-6 leading-relaxed">
          {isNotFound 
            ? 'The system was unable to detect any camera/video hardware connected to this station.'
            : 'Access to the imaging sensor was denied by the browser security policy.'
          }
        </p>

        {/* Browser Permission Reset Guide */}
        <div className="bg-slate-950/70 border border-slate-900 rounded p-4 text-left mb-6 space-y-3 font-mono text-[11px] text-slate-400">
          <span className="font-orbitron text-[9px] text-rose-500 tracking-wider uppercase block font-semibold">
            Instruction Protocol:
          </span>
          {isNotFound ? (
            <ul className="list-disc list-inside space-y-1.5">
              <li>Check physical webcam USB connectivity.</li>
              <li>Ensure the camera driver is enabled in Device Manager.</li>
              <li>Close other applications currently capturing video (e.g. Zoom, Teams).</li>
            </ul>
          ) : (
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Look at the address bar near the top-left of the browser window.</li>
              <li>Click the <span className="text-rose-400 font-bold">Lock 🔒 or Camera 📹</span> icon.</li>
              <li>Toggle permission for camera access to <span className="text-emerald-400 font-bold">Allow</span>.</li>
              <li>Reload this window to re-initialize biometric calibration.</li>
            </ol>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={onRetry}
          className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-500 transition-colors text-white font-orbitron font-bold text-xs rounded tracking-widest uppercase border border-rose-500 shadow-lg shadow-rose-950/50"
        >
          {isNotFound ? 'RE-SCAN FOR HARDWARE' : 'RETRY CAMERA ACCESS'}
        </button>
      </motion.div>
    </div>
  );
}
