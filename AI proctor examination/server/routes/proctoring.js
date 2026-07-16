import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import TestSession from '../models/TestSession.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Mock Proctor Configuration
let proctorConfig = {
  maxTabSwitches: 3,
  maxFaceNotVisibleSeconds: 15,
  autoDisqualifyOnLimit: false,
};

// 1. POST /api/proctoring/log-event
// Log a cheat/violation flag: tab-switch, face-not-visible, multiple-faces
router.post('/log-event', protect, async (req, res) => {
  try {
    const { sessionId, eventType, severity } = req.body;

    const session = await TestSession.findById(sessionId);
    if (!session || session.status !== 'active') {
      return res.status(404).json({ message: 'Active session not found' });
    }

    if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized session modification' });
    }

    // Append flag
    session.proctoringFlags.push({
      eventType,
      timestamp: new Date(),
      severity: severity || 'medium',
      resolved: false,
    });

    // Check thresholds for auto alert
    const flagsCount = session.proctoringFlags.filter(f => f.eventType === eventType).length;
    
    // Create an in-app notification alert for warning the user
    if (flagsCount >= 2) {
      const alertNotification = new Notification({
        user: req.user._id,
        title: 'Proctoring Warning',
        message: `System flagged repeated '${eventType}' events during your session. Continuous violations may lead to disqualification.`,
        type: 'alert',
      });
      await alertNotification.save();
    }

    // Trigger auto-disqualify if config enforces it
    if (proctorConfig.autoDisqualifyOnLimit) {
      const totalSwitches = session.proctoringFlags.filter(f => f.eventType === 'tab-switch').length;
      if (totalSwitches >= proctorConfig.maxTabSwitches) {
        session.status = 'disqualified';
        session.reviewStatus = 'confirmed-cheat';
      }
    }

    // If flags are accumulating, tag session as pending review
    if (session.proctoringFlags.length >= 3 && session.reviewStatus === 'clean') {
      session.reviewStatus = 'pending';
    }

    await session.save();
    return res.status(201).json({ message: 'Proctoring event logged successfully', session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/proctoring/session-logs/:sessionId
// Get all logged violations for a specific session
router.get('/session-logs/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized view request' });
    }

    return res.status(200).json({ flags: session.proctoringFlags });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. PUT /api/proctoring/config
// Admin: Configure proctoring violation sensitivity or enabled features
router.put('/config', protect, authorize('admin'), async (req, res) => {
  try {
    const { maxTabSwitches, maxFaceNotVisibleSeconds, autoDisqualifyOnLimit } = req.body;

    if (maxTabSwitches !== undefined) proctorConfig.maxTabSwitches = Number(maxTabSwitches);
    if (maxFaceNotVisibleSeconds !== undefined) proctorConfig.maxFaceNotVisibleSeconds = Number(maxFaceNotVisibleSeconds);
    if (autoDisqualifyOnLimit !== undefined) proctorConfig.autoDisqualifyOnLimit = Boolean(autoDisqualifyOnLimit);

    return res.status(200).json({ message: 'Proctor configuration updated', proctorConfig });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 4. POST /api/proctoring/verify-webcam
// Verify webcam availability and pre-check face visibility before starting test
router.post('/verify-webcam', protect, async (req, res) => {
  try {
    const { status } = req.body; // e.g. "success", "failed"
    if (status === 'success') {
      return res.status(200).json({ message: 'Webcam verification checklist complete', verified: true });
    }
    return res.status(400).json({ message: 'Webcam verification failed. Access is required to start.', verified: false });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 5. POST /api/proctoring/auto-flag
// Trigger server-side heuristic to auto-flag a session based on accumulated violations
router.post('/auto-flag', protect, authorize('admin'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const switches = session.proctoringFlags.filter(f => f.eventType === 'tab-switch').length;
    const missingFace = session.proctoringFlags.filter(f => f.eventType === 'face-not-visible').length;
    const multiFace = session.proctoringFlags.filter(f => f.eventType === 'multiple-faces').length;

    // Standard scoring heuristics
    if (switches >= 3 || missingFace >= 5 || multiFace >= 2) {
      session.reviewStatus = 'pending';
      await session.save();
      return res.status(200).json({ message: 'Session flagged for review', reviewStatus: 'pending', session });
    }

    return res.status(200).json({ message: 'Session remains clean', reviewStatus: session.reviewStatus });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
