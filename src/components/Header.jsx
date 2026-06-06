import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Top Navigation Header containing Biometric Status indicators and collapsible Settings Drawer.
 */
export default function Header({ 
  fps, 
  faceCount, 
  settings, 
  updateSettings, 
  isCameraActive, 
  toggleCamera,
  theme,
  setTheme,
  simulatorMode,
  setSimulatorMode
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="relative z-30 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title (No emojis, bigger/bolder) */}
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-themeAccent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h1 className="heading-glitch font-orbitron font-extrabold text-xl sm:text-2xl tracking-widest text-themeAccent text-glow" data-text="EMOTION MIRROR">
                EMOTION MIRROR
              </h1>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider hidden sm:block">
                AI Real-Time Biometric Analysis
              </p>
            </div>
          </div>

          {/* Biometric Telemetry status pills */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Theme Selector */}
            <div className="flex items-center">
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-[9px] sm:text-xs text-slate-300 focus:outline-none focus:border-themeAccent cursor-pointer"
              >
                <option value="cyberpunk">CYBERPUNK</option>
                <option value="biotech">BIO-TECH</option>
                <option value="amber">QUANTUM</option>
                <option value="obsidian">OBSIDIAN</option>
              </select>
            </div>

            {/* Neural Simulator Trigger */}
            <button
              onClick={() => setSimulatorMode(!simulatorMode)}
              className={`px-2 py-1 rounded font-orbitron font-extrabold text-[9px] sm:text-xs tracking-wider uppercase border transition-colors ${
                simulatorMode 
                  ? 'border-rose-500 text-rose-400 bg-rose-950/20 hover:bg-rose-900/20' 
                  : 'border-slate-850 text-slate-400 bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {simulatorMode ? 'SIMULATOR ON' : 'SIMULATOR OFF'}
            </button>



            {/* Stream Status Dot */}
            <div className="flex items-center px-2 py-1 space-x-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] sm:text-xs">
              <span className={`h-2 w-2 rounded-full ${isCameraActive && !simulatorMode ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
              <span className={`hidden md:inline font-bold ${isCameraActive && !simulatorMode ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isCameraActive && !simulatorMode ? 'LIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Toggle Camera Power */}
            <button
              onClick={toggleCamera}
              disabled={simulatorMode}
              className={`p-2 rounded border transition-colors ${
                simulatorMode
                  ? 'border-slate-950 text-slate-700 bg-slate-950/40 cursor-not-allowed'
                  : isCameraActive
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/20'
                    : 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-800'
              }`}
              title={simulatorMode ? 'Webcam disabled in simulator mode' : isCameraActive ? 'Power Down Feed' : 'Initialize Feed'}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded border transition-colors ${
                isSettingsOpen 
                  ? 'border-themeAccent bg-themeAccent/20 text-themeAccent shadow-[0_0_10px_rgba(var(--color-accent),0.2)]'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className={`w-4.5 h-4.5 transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slide down Settings Drawer */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-sm">
              
              {/* Landmark Settings */}
              <div className="space-y-3">
                <span className="font-orbitron text-[10px] text-themeAccent uppercase tracking-widest block font-bold">Landmarks</span>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showLandmarks}
                    onChange={(e) => updateSettings('showLandmarks', e.target.checked)}
                    className="w-4 h-4 accent-themeAccent bg-slate-900 border-slate-700 rounded focus:ring-0"
                  />
                  <span className="text-slate-300 font-mono text-xs">Render 68-Point Mesh</span>
                </label>
              </div>

              {/* Age/Gender Settings */}
              <div className="space-y-3">
                <span className="font-orbitron text-[10px] text-themeAccent uppercase tracking-widest block font-bold">Demographics</span>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showAgeGender}
                    onChange={(e) => updateSettings('showAgeGender', e.target.checked)}
                    className="w-4 h-4 accent-themeAccent bg-slate-900 border-slate-700 rounded focus:ring-0"
                  />
                  <span className="text-slate-300 font-mono text-xs">Estimate Age & Gender</span>
                </label>
              </div>

              {/* Canvas Bar Settings */}
              <div className="space-y-3">
                <span className="font-orbitron text-[10px] text-themeAccent uppercase tracking-widest block font-bold">Hud Analytics</span>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.showConfidenceBars}
                    onChange={(e) => updateSettings('showConfidenceBars', e.target.checked)}
                    className="w-4 h-4 accent-themeAccent bg-slate-900 border-slate-700 rounded focus:ring-0"
                  />
                  <span className="text-slate-300 font-mono text-xs">On-Canvas Sparklines</span>
                </label>
              </div>

              {/* Sensitivity Confidence Slider */}
              <div className="space-y-2 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <span className="font-orbitron text-[10px] text-themeAccent uppercase tracking-widest font-bold">
                    Detection Sensitivity
                  </span>
                  <span className="font-mono text-xs text-themeAccentGlow font-bold">
                    {Math.round(settings.threshold * 100)}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.3"
                  max="0.9"
                  step="0.05"
                  value={settings.threshold}
                  onChange={(e) => updateSettings('threshold', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-themeAccent"
                />
                <div className="flex justify-between font-mono text-[9px] text-slate-500">
                  <span>LO-SENS (0.3)</span>
                  <span>HI-SENS (0.9)</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
