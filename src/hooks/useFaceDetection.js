import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { drawCyberpunkBox, drawFaceMesh, drawTelemetryReadout } from '../utils/drawingHelpers';
import { getDominantEmotion, getEmotionColor, getEmotionEmoji } from '../utils/emotionHelpers';

/**
 * Core ML Hook with EMA expression smoothing for stable emotion detection.
 * Uses smaller inputSize (128) for real-time performance and lower threshold.
 */
export function useFaceDetection(videoRef, canvasRef, modelsLoaded, settings = {}, onEmotionChange) {
  const [detections, setDetections] = useState([]);
  const [fps, setFps] = useState(0);
  const animationFrameIdRef = useRef(null);
  const isProcessingRef = useRef(false);
  const fpsFrameCountRef = useRef(0);
  const fpsLastTimeRef = useRef(performance.now());

  // EMA smoothing buffer: { faceId -> smoothedExpressions }
  const emaBufferRef = useRef({});
  const EMA_ALPHA = 0.35; // 0.35 = moderately smooth (higher = more reactive)

  const showLandmarks = settings.showLandmarks ?? true;
  const showAgeGender = settings.showAgeGender ?? true;
  const showConfidenceBars = settings.showConfidenceBars ?? true;
  const threshold = settings.threshold ?? 0.35; // lower default threshold
  const simulatorMode = settings.simulatorMode ?? false;

  // EMA smoother: blend new expression readings with historical buffer
  const smoothExpressions = useCallback((faceId, newExpressions) => {
    const prev = emaBufferRef.current[faceId];
    if (!prev) {
      emaBufferRef.current[faceId] = { ...newExpressions };
      return { ...newExpressions };
    }
    const smoothed = {};
    Object.keys(newExpressions).forEach((key) => {
      smoothed[key] = EMA_ALPHA * newExpressions[key] + (1 - EMA_ALPHA) * (prev[key] ?? newExpressions[key]);
    });
    emaBufferRef.current[faceId] = smoothed;
    return smoothed;
  }, []);

  useEffect(() => {
    // Clean EMA buffer on mode change
    emaBufferRef.current = {};
  }, [simulatorMode]);

  useEffect(() => {
    if ((!modelsLoaded && !simulatorMode) || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const detectLoop = async () => {
      if (isProcessingRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      isProcessingRef.current = true;

      // ── SIMULATOR MODE ──────────────────────────────────────────────
      if (simulatorMode) {
        const width = 640;
        const height = 480;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        ctx.clearRect(0, 0, width, height);

        const now = performance.now();
        fpsFrameCountRef.current++;
        if (now - fpsLastTimeRef.current >= 1000) {
          setFps(Math.round((fpsFrameCountRef.current * 1000) / (now - fpsLastTimeRef.current)));
          fpsFrameCountRef.current = 0;
          fpsLastTimeRef.current = now;
        }

        const cycleTime = 5000;
        const simulatedEmotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted'];
        const emotionIndex = Math.floor((now / cycleTime) % simulatedEmotions.length);
        const activeEmotion = simulatedEmotions[emotionIndex];

        const rawExpressions = {};
        simulatedEmotions.forEach((k) => { rawExpressions[k] = 0.02; });
        rawExpressions[activeEmotion] = 0.85 + Math.sin(now / 500) * 0.04;
        simulatedEmotions.forEach((k) => {
          if (k !== activeEmotion) rawExpressions[k] = Math.max(0.01, 0.04 + Math.sin(now / 1200 + k.length) * 0.02);
        });

        const expressions = smoothExpressions('sim_face_0', rawExpressions);

        const boxX = (width - 240) / 2 + Math.sin(now / 2000) * 40;
        const boxY = (height - 240) / 2 + Math.cos(now / 1500) * 15;
        const boxW = 240 + Math.sin(now / 3000) * 6;
        const boxH = 240 + Math.sin(now / 3000) * 6;

        const positions = [];
        const centerX = boxX + boxW / 2;
        const centerY = boxY + boxH / 2;
        const yaw = Math.sin(now / 2000) * 0.22;
        const pitch = Math.cos(now / 2500) * 0.12;
        const isBlinking = (now % 4000) < 160;

        for (let i = 0; i <= 16; i++) {
          const angle = Math.PI + (i / 16) * Math.PI;
          const rx = boxW * 0.44 * Math.cos(angle);
          const ry = boxH * 0.46 * Math.sin(angle);
          positions.push({ x: centerX + rx * Math.cos(yaw) - ry * Math.sin(pitch), y: centerY + ry * 0.7 + rx * Math.sin(yaw) });
        }
        for (let i = 0; i < 5; i++) {
          positions.push({ x: centerX - boxW * 0.28 + (i / 4) * boxW * 0.2 + yaw * 12, y: centerY - boxH * 0.16 - Math.sin((i / 4) * Math.PI) * 12 + pitch * 10 });
        }
        for (let i = 0; i < 5; i++) {
          positions.push({ x: centerX + boxW * 0.08 + (i / 4) * boxW * 0.2 + yaw * 12, y: centerY - boxH * 0.16 - Math.sin((i / 4) * Math.PI) * 12 + pitch * 10 });
        }
        for (let i = 0; i < 4; i++) {
          positions.push({ x: centerX + yaw * 18, y: centerY - boxH * 0.1 + (i / 3) * boxH * 0.22 + pitch * 8 });
        }
        for (let i = 0; i < 5; i++) {
          positions.push({ x: centerX - boxW * 0.08 + (i / 4) * boxW * 0.16 + yaw * 18, y: centerY + boxH * 0.12 + pitch * 10 });
        }
        const leCX = centerX - boxW * 0.16 + yaw * 10;
        const leCY = centerY - boxH * 0.02 + pitch * 8;
        const eRX = boxW * 0.05;
        const eRY = isBlinking ? 0.5 : boxH * 0.03;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * 2 * Math.PI;
          positions.push({ x: leCX + eRX * Math.cos(a), y: leCY + eRY * Math.sin(a) });
        }
        const reCX = centerX + boxW * 0.16 + yaw * 10;
        const reCY = centerY - boxH * 0.02 + pitch * 8;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * 2 * Math.PI;
          positions.push({ x: reCX + eRX * Math.cos(a), y: reCY + eRY * Math.sin(a) });
        }
        const mouthW = boxW * (activeEmotion === 'surprised' ? 0.12 : activeEmotion === 'angry' ? 0.14 : 0.18);
        const mouthH = boxH * (activeEmotion === 'surprised' ? 0.16 : activeEmotion === 'happy' ? 0.08 : 0.03);
        const mouthY = centerY + boxH * 0.22 + pitch * 14;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * 2 * Math.PI;
          let smileY = 0;
          if (activeEmotion === 'happy') smileY = -Math.cos(a) * 7;
          else if (activeEmotion === 'sad' || activeEmotion === 'angry') smileY = Math.cos(a) * 6;
          positions.push({ x: centerX + mouthW * Math.cos(a) + yaw * 15, y: mouthY + mouthH * Math.sin(a) + smileY });
        }
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * 2 * Math.PI;
          positions.push({ x: centerX + mouthW * 0.65 * Math.cos(a) + yaw * 15, y: mouthY + mouthH * 0.45 * Math.sin(a) });
        }

        const { emotion: dominantEmotion, confidence } = getDominantEmotion(expressions, 0.1);
        // Emit emotion change if provided
        if (typeof onEmotionChange === 'function') {
          // Use a ref to store previous emotion
          if (!window.__prevEmotion__) {
            window.__prevEmotion__ = dominantEmotion;
            onEmotionChange(dominantEmotion);
          } else if (window.__prevEmotion__ !== dominantEmotion) {
            window.__prevEmotion__ = dominantEmotion;
            onEmotionChange(dominantEmotion);
          }
        }
        const color = getEmotionColor(dominantEmotion);

        const simulatedDetections = [{
          id: 'sim_face_0',
          box: { x: boxX, y: boxY, width: boxW, height: boxH },
          dominantEmotion,
          confidence,
          emoji: getEmotionEmoji(dominantEmotion),
          color,
          age: 24.5 + Math.sin(now / 8000) * 0.5,
          gender: 'female',
          genderProbability: 0.96,
          expressions,
          landmarks: { positions }
        }];

        simulatedDetections.forEach((face, index) => {
          const { x, y, width: w, height: h } = face.box;
          drawCyberpunkBox(ctx, x, y, w, h, face.color, face.dominantEmotion);
          if (showLandmarks && face.landmarks) drawFaceMesh(ctx, face.landmarks, face.color);
          drawTelemetryReadout(ctx, x, y, w, h, face.color, {
            subjectIndex: index + 1,
            dominantEmotion: face.dominantEmotion,
            confidence: face.confidence,
            emoji: face.emoji,
            age: face.age,
            gender: face.gender,
            allExpressions: face.expressions
          }, { showConfidenceBars, showAgeGender });
        });

        // Simulator badge
        ctx.save();
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#FF4488';
        ctx.fillText('◆ NEURAL SIMULATION ACTIVE', 12, 22);
        ctx.restore();

        setDetections(simulatedDetections);
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      // ── REAL WEBCAM MODE ────────────────────────────────────────────
      if (!video || video.readyState < 2 || video.paused || video.ended || video.videoWidth === 0) {
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      try {
        const detectorOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 128, // Faster than 224, still accurate for real-time
          scoreThreshold: threshold
        });

        const rawResults = await faceapi
          .detectAllFaces(video, detectorOptions)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        ctx.clearRect(0, 0, width, height);

        const now = performance.now();
        fpsFrameCountRef.current++;
        if (now - fpsLastTimeRef.current >= 1000) {
          setFps(Math.round((fpsFrameCountRef.current * 1000) / (now - fpsLastTimeRef.current)));
          fpsFrameCountRef.current = 0;
          fpsLastTimeRef.current = now;
        }

        if (rawResults && rawResults.length > 0) {
          const resizedResults = faceapi.resizeResults(rawResults, { width, height });

          // Clean up EMA buffer for faces no longer present
          const currentIds = new Set(resizedResults.map((_, i) => `face_${i}`));
          Object.keys(emaBufferRef.current).forEach((id) => {
            if (!currentIds.has(id) && id !== 'sim_face_0') delete emaBufferRef.current[id];
          });

          const formattedDetections = resizedResults.map((res, index) => {
            const { x, y, width: boxW, height: boxH } = res.detection.box;
            const faceId = `face_${index}`;

            // Apply EMA smoothing to expression values
            const smoothedExpressions = smoothExpressions(faceId, res.expressions);

            const { emotion, confidence } = getDominantEmotion(smoothedExpressions, threshold);
        // Emit emotion change for real detections
        if (typeof onEmotionChange === 'function') {
          if (!window.__prevEmotion__) {
            window.__prevEmotion__ = emotion;
            onEmotionChange(emotion);
          } else if (window.__prevEmotion__ !== emotion) {
            window.__prevEmotion__ = emotion;
            onEmotionChange(emotion);
          }
        }
            const emoji = getEmotionEmoji(emotion);
            const color = getEmotionColor(emotion);

            return {
              id: faceId,
              box: { x, y, width: boxW, height: boxH },
              dominantEmotion: emotion,
              confidence,
              emoji,
              color,
              age: res.age,
              gender: res.gender,
              genderProbability: res.genderProbability,
              expressions: smoothedExpressions,
              landmarks: res.landmarks
            };
          });

          formattedDetections.forEach((face, index) => {
            const { x, y, width: w, height: h } = face.box;
            drawCyberpunkBox(ctx, x, y, w, h, face.color, face.dominantEmotion);
            if (showLandmarks && face.landmarks) drawFaceMesh(ctx, face.landmarks, face.color);
            drawTelemetryReadout(ctx, x, y, w, h, face.color, {
              subjectIndex: index + 1,
              dominantEmotion: face.dominantEmotion,
              confidence: face.confidence,
              emoji: face.emoji,
              age: face.age,
              gender: face.gender,
              allExpressions: face.expressions
            }, { showConfidenceBars, showAgeGender });
          });

          setDetections(formattedDetections);
        } else {
          setDetections([]);
        }
      } catch (err) {
        console.error('Face detection loop error:', err);
      } finally {
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [modelsLoaded, threshold, showLandmarks, showAgeGender, showConfidenceBars, simulatorMode, smoothExpressions]);

  return { detections, fps };
}
