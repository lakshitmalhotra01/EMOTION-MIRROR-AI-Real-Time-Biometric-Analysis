/**
 * Cyberpunk Canvas Drawing Utilities for Emotion Mirror
 */

/**
 * Draws high-tech corner brackets around the detected face boundary
 */
export function drawCyberpunkBox(ctx, x, y, width, height, color, labelText) {
  const bracketLength = Math.min(20, width * 0.2);
  const lineWidth = 2;
  
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  
  // Fill semi-transparent scan overlay inside box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.fillRect(x, y, width, height);

  // Draw 4 corners
  // Top-Left
  ctx.beginPath();
  ctx.moveTo(x + bracketLength, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + bracketLength);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(x + width - bracketLength, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + bracketLength);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(x + bracketLength, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + height - bracketLength);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(x + width - bracketLength, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width, y + height - bracketLength);
  ctx.stroke();
  
  // Draw subtle crosshair in center
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.shadowBlur = 0;
  
  ctx.beginPath();
  ctx.moveTo(centerX - 6, centerY);
  ctx.lineTo(centerX + 6, centerY);
  ctx.moveTo(centerX, centerY - 6);
  ctx.lineTo(centerX, centerY + 6);
  ctx.stroke();
  
  // Draw corner mini ticks
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x - 4, y + 4);
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x + 4, y - 4);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws face-api.js 68 landmark points as a glowing wireframe mesh
 */
export function drawFaceMesh(ctx, landmarks, color) {
  const points = landmarks.positions;
  
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = `${color}33`; // 20% opacity for connections
  ctx.shadowColor = color;
  
  const drawPath = (indices, closed = false) => {
    ctx.beginPath();
    ctx.moveTo(points[indices[0]].x, points[indices[0]].y);
    for (let i = 1; i < indices.length; i++) {
      ctx.lineTo(points[indices[i]].x, points[indices[i]].y);
    }
    if (closed) ctx.closePath();
    ctx.stroke();
  };

  // Jaw line
  drawPath([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  // Left eyebrow
  drawPath([17,18,19,20,21]);
  // Right eyebrow
  drawPath([22,23,24,25,26]);
  // Nose bridge
  drawPath([27,28,29,30]);
  // Nose tip/nostrils
  drawPath([30,31,32,33,34,35], true);
  // Left eye
  drawPath([36,37,38,39,40,41], true);
  // Right eye
  drawPath([42,43,44,45,46,47], true);
  // Outer lips
  drawPath([48,49,50,51,52,53,54,55,56,57,58,59], true);
  // Inner lips
  drawPath([60,61,62,63,64,65,66,67], true);

  // Draw the landmark dots themselves with high-glow
  ctx.shadowBlur = 4;
  ctx.fillStyle = color;
  points.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draws metadata telemetry box next to or above the face
 */
export function drawTelemetryReadout(ctx, x, y, width, height, color, metadata, options = {}) {
  const { showConfidenceBars = true, showAgeGender = true } = options;
  
  ctx.save();
  
  // Set fonts
  ctx.font = 'bold 10px "Orbitron", "sans-serif"';
  ctx.fillStyle = '#FFFFFF';
  
  const labelHeight = 16;
  const padding = 6;
  const headerText = `SUBJECT #${metadata.subjectIndex || '01'}`;
  
  // Render header background block (anchored above bounding box)
  const headerY = y - labelHeight - 4;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, headerY, width, labelHeight);
  ctx.fillRect(x, headerY, width, labelHeight);
  
  // Subject text
  ctx.fillStyle = color;
  ctx.fillText(headerText, x + padding, headerY + 11);
  
  // Draw small side telemetry anchor line
  ctx.beginPath();
  ctx.moveTo(x + width, headerY + labelHeight/2);
  ctx.lineTo(x + width + 15, headerY + labelHeight/2);
  ctx.lineTo(x + width + 25, headerY + labelHeight/2 + 20);
  ctx.stroke();

  // Render info telemetry sidebar
  const infoX = x + width + 28;
  const infoY = headerY + labelHeight/2 + 10;
  const infoWidth = 145;
  const infoHeight = (showConfidenceBars ? 80 : 35) + (showAgeGender ? 25 : 0);
  
  ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
  ctx.strokeStyle = color;
  ctx.fillRect(infoX, infoY, infoWidth, infoHeight);
  ctx.strokeRect(infoX, infoY, infoWidth, infoHeight);
  
  // Draw glowing corner highlight on sidebar
  ctx.fillStyle = color;
  ctx.fillRect(infoX, infoY, 4, 4);
  ctx.fillRect(infoX + infoWidth - 4, infoY, 4, 4);
  ctx.fillRect(infoX, infoY + infoHeight - 4, 4, 4);
  ctx.fillRect(infoX + infoWidth - 4, infoY + infoHeight - 4, 4, 4);

  // Write Biometric Reads
  let currentTextY = infoY + 14;
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94A3B8'; // Slate 400
  ctx.fillText('EMOTION:', infoX + padding, currentTextY);
  
  ctx.font = 'bold 10px "Orbitron", sans-serif';
  ctx.fillStyle = color;
  const expressionText = `${metadata.emoji} ${metadata.dominantEmotion.toUpperCase()} (${Math.round(metadata.confidence * 100)}%)`;
  ctx.fillText(expressionText, infoX + 62, currentTextY);
  
  // Age/Gender Tag
  if (showAgeGender) {
    currentTextY += 16;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('BIOTYPE:', infoX + padding, currentTextY);
    
    ctx.font = 'bold 9px "Orbitron", sans-serif';
    ctx.fillStyle = '#E2E8F0'; // Slate 200
    const genderSymbol = metadata.gender === 'male' ? '♂' : metadata.gender === 'female' ? '♀' : '⚧';
    const bioText = `${genderSymbol} ${metadata.gender.toUpperCase()} / ~${Math.round(metadata.age)} YRS`;
    ctx.fillText(bioText, infoX + 62, currentTextY);
  }

  // Draw tiny live confidence sparklines for the top emotions
  if (showConfidenceBars && metadata.allExpressions) {
    currentTextY += 12;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(infoX + padding, currentTextY);
    ctx.lineTo(infoX + infoWidth - padding, currentTextY);
    ctx.stroke();

    // Sort expressions and take top 3
    const sortedExpr = Object.entries(metadata.allExpressions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
      
    sortedExpr.forEach(([name, val]) => {
      currentTextY += 14;
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748B'; // Slate 500
      ctx.fillText(name.slice(0, 4).toUpperCase(), infoX + padding, currentTextY);
      
      // Draw background track
      const trackX = infoX + 35;
      const trackWidth = infoWidth - 35 - padding - 25;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(trackX, currentTextY - 6, trackWidth, 5);
      
      // Draw value bar
      ctx.fillStyle = color;
      ctx.fillRect(trackX, currentTextY - 6, trackWidth * val, 5);
      
      // Draw percentage
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`${Math.round(val * 100)}%`, trackX + trackWidth + 4, currentTextY - 1);
    });
  }

  ctx.restore();
}
