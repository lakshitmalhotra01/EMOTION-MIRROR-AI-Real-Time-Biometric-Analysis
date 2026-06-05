import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage webcam permissions, stream capture, and track lifecycle cleanup.
 */
export function useWebcam() {
  const [stream, setStream] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startWebcam = useCallback(async () => {
    setIsLoading(true);
    setPermissionError(null);
    stopWebcam();

    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false // No audio needed
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Webcam initialization error:', err);
      // Determine error details (denied vs not found)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('not_found');
      } else {
        setPermissionError('unknown');
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopWebcam]);

  // Handle auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    permissionError,
    isLoading,
    startWebcam,
    stopWebcam
  };
}
