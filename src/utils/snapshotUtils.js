/**
 * Captures the current webcam frame and merges it with the overlay canvas.
 * Burns biometric metadata directly into the image to create a portfolio-grade security snapshot card.
 * 
 * @param {HTMLVideoElement} video 
 * @param {HTMLCanvasElement} overlayCanvas 
 * @param {Array} detections Active face-api detections array
 * @returns {Object} { id, timestamp, dataUrl, metadata }
 */
export function captureBiometricSnapshot(video, overlayCanvas, detections) {
  if (!video || video.paused || video.ended) {
    throw new Error('Video stream is not active');
  }

  const width = video.videoWidth || video.width;
  const height = video.videoHeight || video.height;

  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Draw the raw video frame
  ctx.drawImage(video, 0, 0, width, height);

  // 2. Draw the overlay canvas (contains landmarks, boxes, and tags)
  if (overlayCanvas) {
    ctx.drawImage(overlayCanvas, 0, 0, width, height);
  }

  // 3. Burn in the Cyberpunk telemetry overlay around the edges
  ctx.save();
  
  // Outer glowing framing boundary
  ctx.strokeStyle = 'rgba(0, 206, 209, 0.4)'; // Cyan
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, width - 16, height - 16);

  ctx.strokeStyle = '#020817';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Crosshair corners
  const bracketSize = 25;
  ctx.strokeStyle = '#00CED1';
  ctx.lineWidth = 2;
  
  // Top-Left corner tag
  ctx.beginPath();
  ctx.moveTo(15 + bracketSize, 15);
  ctx.lineTo(15, 15);
  ctx.lineTo(15, 15 + bracketSize);
  ctx.stroke();

  // Top-Right corner tag
  ctx.beginPath();
  ctx.moveTo(width - 15 - bracketSize, 15);
  ctx.lineTo(width - 15, 15);
  ctx.lineTo(width - 15, 15 + bracketSize);
  ctx.stroke();

  // Bottom-Left corner tag
  ctx.beginPath();
  ctx.moveTo(15 + bracketSize, height - 15);
  ctx.lineTo(15, height - 15);
  ctx.lineTo(15, height - 15 - bracketSize);
  ctx.stroke();

  // Bottom-Right corner tag
  ctx.beginPath();
  ctx.moveTo(width - 15 - bracketSize, height - 15);
  ctx.lineTo(width - 15, height - 15);
  ctx.lineTo(width - 15, height - 15 - bracketSize);
  ctx.stroke();

  // 4. Burn biometric watermark metadata panel at the bottom
  const bannerHeight = 55;
  const bannerY = height - bannerHeight - 15;
  ctx.fillStyle = 'rgba(2, 8, 23, 0.85)';
  ctx.strokeStyle = 'rgba(0, 206, 209, 0.5)';
  ctx.lineWidth = 1;
  ctx.fillRect(15, bannerY, width - 30, bannerHeight);
  ctx.strokeRect(15, bannerY, width - 30, bannerHeight);

  // Left side: Security System Watermark
  ctx.font = 'bold 12px "Orbitron", sans-serif';
  ctx.fillStyle = '#00CED1';
  ctx.fillText('🧠 EMOTION MIRROR BIOMETRIC DUMP', 30, bannerY + 20);
  
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748B';
  const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  ctx.fillText(`TIMESTAMP: ${timestampStr} | FEED: WEBCAM_01`, 30, bannerY + 36);

  // Right side: Active subjects and classification
  const subjectCount = detections ? detections.length : 0;
  ctx.font = 'bold 12px "Orbitron", sans-serif';
  ctx.fillStyle = '#F1F5F9';
  ctx.textAlign = 'right';
  ctx.fillText(`SUBJECTS IN FRAME: ${subjectCount}`, width - 30, bannerY + 20);

  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94A3B8';
  let classificationText = 'STATUS: NO SUBJECTS FOUND';
  if (subjectCount > 0) {
    // Get dominant emotion of first subject to summarize
    const firstFace = detections[0];
    if (firstFace.expressions) {
      let maxEmo = 'neutral';
      let maxConf = 0;
      Object.entries(firstFace.expressions).forEach(([name, val]) => {
        if (val > maxConf) {
          maxConf = val;
          maxEmo = name;
        }
      });
      classificationText = `PRIMARY CLASSIFICATION: ${maxEmo.toUpperCase()} (${Math.round(maxConf * 100)}%)`;
    }
  }
  ctx.fillText(classificationText, width - 30, bannerY + 36);

  ctx.restore();

  // Convert to PNG data URL
  const dataUrl = canvas.toDataURL('image/png');

  // Pack summary metadata
  const firstFace = detections?.[0];
  const summaryMeta = {
    id: `snap_${Date.now()}`,
    timestamp: new Date(),
    dataUrl,
    faceCount: subjectCount,
    dominantEmotion: 'neutral',
    confidence: 1.0,
    age: 25,
    gender: 'neutral'
  };

  if (subjectCount > 0 && firstFace) {
    let maxEmo = 'neutral';
    let maxConf = 0;
    Object.entries(firstFace.expressions || {}).forEach(([name, val]) => {
      if (val > maxConf) {
        maxConf = val;
        maxEmo = name;
      }
    });
    summaryMeta.dominantEmotion = maxEmo;
    summaryMeta.confidence = maxConf;
    summaryMeta.age = firstFace.age || 25;
    summaryMeta.gender = firstFace.gender || 'neutral';
  }

  return summaryMeta;
}

/**
 * Downloads a data URL snapshot as a PNG file
 */
export function downloadSnapshot(snapshot) {
  const link = document.createElement('a');
  link.download = `emotion_mirror_capture_${snapshot.id}.png`;
  link.href = snapshot.dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
