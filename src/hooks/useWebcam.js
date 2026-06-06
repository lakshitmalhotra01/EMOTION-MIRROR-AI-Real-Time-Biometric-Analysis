import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Robust webcam hook using refs for stream to avoid stale closure issues.
 * Auto-restarts if the track ends unexpectedly (e.g. device disconnect).
 */
export function useWebcam() {
  const streamRef = useRef(null);
  const [permissionError, setPermissionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const videoRef = useRef(null);
  const isStartingRef = useRef(false);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  }, []);

  const startWebcam = useCallback(async () => {
    // Guard against duplicate starts
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setIsLoading(true);
    setPermissionError(null);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Wait for video to actually have data
        await new Promise((resolve, reject) => {
          const v = videoRef.current;
          if (!v) return reject(new Error('No video element'));
          const onLoaded = () => {
            v.removeEventListener('loadedmetadata', onLoaded);
            v.removeEventListener('error', onError);
            resolve();
          };
          const onError = (e) => {
            v.removeEventListener('loadedmetadata', onLoaded);
            v.removeEventListener('error', onError);
            reject(e);
          };
          if (v.readyState >= 1) {
            resolve();
          } else {
            v.addEventListener('loadedmetadata', onLoaded);
            v.addEventListener('error', onError);
          }
        });

        // Play video
        if (videoRef.current) {
          await videoRef.current.play().catch(() => {});
        }
      }

      // Auto-restart if the track ends (e.g. camera disconnect)
      mediaStream.getTracks().forEach((track) => {
        track.addEventListener('ended', () => {
          setIsStreamActive(false);
          streamRef.current = null;
          // Brief delay then restart
          setTimeout(() => {
            isStartingRef.current = false;
            startWebcam();
          }, 1000);
        });
      });

      setIsStreamActive(true);
    } catch (err) {
      console.error('Webcam initialization error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('not_found');
      } else {
        setPermissionError('unknown');
      }
    } finally {
      setIsLoading(false);
      isStartingRef.current = false;
    }
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    stream: streamRef.current,
    permissionError,
    isLoading,
    isStreamActive,
    startWebcam,
    stopWebcam
  };
}
