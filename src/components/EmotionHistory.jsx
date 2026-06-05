import React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmotionColor, getEmotionEmoji } from '../utils/emotionHelpers';

/**
 * Scrollable list of the last 30 historical emotion readings.
 */
export default function EmotionHistory({ history }) {
  // Take last 30 entries
  const displayHistory = history.slice(0, 30);

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg flex flex-col h-[320px]">
      {/* HUD Header - bolder and larger */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">BIOMETRIC HISTORY STREAM</span>
        <span>BUFFER_LIMIT: 30_RUNS</span>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-12 gap-2 px-2 py-1 font-mono text-[8px] text-slate-500 uppercase border-b border-slate-900/50 mb-2">
        <div className="col-span-3">TIMESTAMP</div>
        <div className="col-span-2 text-center">FACES</div>
        <div className="col-span-4">DOMINANT AFFECT</div>
        <div className="col-span-3 text-right">CONFIDENCE</div>
      </div>

      {/* History log rows list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
        <AnimatePresence initial={false}>
          {displayHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 italic">
              NO BIOMETRIC DATA RECORDED
            </div>
          ) : (
            displayHistory.map((item) => {
              const emoColor = getEmotionColor(item.dominantEmotion);
              const formattedTime = format(item.timestamp, 'HH:mm:ss');
              const hasFaces = item.faceCount > 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    borderLeftColor: hasFaces ? emoColor : 'rgba(255,255,255,0.05)',
                    backgroundColor: hasFaces ? `${emoColor}0a` : 'transparent'
                  }}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded border border-slate-900 border-l-2 bg-slate-950/20"
                >
                  {/* Timestamp */}
                  <div className="col-span-3 text-slate-400 font-medium">
                    {formattedTime}
                  </div>

                  {/* Face count */}
                  <div className="col-span-2 text-center text-slate-300 font-bold">
                    {item.faceCount.toString().padStart(2, '0')}
                  </div>

                  {/* Dominant emotion + emoji */}
                  <div className="col-span-4 flex items-center space-x-1.5">
                    {hasFaces ? (
                      <>
                        <span>{item.emoji}</span>
                        <span 
                          style={{ color: emoColor }} 
                          className="font-orbitron font-bold uppercase tracking-wider text-[9px]"
                        >
                          {item.dominantEmotion}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-600">STANDBY</span>
                    )}
                  </div>

                  {/* Confidence percent */}
                  <div className="col-span-3 text-right font-bold text-slate-400">
                    {hasFaces ? `${Math.round(item.confidence * 100)}%` : '---'}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
