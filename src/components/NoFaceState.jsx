import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated target/empty state shown inside the webcam feed when no faces are in the frame.
 */
export default function NoFaceState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-950/25 pointer-events-none select-none">
      
      {/* Centered biometric targeting grid */}
      <div className="relative flex flex-col items-center">
        {/* Pulse brackets overlay */}
        <motion.div 
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            opacity: [0.4, 0.9, 0.4] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut" 
          }}
          className="relative w-48 h-48 border border-dashed border-teal-500/30 rounded-lg flex items-center justify-center"
        >
          {/* Neon corners for target */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400" />

          {/* Crosshair circle */}
          <div className="w-24 h-24 border border-dashed border-teal-500/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-teal-500/20 rounded-full animate-ping" />
          </div>
        </motion.div>

        {/* Text diagnostics */}
        <div className="mt-6 text-center z-10">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="font-orbitron font-bold text-xs tracking-[0.2em] text-teal-400 uppercase text-glow"
          >
            AWAITING SUBJECT
          </motion.div>
          <p className="font-mono text-[9px] text-slate-500 mt-2 max-w-[200px] leading-relaxed uppercase">
            Step into sensor range to calibrate biometric tracking matrix
          </p>
        </div>
      </div>
    </div>
  );
}
