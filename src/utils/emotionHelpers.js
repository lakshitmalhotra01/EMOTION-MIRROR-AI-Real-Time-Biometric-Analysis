import { EMOTIONS } from '../constants/emotions';

/**
 * Given an expressions object from face-api.js, returns the dominant emotion
 * and its confidence value.
 * If the maximum confidence is below the threshold, returns '?' or 'neutral' depending on configs.
 * 
 * @param {Object} expressions 
 * @param {number} threshold 
 * @returns {Object} { emotion: string, confidence: number }
 */
export function getDominantEmotion(expressions, threshold = 0.3) {
  if (!expressions) {
    return { emotion: 'neutral', confidence: 1.0 };
  }

  let maxEmotion = 'neutral';
  let maxConfidence = 0;

  Object.entries(expressions).forEach(([emotion, val]) => {
    if (val > maxConfidence) {
      maxConfidence = val;
      maxEmotion = emotion;
    }
  });

  // If dominant emotion is below threshold, return neutral with a low-confidence tag
  if (maxConfidence < threshold) {
    return { emotion: 'unknown', confidence: maxConfidence, originalDominant: maxEmotion };
  }

  return { emotion: maxEmotion, confidence: maxConfidence };
}

/**
 * Calculates a Positivity Index from 0 to 100 based on the weights of the facial expressions.
 * 
 * @param {Object} expressions 
 * @returns {number} 0 to 100
 */
export function calculatePositivityScore(expressions) {
  if (!expressions) return 50;

  let totalWeight = 0;
  
  // Calculate weighted sum
  Object.entries(expressions).forEach(([emotion, confidence]) => {
    const config = EMOTIONS[emotion];
    if (config) {
      totalWeight += confidence * config.weight;
    }
  });

  // Map raw weight (-1.0 to 1.0) to (0 to 100)
  // Clamp values to ensure safety
  const score = Math.round((totalWeight + 1.0) * 50);
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Returns Hex color of an emotion
 */
export function getEmotionColor(emotion) {
  return EMOTIONS[emotion]?.color || '#AAAAAA';
}

/**
 * Returns emoji of an emotion
 */
export function getEmotionEmoji(emotion) {
  if (emotion === 'unknown') return '❓';
  return EMOTIONS[emotion]?.emoji || '😐';
}

/**
 * Returns CSS Text class of an emotion
 */
export function getEmotionTextClass(emotion) {
  return EMOTIONS[emotion]?.textClass || 'text-slate-400';
}

/**
 * Returns CSS Border class of an emotion
 */
export function getEmotionBorderClass(emotion) {
  return EMOTIONS[emotion]?.borderClass || 'border-slate-500';
}

/**
 * Returns biometric status log of an emotion
 */
export function getEmotionStatus(emotion) {
  if (emotion === 'unknown') return 'Signal Weak / Confidence Below Threshold';
  return EMOTIONS[emotion]?.status || 'Biometric Reading Active';
}
