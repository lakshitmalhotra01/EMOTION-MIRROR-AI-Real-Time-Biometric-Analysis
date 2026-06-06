import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Per-emotion cognitive insights ───────────────────────────────────────────
const INSIGHTS = {
  happy: {
    headline: 'Positive Affect Active',
    tips: [
      'Dopamine & serotonin levels are elevated.',
      'Great time for creative or collaborative tasks.',
      'Social engagement is more rewarding in this state.',
    ],
    color: '#14b8a6',
    icon: '🧠',
  },
  sad: {
    headline: 'Lowered Mood State',
    tips: [
      'Cortisol levels may be slightly elevated.',
      'Consider a 5-minute mindfulness or breathing exercise.',
      '"Every storm runs out of rain." — Stay resilient.',
    ],
    color: '#f43f5e',
    icon: '💭',
  },
  angry: {
    headline: 'Elevated Arousal Detected',
    tips: [
      'Adrenaline & norepinephrine are spiking.',
      'Box breathing: 4s inhale → 4s hold → 4s exhale → repeat.',
      'Step away from the trigger — a 2-minute walk helps.',
    ],
    color: '#f59e0b',
    icon: '⚡',
  },
  surprised: {
    headline: 'Novelty Response Active',
    tips: [
      'Your amygdala just processed an unexpected stimulus.',
      'Curiosity and surprise drive learning pathways.',
      'Capture this moment — novelty boosts memory encoding.',
    ],
    color: '#a855f7',
    icon: '✨',
  },
  fearful: {
    headline: 'Threat Response Mode',
    tips: [
      'Fight-or-flight signals detected in facial muscles.',
      'Grounding: name 5 things you see, 4 you can touch.',
      'Your prefrontal cortex can override the amygdala — breathe.',
    ],
    color: '#6366f1',
    icon: '🛡',
  },
  disgusted: {
    headline: 'Aversive Response Detected',
    tips: [
      'Disgust circuits in the insula cortex are active.',
      'Redirect focus to a neutral or pleasant stimulus.',
      'Physical movement can rapidly shift your emotional baseline.',
    ],
    color: '#10b981',
    icon: '🔄',
  },
  neutral: {
    headline: 'Balanced Cognitive State',
    tips: [
      'Optimal state for analytical and focused work.',
      'Minimal emotional interference with decision-making.',
      'Good time to tackle complex or demanding tasks.',
    ],
    color: '#64748b',
    icon: '⚖️',
  },
};

// Positivity score bar colour
function scoreColor(score) {
  if (score >= 70) return '#14b8a6';
  if (score >= 45) return '#f59e0b';
  return '#f43f5e';
}

/**
 * CognitivePanel
 * Displays real-time cognitive insight based on detected emotion,
 * a positivity score bar, and expression probability readouts.
 */
export default function CognitivePanel({ currentEmotion, positivityScore, dominantEmotion, expressions }) {
  const emotion = currentEmotion || dominantEmotion || 'neutral';
  const insight = INSIGHTS[emotion] || INSIGHTS.neutral;
  const score = Math.round(positivityScore ?? 50);
  const barColor = scoreColor(score);

  // Top 3 expressions sorted by confidence
  const topExpressions = useMemo(() => {
    if (!expressions) return [];
    return Object.entries(expressions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [expressions]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={emotion}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-xl overflow-hidden"
        style={{ borderColor: `${insight.color}33`, border: `1px solid ${insight.color}44` }}
      >
        {/* Header accent bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${insight.color}, transparent)` }} />

        <div className="p-4 space-y-4">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{insight.icon}</span>
            <div>
              <p className="font-orbitron font-extrabold text-[10px] tracking-widest uppercase"
                style={{ color: insight.color }}>
                COGNITIVE ANALYSIS
              </p>
              <p className="font-mono text-sm font-bold text-slate-200">{insight.headline}</p>
            </div>
          </div>

          {/* Tips */}
          <ul className="space-y-1.5">
            {insight.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 font-mono text-xs text-slate-300">
                <span className="mt-0.5 text-[8px]" style={{ color: insight.color }}>▶</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* Positivity Score bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-orbitron text-[9px] text-slate-500 uppercase tracking-widest">Positivity Index</span>
              <span className="font-mono text-xs font-bold" style={{ color: barColor }}>{score}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: barColor }}
                initial={{ width: '0%' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Expression breakdown (if available) */}
          {topExpressions.length > 0 && (
            <div>
              <p className="font-orbitron text-[9px] text-slate-500 uppercase tracking-widest mb-2">Expression Mix</p>
              <div className="space-y-1">
                {topExpressions.map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-slate-400 w-20 capitalize">{key}</span>
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: insight.color, opacity: 0.7 }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.round(val * 100)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 w-8 text-right">
                      {Math.round(val * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session dominant */}
          {dominantEmotion && (
            <p className="font-mono text-[9px] text-slate-500">
              Session dominant:{' '}
              <span className="font-bold text-slate-300 uppercase">{dominantEmotion}</span>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
