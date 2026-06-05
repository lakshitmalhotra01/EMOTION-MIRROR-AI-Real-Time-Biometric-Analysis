import React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadSnapshot } from '../utils/snapshotUtils';
import { getEmotionColor, getEmotionEmoji } from '../utils/emotionHelpers';

/**
 * Grid panel rendering saved biometric snapshots with metadata overlays.
 */
export default function SnapshotGallery({ snapshots, onDeleteSnapshot }) {
  const exportAnalyticsReport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshots, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `biometric-analytics-report-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed exporting report:', err);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg flex flex-col w-full min-h-[200px]">
      {/* HUD Header - bolder and larger */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">BIOMETRIC SNAPSHOT GALLERY</span>
        <div className="flex items-center space-x-3">
          <span>REGISTRY: {snapshots.length}/12 CAPTURES</span>
          {snapshots.length > 0 && (
            <button
              onClick={exportAnalyticsReport}
              className="px-2 py-0.5 rounded border border-themeAccent/45 text-themeAccent bg-themeAccent/5 hover:bg-themeAccent/10 font-orbitron font-extrabold text-[8px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Export Report
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <AnimatePresence>
          {snapshots.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-slate-600 font-mono text-xs border border-dashed border-slate-900 rounded">
              <svg className="w-8 h-8 mb-2 opacity-30 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>NO BIOMETRIC CAPTURES ON FILE</span>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {snapshots.map((snap) => {
                const emoColor = getEmotionColor(snap.dominantEmotion);
                const emoEmoji = getEmotionEmoji(snap.dominantEmotion);
                const formattedTime = format(snap.timestamp, 'HH:mm:ss');
                const genderSymbol = snap.gender === 'male' ? '♂' : snap.gender === 'female' ? '♀' : '⚧';

                return (
                  <motion.div
                    key={snap.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                    style={{ borderColor: `${emoColor}33` }}
                    className="relative bg-slate-950 border rounded-lg overflow-hidden group hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] transition-all flex flex-col"
                  >
                    {/* Capture thumbnail image */}
                    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                      <img 
                        src={snap.dataUrl} 
                        alt="Biometric Capture"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Dominant Affect floating badge */}
                      <span 
                        style={{ backgroundColor: `${emoColor}d0` }}
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-orbitron font-bold text-slate-950 uppercase flex items-center space-x-0.5"
                      >
                        <span>{emoEmoji}</span>
                        <span>{snap.dominantEmotion.slice(0, 4)}</span>
                      </span>

                      {/* Uptime Tag */}
                      <span className="absolute bottom-1 right-1 px-1 bg-slate-950/80 rounded font-mono text-[7px] text-slate-400">
                        {formattedTime}
                      </span>
                    </div>

                    {/* Meta info footer */}
                    <div className="p-2 flex-1 flex flex-col justify-between font-mono text-[8px] text-slate-400 bg-slate-950">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-500">BIOTYPE:</span>
                        <span className="font-bold text-slate-200 uppercase">
                          {genderSymbol} ~{Math.round(snap.age)} YRS
                        </span>
                      </div>
                      
                      {/* Capture download & delete buttons */}
                      <div className="flex items-center space-x-1 mt-1 border-t border-slate-900 pt-1.5">
                        <button
                          onClick={() => downloadSnapshot(snap)}
                          className="flex-1 py-1 rounded bg-teal-950/40 text-teal-400 border border-teal-900 hover:bg-teal-900/40 transition-colors font-orbitron font-bold text-[8px] uppercase tracking-wider flex items-center justify-center space-x-1"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>DL</span>
                        </button>
                        <button
                          onClick={() => onDeleteSnapshot(snap.id)}
                          className="p-1 rounded bg-rose-950/30 text-rose-500 border border-rose-950 hover:bg-rose-900/40 transition-colors"
                          title="Purge Capture"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
