import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated model loading screen with progressive stacking bars
 */
export default function LoadingScreen({ loadingStatus, onBypass }) {
  // Compute overall percentage
  const statuses = Object.values(loadingStatus);
  const loadedCount = statuses.filter(s => s.status === 'loaded').length;
  const overallProgress = Math.round((loadedCount / statuses.length) * 100);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 bg-darkBg bg-biometric-grid flex flex-col items-center justify-center p-6 text-slate-100 select-none overflow-hidden"
    >
      {/* Sci-Fi Scanline element */}
      <div className="scanline-element" />

      {/* Cyberpunk circular radar decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="w-[500px] h-[500px] border border-dashed border-themeAccent rounded-full animate-spin [animation-duration:40s]" />
        <div className="w-[700px] h-[700px] border border-double border-themeAccent rounded-full animate-spin [animation-duration:60s] reverse" />
      </div>

      <motion.div 
        variants={itemVariants}
        className="w-full max-w-lg glass-panel p-8 rounded-lg shadow-2xl relative border-themeAccent/20"
      >
        {/* Cyberpunk corner bracket highlights */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-themeAccent" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-themeAccent" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-themeAccent" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-themeAccent" />

        <div className="text-center mb-8">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mb-4 bg-themeAccent/10 p-4 rounded-full border border-themeAccent/30"
          >
            <svg className="w-12 h-12 text-themeAccent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </motion.div>
          
          <h1 className="font-orbitron text-3xl font-extrabold tracking-widest text-themeAccent uppercase text-glow">
            EMOTION MIRROR
          </h1>
          <p className="font-mono text-xs text-themeAccent/80 mt-1.5 uppercase tracking-widest font-bold">
            Initializing Browser Neural Core
          </p>
        </div>

        {/* Stacking Progress Bars per Model */}
        <div className="space-y-4 mb-8">
          {statuses.map((model) => {
            const isLoaded = model.status === 'loaded';
            const isLoading = model.status === 'loading';
            
            return (
              <div key={model.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={isLoaded ? 'text-themeAccent font-semibold' : 'text-slate-400'}>
                    {model.name}
                  </span>
                  <span className={isLoaded ? 'text-themeAccent' : isLoading ? 'text-amber-400 animate-pulse' : 'text-slate-600'}>
                    {isLoaded ? 'ONLINE' : isLoading ? 'INITIALIZING...' : 'STANDBY'}
                  </span>
                </div>
                
                {/* Progress bar container */}
                <div className="w-full h-2 bg-slate-950/80 border border-slate-900 rounded overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isLoaded ? '100%' : isLoading ? '50%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${
                      isLoaded 
                        ? 'bg-gradient-to-r from-themeAccentGlow to-themeAccent shadow-[0_0_8px_rgba(var(--color-accent-glow),0.5)]' 
                        : isLoading 
                          ? 'bg-amber-500' 
                          : 'bg-slate-900'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Combined Main Progress Readout */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <div className="font-mono text-xs text-slate-500">
            CORE TEMP: <span className="text-emerald-500 font-bold">NOMINAL</span><br />
            MODEL CACHE: <span className="text-themeAccent font-bold">READY</span>
          </div>
          
          <div className="text-right">
            <div className="font-orbitron font-extrabold text-2xl text-themeAccent text-glow animate-pulse">
              {overallProgress}%
            </div>
            <div className="font-mono text-[9px] text-themeAccent/60 uppercase tracking-wider font-bold">
              System Boot Up
            </div>
          </div>
        </div>

        {/* Offline Bypass Trigger */}
        {onBypass && (
          <div className="mt-6 border-t border-slate-800/60 pt-4 text-center">
            <button
              onClick={onBypass}
              className="px-4 py-1.5 rounded border border-rose-500/30 text-rose-400 bg-rose-950/10 hover:bg-rose-900/20 font-orbitron font-extrabold text-[9px] sm:text-xs tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)] cursor-pointer"
            >
              Enter Demo Simulator (No Camera Required)
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
