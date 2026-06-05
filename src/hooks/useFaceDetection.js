import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { drawCyberpunkBox, drawFaceMesh, drawTelemetryReadout } from '../utils/drawingHelpers';
import { getDominantEmotion, getEmotionColor, getEmotionEmoji } from '../utils/emotionHelpers';

/**
 * Core ML Hook. Orchestrates requestAnimationFrame loop, frame rate limiting,
 * model inference execution, canvas overlay drawing, and state updates.
 */
export function useFaceDetection(videoRef, canvasRef, modelsLoaded, settings = {}) {
  const [detections, setDetections] = useState([]);
  const [fps, setFps] = useState(0);
  const animationFrameIdRef = useRef(null);
  const isProcessingRef = useRef(false);
  const lastTimeRef = useRef(performance.now());
  const fpsFrameCountRef = useRef(0);
  const fpsLastTimeRef = useRef(performance.now());

  // Safe reference parameters
  const showLandmarks = settings.showLandmarks ?? true;
  const showAgeGender = settings.showAgeGender ?? true;
  const showConfidenceBars = settings.showConfidenceBars ?? true;
  const threshold = settings.threshold ?? 0.5;

  const simulatorMode = settings.simulatorMode ?? false;

  useEffect(() => {
    if ((!modelsLoaded && !simulatorMode) || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const detectLoop = async () => {
      // Limit overlapping cycles
      if (isProcessingRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      isProcessingRef.current = true;
      
      // If in Simulator Mode, run high-tech neural simulation
      if (simulatorMode) {
        const width = (video && video.videoWidth) ? video.videoWidth : 640;
        const height = (video && video.videoHeight) ? video.videoHeight : 480;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        // Calculate FPS
        const now = performance.now();
        fpsFrameCountRef.current++;
        if (now - fpsLastTimeRef.current >= 1000) {
          setFps(Math.round((fpsFrameCountRef.current * 1000) / (now - fpsLastTimeRef.current)));
          fpsFrameCountRef.current = 0;
          fpsLastTimeRef.current = now;
        }

        // Cycle through emotions every 5 seconds
        const cycleTime = 5000;
        const simulatedEmotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted'];
        const emotionIndex = Math.floor((now / cycleTime) % simulatedEmotions.length);
        const activeEmotion = simulatedEmotions[emotionIndex];

        // Generate simulated expression values
        const expressions = {
          happy: 0.01,
          sad: 0.01,
          angry: 0.01,
          surprised: 0.01,
          neutral: 0.01,
          fearful: 0.01,
          disgusted: 0.01
        };
        expressions[activeEmotion] = 0.82 + Math.sin(now / 500) * 0.05;
        // Blend in minor percentages on other states
        Object.keys(expressions).forEach((k) => {
          if (k !== activeEmotion) {
            expressions[k] = Math.max(0.01, 0.03 + Math.sin(now / 1000 + k.length) * 0.02);
          }
        });

        // Simulating face coordinate movement
        const boxX = (width - 240) / 2 + Math.sin(now / 2000) * 50;
        const boxY = (height - 240) / 2 + Math.cos(now / 1500) * 20;
        const boxW = 240 + Math.sin(now / 3000) * 8;
        const boxH = 240 + Math.sin(now / 3000) * 8;

        // Generate 68 face landmark positions (rotating skull vector representation)
        const positions = [];
        const centerX = boxX + boxW / 2;
        const centerY = boxY + boxH / 2;
        const yaw = Math.sin(now / 2000) * 0.25; // Yaw rotation factor
        const pitch = Math.cos(now / 2500) * 0.15; // Pitch rotation factor
        const isBlinking = (now % 4000) < 180; // Blink for 180ms every 4s

        // 1. Jaw line (0..16)
        for (let i = 0; i <= 16; i++) {
          const angle = Math.PI + (i / 16) * Math.PI;
          const rx = boxW * 0.44 * Math.cos(angle);
          const ry = boxH * 0.46 * Math.sin(angle);
          // Apply simple projection transform
          const x = centerX + rx * Math.cos(yaw) - ry * Math.sin(pitch);
          const y = centerY + ry * 0.7 + rx * Math.sin(yaw);
          positions.push({ x, y });
        }
        // 2. Left Eyebrow (17..21)
        for (let i = 0; i < 5; i++) {
          const x = centerX - boxW * 0.28 + (i / 4) * boxW * 0.2 + yaw * 12;
          const y = centerY - boxH * 0.16 - Math.sin((i / 4) * Math.PI) * 12 + pitch * 10;
          positions.push({ x, y });
        }
        // 3. Right Eyebrow (22..26)
        for (let i = 0; i < 5; i++) {
          const x = centerX + boxW * 0.08 + (i / 4) * boxW * 0.2 + yaw * 12;
          const y = centerY - boxH * 0.16 - Math.sin((i / 4) * Math.PI) * 12 + pitch * 10;
          positions.push({ x, y });
        }
        // 4. Nose bridge (27..30)
        for (let i = 0; i < 4; i++) {
          const x = centerX + yaw * 18;
          const y = centerY - boxH * 0.1 + (i / 3) * boxH * 0.22 + pitch * 8;
          positions.push({ x, y });
        }
        // 5. Nose bottom (31..35)
        for (let i = 0; i < 5; i++) {
          const x = centerX - boxW * 0.08 + (i / 4) * boxW * 0.16 + yaw * 18;
          const y = centerY + boxH * 0.12 + pitch * 10;
          positions.push({ x, y });
        }
        // 6. Left eye (36..41)
        const leCenterX = centerX - boxW * 0.16 + yaw * 10;
        const leCenterY = centerY - boxH * 0.02 + pitch * 8;
        const eyeRadiusX = boxW * 0.05;
        const eyeRadiusY = isBlinking ? 0.6 : boxH * 0.03;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * 2 * Math.PI;
          const x = leCenterX + eyeRadiusX * Math.cos(angle);
          const y = leCenterY + eyeRadiusY * Math.sin(angle);
          positions.push({ x, y });
        }
        // 7. Right eye (42..47)
        const reCenterX = centerX + boxW * 0.16 + yaw * 10;
        const reCenterY = centerY - boxH * 0.02 + pitch * 8;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * 2 * Math.PI;
          const x = reCenterX + eyeRadiusX * Math.cos(angle);
          const y = reCenterY + eyeRadiusY * Math.sin(angle);
          positions.push({ x, y });
        }
        // 8. Outer Lips (48..59)
        const mouthW = boxW * (activeEmotion === 'surprised' ? 0.12 : activeEmotion === 'angry' ? 0.14 : 0.18);
        const mouthH = boxH * (activeEmotion === 'surprised' ? 0.16 : activeEmotion === 'happy' ? 0.08 : 0.03);
        const mouthY = centerY + boxH * 0.22 + pitch * 14;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * 2 * Math.PI;
          let smileY = 0;
          if (activeEmotion === 'happy') {
            smileY = -Math.cos(angle) * 7;
          } else if (activeEmotion === 'sad' || activeEmotion === 'angry') {
            smileY = Math.cos(angle) * 6;
          }
          const x = centerX + mouthW * Math.cos(angle) + yaw * 15;
          const y = mouthY + mouthH * Math.sin(angle) + smileY;
          positions.push({ x, y });
        }
        // 9. Inner Lips (60..67)
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * 2 * Math.PI;
          const x = centerX + mouthW * 0.65 * Math.cos(angle) + yaw * 15;
          const y = mouthY + mouthH * 0.45 * Math.sin(angle);
          positions.push({ x, y });
        }

        const simulatedDetections = [{
          id: 'sim_face_0',
          box: { x: boxX, y: boxY, width: boxW, height: boxH },
          dominantEmotion: activeEmotion,
          confidence: expressions[activeEmotion],
          emoji: getEmotionEmoji(activeEmotion),
          color: getEmotionColor(activeEmotion),
          age: 24.5 + Math.sin(now / 8000) * 0.5,
          gender: 'female',
          genderProbability: 0.96,
          expressions,
          landmarks: { positions }
        }];

        // Draw HUD overlays for simulation
        simulatedDetections.forEach((face, index) => {
          const { x, y, width: w, height: h } = face.box;
          const color = face.color;

          // Corner Brackets
          drawCyberpunkBox(ctx, x, y, w, h, color, face.dominantEmotion);

          // Landmarks Mesh
          if (showLandmarks && face.landmarks) {
            drawFaceMesh(ctx, face.landmarks, color);
          }

          // Telemetry Readout
          const drawOptions = { showConfidenceBars, showAgeGender };
          const metadata = {
            subjectIndex: index + 1,
            dominantEmotion: face.dominantEmotion,
            confidence: face.confidence,
            emoji: face.emoji,
            age: face.age,
            gender: face.gender,
            allExpressions: face.expressions
          };
          drawTelemetryReadout(ctx, x, y, w, h, color, metadata, drawOptions);
        });

        // Draw futuristic simulation indicator text on canvas
        ctx.save();
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#FF4444';
        ctx.fillText('NEURAL CORE SIMULATION ACTIVE', 15, 25);
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 12, 210, 20);
        ctx.restore();

        setDetections(simulatedDetections);
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      // Check if video is ready for frames
      if (!video || video.readyState !== 4 || video.paused || video.ended) {
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      
      const width = video.videoWidth || video.width;
      const height = video.videoHeight || video.height;
      
      // Keep canvas size synchronized with video coordinates
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      try {
        const detectorOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 224, // Optimized resolution for speed/accuracy balance
          scoreThreshold: threshold
        });

        // Run all 5 networks in parallel for this frame
        const rawResults = await faceapi
          .detectAllFaces(video, detectorOptions)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        // Clear canvas for fresh draw
        ctx.clearRect(0, 0, width, height);

        // Calculate Frame Rate
        const now = performance.now();
        fpsFrameCountRef.current++;
        if (now - fpsLastTimeRef.current >= 1000) {
          setFps(Math.round((fpsFrameCountRef.current * 1000) / (now - fpsLastTimeRef.current)));
          fpsFrameCountRef.current = 0;
          fpsLastTimeRef.current = now;
        }

        if (rawResults && rawResults.length > 0) {
          // Resize bounding coordinates to overlay dimensions
          const resizedResults = faceapi.resizeResults(rawResults, { width, height });

          // Map for application consumption
          const formattedDetections = resizedResults.map((res, index) => {
            const { x, y, width: boxW, height: boxH } = res.detection.box;
            const { emotion, confidence } = getDominantEmotion(res.expressions, threshold);
            const emoji = getEmotionEmoji(emotion);
            const color = getEmotionColor(emotion);

            return {
              id: `face_${index}`,
              box: { x, y, width: boxW, height: boxH },
              dominantEmotion: emotion,
              confidence,
              emoji,
              color,
              age: res.age,
              gender: res.gender,
              genderProbability: res.genderProbability,
              expressions: res.expressions,
              landmarks: res.landmarks
            };
          });

          // Draw HUD overlay per face
          formattedDetections.forEach((face, index) => {
            const { x, y, width: w, height: h } = face.box;
            const color = face.color;

            // 1. Draw Corner Brackets
            drawCyberpunkBox(ctx, x, y, w, h, color, face.dominantEmotion);

            // 2. Draw Landmarks Wireframe Mesh
            if (showLandmarks && face.landmarks) {
              drawFaceMesh(ctx, face.landmarks, color);
            }

            // 3. Draw Cyberpunk Biometric Telemetry sidebar
            const drawOptions = {
              showConfidenceBars,
              showAgeGender
            };
            const metadata = {
              subjectIndex: index + 1,
              dominantEmotion: face.dominantEmotion,
              confidence: face.confidence,
              emoji: face.emoji,
              age: face.age,
              gender: face.gender,
              allExpressions: face.expressions
            };
            drawTelemetryReadout(ctx, x, y, w, h, color, metadata, drawOptions);
          });

          setDetections(formattedDetections);
        } else {
          setDetections([]);
        }
      } catch (err) {
        console.error('Face api loop error:', err);
      } finally {
        isProcessingRef.current = false;
        animationFrameIdRef.current = requestAnimationFrame(detectLoop);
      }
    };

    // Begin loop
    animationFrameIdRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [modelsLoaded, threshold, showLandmarks, showAgeGender, showConfidenceBars, simulatorMode]);

  return { detections, fps };
}
