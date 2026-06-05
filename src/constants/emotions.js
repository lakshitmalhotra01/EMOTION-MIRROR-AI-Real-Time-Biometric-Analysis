export const EMOTIONS = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    color: '#FFD700',
    textClass: 'text-neonHappy',
    borderClass: 'border-neonHappy',
    bgClass: 'bg-neonHappy/10',
    glowClass: 'shadow-neonHappy',
    weight: 1.0,
    status: 'Endorphin Surge / Elevated Cognitive Reward',
    gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent'
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    color: '#4A90D9',
    textClass: 'text-neonSad',
    borderClass: 'border-neonSad',
    bgClass: 'bg-neonSad/10',
    glowClass: 'shadow-neonSad',
    weight: -0.6,
    status: 'Limbic Depletion / Decreased Neural Activity',
    gradient: 'from-blue-700/20 via-blue-900/10 to-transparent'
  },
  angry: {
    label: 'Angry',
    emoji: '😠',
    color: '#FF4444',
    textClass: 'text-neonAngry',
    borderClass: 'border-neonAngry',
    bgClass: 'bg-neonAngry/10',
    glowClass: 'shadow-neonAngry',
    weight: -1.0,
    status: 'Adrenaline Spike / Aggressive Threat Response',
    gradient: 'from-red-600/20 via-red-950/10 to-transparent'
  },
  surprised: {
    label: 'Surprised',
    emoji: '😮',
    color: '#B44FFF',
    textClass: 'text-neonSurprised',
    borderClass: 'border-neonSurprised',
    bgClass: 'bg-neonSurprised/10',
    glowClass: 'shadow-neonSurprised',
    weight: 0.8,
    status: 'Cognitive Disruption / Rapid Attention Shift',
    gradient: 'from-purple-600/20 via-purple-900/10 to-transparent'
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: '#AAAAAA',
    textClass: 'text-neonNeutral',
    borderClass: 'border-neonNeutral',
    bgClass: 'bg-neonNeutral/10',
    glowClass: 'shadow-neonNeutral',
    weight: 0.2,
    status: 'Baseline Synaptic State / Homeostasis',
    gradient: 'from-slate-600/10 via-slate-800/5 to-transparent'
  },
  fearful: {
    label: 'Fearful',
    emoji: '😨',
    color: '#00CED1',
    textClass: 'text-neonFearful',
    borderClass: 'border-neonFearful',
    bgClass: 'bg-neonFearful/10',
    glowClass: 'shadow-neonFearful',
    weight: -0.4,
    status: 'Amygdala Overdrive / Fight-or-Flight Prep',
    gradient: 'from-teal-600/20 via-teal-900/10 to-transparent'
  },
  disgusted: {
    label: 'Disgusted',
    emoji: '🤢',
    color: '#7FBA00',
    textClass: 'text-neonDisgusted',
    borderClass: 'border-neonDisgusted',
    bgClass: 'bg-neonDisgusted/10',
    glowClass: 'shadow-neonDisgusted',
    weight: -0.3,
    status: 'Aversion Triggered / Immune Defense Alert',
    gradient: 'from-lime-600/20 via-green-950/10 to-transparent'
  }
};

export const EMOTION_KEYS = Object.keys(EMOTIONS);

export const DEFAULT_THRESHOLD = 0.5;
