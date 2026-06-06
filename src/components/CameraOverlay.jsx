import React from 'react';
import { motion } from 'framer-motion';
import './CameraOverlay.css';

// Emotion → neon border colour mapping
const EMOTION_COLORS = {
  happy:     '#14b8a6',
  sad:       '#f43f5e',
  angry:     '#f59e0b',
  surprised: '#a855f7',
  fearful:   '#6366f1',
  disgusted: '#10b981',
  neutral:   '#475569',
};

/**
 * CameraOverlay
 * Wraps the webcam feed with:
 * - Animated neon/lightning border that changes colour per emotion
 * - Corner bracket decorations
 * - Pulse glow effect
 */
export default function CameraOverlay({ emotion, children }) {
  const color = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;

  return (
    <div
      className="camera-overlay-wrapper"
      style={{ '--overlay-color': color }}
    >
      {/* Animated pulsing neon border */}
      <motion.div
        className="neon-border"
        animate={{
          boxShadow: [
            `0 0 8px ${color}, inset 0 0 8px ${color}33`,
            `0 0 24px ${color}, inset 0 0 16px ${color}55`,
            `0 0 8px ${color}, inset 0 0 8px ${color}33`,
          ],
          borderColor: color,
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corner bracket decorations */}
      <div className="corner tl" style={{ borderColor: color }} />
      <div className="corner tr" style={{ borderColor: color }} />
      <div className="corner bl" style={{ borderColor: color }} />
      <div className="corner br" style={{ borderColor: color }} />

      {/* Lightning flash overlay */}
      <motion.div
        className="lightning-flash"
        animate={{ opacity: [0, 0, 0.4, 0, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 6 + Math.random() * 4,
          ease: 'easeInOut',
        }}
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}44, transparent 70%)` }}
      />

      {/* Children (webcam feed) */}
      {children}
    </div>
  );
}
