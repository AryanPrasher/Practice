import { useEffect, useRef, useState } from 'react';

export const useProctoring = (sessionId, token, API_URL, onWarning) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [proctoringError, setProctoringError] = useState(null);
  const [warningsCount, setWarningsCount] = useState(0);
  
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const faceNotVisibleCounter = useRef(0);
  const multipleFacesCounter = useRef(0);

  const logViolation = async (eventType, severity) => {
    try {
      console.warn(`[Proctoring Flagged] Event: ${eventType}, Severity: ${severity}`);
      const res = await fetch(`${API_URL}/proctoring/log-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, eventType, severity }),
      });
      if (res.ok) {
        setWarningsCount((c) => c + 1);
        if (onWarning) {
          onWarning(eventType);
        }
      }
    } catch (err) {
      console.error('Failed to log proctoring violation:', err);
    }
  };

  // 1. Tab Switch Event Handler (Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab-switch', 'high');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId, token]);

  // 2. Webcam Stream and Face-API Detection Loop
  const startProctoring = async (videoElement) => {
    if (!videoElement) return;

    try {
      // Get User Webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, frameRate: { max: 10 } },
        audio: false,
      });
      streamRef.current = stream;
      videoElement.srcObject = stream;
      setIsWebcamActive(true);
      setProctoringError(null);

      // Wait for faceapi to load
      let faceapi = window.faceapi;
      let retries = 0;
      while (!faceapi && retries < 10) {
        await new Promise((r) => setTimeout(r, 500));
        faceapi = window.faceapi;
        retries++;
      }

      if (!faceapi) {
        throw new Error('Face-API script not loaded. Check network connection.');
      }

      // Load models from jsdelivr CDN fork
      await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/');

      // Detection Check Interval
      intervalRef.current = setInterval(async () => {
        if (!videoElement || videoElement.paused || videoElement.ended) return;

        try {
          // Detect faces in stream
          const detections = await faceapi.detectAllFaces(
            videoElement,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
          );

          if (detections.length === 0) {
            faceNotVisibleCounter.current += 1;
            multipleFacesCounter.current = 0;

            // Trigger alert if face not visible for 4 consecutive intervals (approx 4 seconds)
            if (faceNotVisibleCounter.current >= 4) {
              logViolation('face-not-visible', 'medium');
              faceNotVisibleCounter.current = 0; // reset to avoid rapid logging
            }
          } else if (detections.length > 1) {
            multipleFacesCounter.current += 1;
            faceNotVisibleCounter.current = 0;

            if (multipleFacesCounter.current >= 2) {
              logViolation('multiple-faces', 'high');
              multipleFacesCounter.current = 0;
            }
          } else {
            // Exactly one face visible
            faceNotVisibleCounter.current = 0;
            multipleFacesCounter.current = 0;
          }
        } catch (err) {
          console.error('Error during face detection check:', err);
        }
      }, 1000); // Check every 1 second

    } catch (err) {
      console.error('Webcam initialization failed:', err);
      setProctoringError(err.message || 'Could not acquire webcam stream.');
      setIsWebcamActive(false);
      
      // Log failure to backend
      fetch(`${API_URL}/proctoring/verify-webcam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'failed' }),
      }).catch(console.error);
    }
  };

  const stopProctoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      stopProctoring();
    };
  }, []);

  return {
    isWebcamActive,
    proctoringError,
    warningsCount,
    startProctoring,
    stopProctoring,
  };
};
