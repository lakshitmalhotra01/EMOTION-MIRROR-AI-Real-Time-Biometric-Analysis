import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated SVG circular dial showing overall positivity metrics
 */
export default function MoodMeter({ score }) {
  // SVG Ring Calculations
  const radius = 60;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine dynamic accent color and text based on positivity
  let color = '#AAAAAA'; // Neutral
  let moodStatus = 'HOMEOSTASIS';
  let desc = 'Balanced cognitive affect';
  let pulseSpeed = '2s';

  if (score >= 75) {
    color = '#FFD700'; // Happy (Gold)
    moodStatus = 'ENDORPHIN SURGE';
    desc = 'Optimal reward state';
    pulseSpeed = '1s';
  } else if (score >= 60) {
    color = '#B44FFF'; // Surprised (Purple)
    moodStatus = 'COGNITIVE FLUX';
    desc = 'Elevated attention profile';
    pulseSpeed = '1.4s';
  } else if (score <= 35) {
    color = '#FF4444'; // Angry (Red)
    moodStatus = 'THREAT STATE ACTIVE';
    desc = 'Adrenaline escalation';
    pulseSpeed = '0.7s';
  } else if (score <= 48) {
    color = '#4A90D9'; // Sad (Blue)
    moodStatus = 'LIMBIC RETRACT';
    desc = 'Low cognitive dopamine';
    pulseSpeed = '3s';
  }

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg relative flex flex-col items-center justify-center overflow-hidden">
      {/* HUD title - bolder and larger */}
      <div className="w-full flex items-center justify-between border-b border-slate-900 pb-2 mb-4 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">POS-AFFECT MATRIX</span>
        <span>HUD_MOD: METER_v3</span>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Animated radar rings inside the radial meter */}
        <div 
          style={{ 
            borderColor: `${color}15`,
            animationDuration: pulseSpeed
          }}
          className="absolute w-40 h-40 border border-double rounded-full animate-ping pointer-events-none" 
        />
        
        {/* SVG gauge */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 select-none"
        >
          {/* Base Track Circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke + 1}
            strokeDasharray={circumference + ' ' + circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`
            }}
          />
        </svg>

        {/* Center percentage value display */}
        <div className="absolute flex flex-col items-center text-center">
          <motion.span 
            animate={{ color }}
            className="font-orbitron text-3xl font-black tracking-tighter text-glow"
          >
            {score}%
          </motion.span>
          <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest -mt-1">
            Positivity
          </span>
        </div>
      </div>

      {/* Under HUD text logs */}
      <div className="mt-4 text-center z-10 w-full">
        <motion.div 
          animate={{ color }}
          className="font-orbitron text-[10px] font-bold tracking-widest uppercase text-glow"
        >
          {moodStatus}
        </motion.div>
        
        <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase">
          {desc}
        </p>
      </div>
    </div>
  );
}
