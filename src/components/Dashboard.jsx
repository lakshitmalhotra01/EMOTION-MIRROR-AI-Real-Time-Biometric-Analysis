import React from 'react';
import MoodMeter from './MoodMeter';
import SessionStats from './SessionStats';
import CognitiveTelemetry from './CognitiveTelemetry';
import EmotionChart from './EmotionChart';
import EmotionHistory from './EmotionHistory';

/**
 * Analytics Dashboard sidebar grouping all metrics, charts, cognitive telemetry and histories.
 */
export default function Dashboard({
  positivityScore,
  uptimeStr,
  maxFaces,
  sessionDominantEmotion,
  activeExpressions,
  history,
  blinkCount
}) {
  return (
    <div className="space-y-6">
      {/* Top row: radial MoodMeter and SessionStats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MoodMeter score={positivityScore} />
        <SessionStats 
          uptimeStr={uptimeStr} 
          maxFaces={maxFaces} 
          sessionDominantEmotion={sessionDominantEmotion} 
        />
      </div>

      {/* Middle row: Cognitive / Attention parameters */}
      <CognitiveTelemetry 
        expressions={activeExpressions} 
        blinkCount={blinkCount} 
      />

      {/* Middle row: Live Recharts Spectrum Bar Chart */}
      <EmotionChart expressions={activeExpressions} />

      {/* Bottom row: Scrolling Timeline Log */}
      <EmotionHistory history={history} />
    </div>
  );
}
