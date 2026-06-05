import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Renders real-time cognitive metrics: Focus, Stress, and Fatigue indices.
 */
export default function CognitiveTelemetry({ expressions, blinkCount }) {
  
  // Compute scores based on active expressions
  const metrics = useMemo(() => {
    if (!expressions) {
      return { focus: 65, stress: 15, fatigue: 20 };
    }

    const { happy = 0, sad = 0, angry = 0, surprised = 0, neutral = 0, fearful = 0, disgusted = 0 } = expressions;

    // 1. Focus Index: Neutrality and moderate surprise indicate focus. Sadness/anger disrupt it.
    let rawFocus = (neutral * 0.8) + (surprised * 0.4) - (sad * 0.3) - (angry * 0.4) - (fearful * 0.5);
    // Map from -0.8...1.2 to 0...100%
    const focusScore = Math.min(Math.max(Math.round((rawFocus + 0.8) / 2.0 * 100), 10), 100);

    // 2. Stress Index: High anger, fear, disgust, sadness. Low happiness.
    let rawStress = (angry * 0.6) + (fearful * 0.6) + (sad * 0.3) + (disgusted * 0.2) - (happy * 0.5);
    // Map from -0.5...1.2 to 0...100%
    const stressScore = Math.min(Math.max(Math.round((rawStress + 0.5) / 1.7 * 100), 5), 100);

    // 3. Mental Fatigue: Slowly rises with blink frequency and sadness/fear.
    // Base fatigue on blink count slightly fluctuating, sadness, and neutral state duration.
    let rawFatigue = (sad * 0.4) + (fearful * 0.3) + (neutral * 0.1) + ((blinkCount % 10) * 0.05);
    const fatigueScore = Math.min(Math.max(Math.round((rawFatigue) * 100) + 15, 15), 95);

    return {
      focus: focusScore,
      stress: stressScore,
      fatigue: fatigueScore
    };
  }, [expressions, blinkCount]);

  const getMetricColor = (val, type) => {
    if (type === 'focus') {
      return val > 70 ? 'bg-themeAccentGlow' : val > 40 ? 'bg-amber-400' : 'bg-rose-500';
    }
    if (type === 'stress') {
      return val > 65 ? 'bg-rose-500' : val > 35 ? 'bg-amber-400' : 'bg-emerald-500';
    }
    // Fatigue
    return val > 75 ? 'bg-rose-500' : val > 45 ? 'bg-amber-400' : 'bg-themeAccent';
  };

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg flex flex-col justify-between">
      {/* Header without emojis */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">
          COGNITIVE TELEMETRY
        </span>
        <span className="font-mono text-[9px]">HUD_MOD: COG_VAL_v3</span>
      </div>

      <div className="space-y-4">
        {/* Focus Level */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">FOCUS INDEX</span>
            <span className="font-bold text-slate-200">{metrics.focus}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 border border-slate-900 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.focus}%` }}
              className={`h-full ${getMetricColor(metrics.focus, 'focus')}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stress Index */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">STRESS INDEX</span>
            <span className="font-bold text-slate-200">{metrics.stress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 border border-slate-900 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.stress}%` }}
              className={`h-full ${getMetricColor(metrics.stress, 'stress')}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Mental Fatigue */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">MENTAL FATIGUE</span>
            <span className="font-bold text-slate-200">{metrics.fatigue}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 border border-slate-900 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.fatigue}%` }}
              className={`h-full ${getMetricColor(metrics.fatigue, 'fatigue')}`}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
