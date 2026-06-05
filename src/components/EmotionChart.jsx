import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { EMOTIONS } from '../constants/emotions';

/**
 * Live Recharts bar chart displaying the confidence percentages of the 7 expressions.
 */
export default function EmotionChart({ expressions }) {
  // Map expressions to static order array with memoization
  const chartData = useMemo(() => {
    const defaultData = [
      { name: 'Happy', key: 'happy', score: 0, color: EMOTIONS.happy.color },
      { name: 'Sad', key: 'sad', score: 0, color: EMOTIONS.sad.color },
      { name: 'Angry', key: 'angry', score: 0, color: EMOTIONS.angry.color },
      { name: 'Surprised', key: 'surprised', score: 0, color: EMOTIONS.surprised.color },
      { name: 'Neutral', key: 'neutral', score: 0, color: EMOTIONS.neutral.color },
      { name: 'Fearful', key: 'fearful', score: 0, color: EMOTIONS.fearful.color },
      { name: 'Disgusted', key: 'disgusted', score: 0, color: EMOTIONS.disgusted.color }
    ];

    if (!expressions) return defaultData;

    return defaultData.map(item => ({
      ...item,
      // Convert expression probability (0.0 - 1.0) to percentage (0 - 100)
      score: Math.round((expressions[item.key] || 0) * 100)
    }));
  }, [expressions]);

  return (
    <div className="glass-panel p-5 rounded-lg border-slate-800/80 shadow-lg flex flex-col h-[280px]">
      {/* HUD Header - bolder and larger */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4 font-mono text-[10px] text-slate-500">
        <span className="font-orbitron font-extrabold text-sm text-themeAccent tracking-wider uppercase">SPECTRUM ANALYSIS</span>
        <span>HUD_MOD: RECHARTS_v3</span>
      </div>

      {/* Recharts container */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'Orbitron' }}
              axisLine={{ stroke: '#1E293B' }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1E293B' }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{
                backgroundColor: 'rgba(2, 8, 23, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: '10px'
              }}
              labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
              itemStyle={{ color: '#38BDF8' }}
            />
            <Bar 
              dataKey="score" 
              isAnimationActive={false} // CRITICAL: Disabled to prevent React lag during 30 FPS updates
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{
                    filter: `drop-shadow(0 0 4px ${entry.color}55)`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
