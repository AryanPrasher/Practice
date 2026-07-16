import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProctoring } from '../hooks/useProctoring';
import { Shield, AlertTriangle, EyeOff, Camera, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

const TestTaking = () => {
  const { testSeriesId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const { token, API_URL } = useAuth();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Time tracker for current question
  const [questionTimer, setQuestionTimer] = useState(0);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // Warning tracking
  const [latestWarning, setLatestWarning] = useState(null);

  // Proctoring Hook
  const {
    isWebcamActive,
    proctoringError,
    warningsCount,
    startProctoring,
    stopProctoring,
  } = useProctoring(sessionId, token, API_URL, (eventType) => {
    setLatestWarning(eventType);
    setTimeout(() => setLatestWarning(null), 4000); // Hide warning banner after 4s
  });

  // Start question timer
  useEffect(() => {
    if (started && !isDisqualified) {
      setQuestionTimer(0);
      timerRef.current = setInterval(() => {
        setQuestionTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, question, isDisqualified]);

  // Load next question
  const loadNextQuestion = async () => {
    try {
      setLoading(true);
      setSelectedOption(null);
      const res = await fetch(`${API_URL}/adaptive/next-question?sessionId=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.finished) {
          // No more questions, submit session end
          await finishExam();
        } else {
          setQuestion(data.question);
        }
      } else {
        setMessage(data.message || 'Error loading next question');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch next question.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchExam = async () => {
    setStarted(true);
    // Start Webcam detection loop
    setTimeout(() => {
      if (videoRef.current) {
        startProctoring(videoRef.current);
      }
    }, 500);
    loadNextQuestion();
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/adaptive/submit-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          questionId: question._id,
          selectedOptionIndex: selectedOption,
          timeSpent: questionTimer
        })
      });
      const data = await res.json();

      if (res.ok) {
        // Load next adaptive question
        loadNextQuestion();
      } else {
        setMessage(data.message || 'Error submitting response');
      }
    } catch (err) {
      console.error(err);
      setMessage('Connection issue submitting response.');
    } finally {
      setSubmitting(false);
    }
  };

  const finishExam = async () => {
    stopProctoring();
    try {
      const res = await fetch(`${API_URL}/sessions/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) {
        navigate(`/report/${sessionId}`);
      } else {
        setMessage('Error finalizing test scoring.');
      }
    } catch (err) {
      console.error(err);
      navigate(`/report/${sessionId}`); // Fallback
    }
  };

  // Check if session was disqualified by server rules
  useEffect(() => {
    const checkSessionStatus = async () => {
      if (started) {
        try {
          const res = await fetch(`${API_URL}/sessions/resume`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId })
          });
          const data = await res.json();
          if (res.ok && data.session.status === 'disqualified') {
            setIsDisqualified(true);
            stopProctoring();
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    const interval = setInterval(checkSessionStatus, 5000); // Check status every 5 seconds
    return () => clearInterval(interval);
  }, [started]);

  if (isDisqualified) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderLeft: '4px solid var(--danger)', textAlign: 'center' }}>
          <AlertTriangle size={64} style={{ color: 'var(--danger)', marginBottom: '24px' }} />
          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '16px' }}>Exam Disqualified</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your test session has been suspended by the proctoring rules due to exceeding cheating flag limits (e.g. repeated tab switching or webcam face loss).
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Pre-test Instructions Layout
  if (!started) {
    return (
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }} className="animate-fade-in">
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Shield size={32} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '26px', color: '#fff' }}>AI Proctoring Guidelines</h1>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Before launching the exam, please review the security policies. By clicking "Start Exam", you consent to webcam face verification and page focus tracking.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '32px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>Anti-Cheat Code of Conduct:</h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>Webcam Presence:</strong> Keep your face centered in the camera preview at all times.</li>
              <li><strong>No Tab Switching:</strong> Navigating away from this tab will immediately trigger a high-severity flag.</li>
              <li><strong>Single Candidate:</strong> Ensure there are no other people present in your webcam background.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handleLaunchExam} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start Exam <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px 48px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }} className="animate-fade-in">
      {/* Warning Overlay Banner */}
      {latestWarning && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 200,
          fontWeight: 'bold',
          backdropFilter: 'blur(8px)'
        }}>
          <AlertTriangle size={20} />
          <span>Warning Flagged: {latestWarning.replace('-', ' ')}</span>
        </div>
      )}

      {/* Main Test Interface */}
      <div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '100px 0', color: 'var(--text-secondary)' }}>
            <RefreshCw className="spin" size={32} style={{ animation: 'spin 2s linear infinite' }} />
            <span style={{ marginLeft: '12px', fontSize: '18px' }}>Generating next adaptive item...</span>
          </div>
        ) : question ? (
          <div className="glass-panel" style={{ padding: '36px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <span className="badge badge-info">{question.category}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Elapsed Question Time: <strong>{questionTimer}s</strong>
                </span>
              </div>

              <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '28px', lineHeight: '1.4' }}>
                {question.text}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    style={{
                      padding: '16px 20px',
                      background: selectedOption === idx ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      color: selectedOption === idx ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <button onClick={finishExam} className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                End & Submit Exam
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null || submitting}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {submitting ? 'Logging...' : 'Submit & Next'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>{message || 'No active question.'}</p>
        )}
      </div>

      {/* Proctoring Sidebar (Camera stream + Warnings indicators) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Floating Webcam Card */}
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', fontWeight: 'bold' }}>
            <Camera size={16} style={{ color: isWebcamActive ? 'var(--success)' : 'var(--danger)' }} />
            <span>Live Proctoring Monitor</span>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            background: '#000',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror view
              }}
            />
            {!isWebcamActive && (
              <div style={{ position: 'absolute', color: 'var(--text-muted)', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <EyeOff size={32} />
                <span>Webcam Offline</span>
              </div>
            )}
          </div>

          {proctoringError && (
            <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '8px', lineHeight: '1.2' }}>{proctoringError}</p>
          )}
        </div>

        {/* Warnings Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} style={{ color: 'var(--primary)' }} /> Session Violations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Logged Flags Count</span>
              <span className={`badge ${warningsCount > 0 ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '14px', padding: '4px 12px' }}>
                {warningsCount}
              </span>
            </div>
            
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Warnings are generated dynamically when the system detects face absence, multiple people, or tab focus shifts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTaking;
