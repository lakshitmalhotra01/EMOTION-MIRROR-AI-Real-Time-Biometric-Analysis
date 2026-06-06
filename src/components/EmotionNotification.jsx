import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Emotion-specific configurations: icon, color, quote/message
const EMOTION_CONFIG = {
  happy: {
    icon: '😊',
    color: '#14b8a6',
    bg: 'from-teal-600/90 to-teal-800/90',
    border: 'border-teal-400',
    shadow: '0 0 30px rgba(20,184,166,0.5)',
    label: 'HAPPINESS DETECTED',
    message: 'Keep smiling — your brain releases dopamine when you smile!',
  },
  sad: {
    icon: '😔',
    color: '#f43f5e',
    bg: 'from-rose-700/90 to-slate-900/90',
    border: 'border-rose-400',
    shadow: '0 0 30px rgba(244,63,94,0.5)',
    label: 'LOW MOOD DETECTED',
    message: '"In the middle of every difficulty lies opportunity." — Einstein',
  },
  angry: {
    icon: '😠',
    color: '#f59e0b',
    bg: 'from-amber-600/90 to-red-900/90',
    border: 'border-amber-400',
    shadow: '0 0 30px rgba(245,158,11,0.5)',
    label: 'TENSION DETECTED',
    message: 'Take 3 deep breaths. Inhale 4s → Hold 4s → Exhale 4s.',
  },
  surprised: {
    icon: '😲',
    color: '#a855f7',
    bg: 'from-purple-700/90 to-fuchsia-900/90',
    border: 'border-purple-400',
    shadow: '0 0 30px rgba(168,85,247,0.5)',
    label: 'SURPRISE DETECTED',
    message: 'Your brain loves novelty — stay curious!',
  },
  fearful: {
    icon: '😨',
    color: '#6366f1',
    bg: 'from-indigo-700/90 to-slate-900/90',
    border: 'border-indigo-400',
    shadow: '0 0 30px rgba(99,102,241,0.5)',
    label: 'ANXIETY DETECTED',
    message: 'Ground yourself: name 5 things you can see right now.',
  },
  disgusted: {
    icon: '🤢',
    color: '#10b981',
    bg: 'from-emerald-700/90 to-slate-900/90',
    border: 'border-emerald-400',
    shadow: '0 0 30px rgba(16,185,129,0.5)',
    label: 'DISCOMFORT DETECTED',
    message: 'Shift your environment — a change of scene helps reset your mood.',
  },
  neutral: {
    icon: '😐',
    color: '#64748b',
    bg: 'from-slate-700/90 to-slate-900/90',
    border: 'border-slate-400',
    shadow: '0 0 20px rgba(100,116,139,0.3)',
    label: 'NEUTRAL STATE',
    message: 'Calm and balanced. Perfect state for deep focus.',
  },
};

/**
 * EmotionNotification
 * Rich toast notification that appears at the top-right when emotion changes.
 * Shows icon, label, and a contextual quote/tip.
 */
export default function EmotionNotification({ emotion }) {
  const [show, setShow] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    if (!emotion) return;
    const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
    setCurrentConfig(config);
    setShow(true);
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, [emotion]);

  if (!currentConfig) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={emotion}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed top-20 right-4 z-50 max-w-xs w-72 rounded-xl border backdrop-blur-xl bg-gradient-to-br ${currentConfig.bg} ${currentConfig.border} overflow-hidden`}
          style={{ boxShadow: currentConfig.shadow }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: currentConfig.color }} />

          <div className="px-4 py-3 flex items-start gap-3">
            {/* Emotion icon */}
            <div className="text-3xl mt-0.5 select-none">{currentConfig.icon}</div>

            <div className="flex-1 min-w-0">
              {/* Label */}
              <p className="font-orbitron font-extrabold text-[10px] tracking-widest uppercase mb-1"
                style={{ color: currentConfig.color }}>
                {currentConfig.label}
              </p>
              {/* Quote/tip */}
              <p className="font-mono text-xs text-slate-200 leading-relaxed">
                {currentConfig.message}
              </p>
            </div>
          </div>

          {/* Animated progress bar */}
          <motion.div
            className="h-0.5 origin-left"
            style={{ background: currentConfig.color }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
