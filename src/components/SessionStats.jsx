import React from 'react';
import { getEmotionEmoji, getEmotionColor } from '../utils/emotionHelpers';

/**
 * Panel to showcase session duration chronometer, peak face count, and session mood bias.
 */
export default function SessionStats({ 
  uptimeStr, 
  maxFaces, 
  sessionDominantEmotion 
}) {
  const domEmoji = getEmotionEmoji(sessionDominantEmotion);
  const domColor = getEmotionColor(sessionDominantEmotion);

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg flex flex-col h-full justify-between">
      {/* Title Header - bolder and larger */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">SESSION TELEMETRY</span>
        <span>SYS_LOG: RUN_STATS</span>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 gap-4">
        {/* Clock Duration */}
        <div className="bg-slate-950/60 border border-slate-900 rounded p-3 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] text-slate-500 uppercase block">SESSION UPTIME</span>
            <span className="font-mono text-xl font-bold tracking-wider text-emerald-400">
              {uptimeStr}
            </span>
          </div>
          <div className="text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Peak Concurrency count */}
        <div className="bg-slate-950/60 border border-slate-900 rounded p-3 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] text-slate-500 uppercase block">PEAK SUBJECTS</span>
            <span className="font-mono text-xl font-bold tracking-wider text-themeAccent">
              {maxFaces.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-themeAccent/20 group-hover:text-themeAccent/30 transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Primary Bias */}
        <div className="bg-slate-950/60 border border-slate-900 rounded p-3 flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-0.5">
            <span className="font-mono text-[8px] text-slate-500 uppercase block">SESSION AFFECT BIAS</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{domEmoji}</span>
              <span 
                style={{ color: domColor }} 
                className="font-orbitron text-sm font-black tracking-wider uppercase"
              >
                {sessionDominantEmotion}
              </span>
            </div>
          </div>
          <div 
            style={{ color: `${domColor}33` }} 
            className="group-hover:opacity-40 transition-opacity"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
