import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

// Mock Notification preferences database object
const userPreferences = {};

// 1. GET /api/notifications/my
// Get in-app notifications for logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 2. PUT /api/notifications/read/:id
// Mark a notification as read
router.put('/read/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized status update' });
    }

    notification.isRead = true;
    await notification.save();
    return res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. POST /api/notifications/send-alert
// System/Admin: Trigger/send an alert notification (with simulated email)
router.post('/send-alert', protect, authorize('admin'), async (req, res) => {
  try {
    const { userId, title, message, sendEmailAlert } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Save in-app notification
    const notification = new Notification({
      user: userId,
      title,
      message,
      type: 'alert'
    });
    await notification.save();

    // Trigger simulated email if specified and user enables it
    let emailStatus = 'skipped';
    const preferences = userPreferences[userId] || { emailEnabled: true };
    if (sendEmailAlert && preferences.emailEnabled) {
      const emailResult = await sendEmail({
        to: user.email,
        subject: `[Platform Alert] ${title}`,
        html: `<p>Dear ${user.name},</p><p>${message}</p>`
      });
      if (emailResult.success) {
        emailStatus = 'sent';
      }
    }

    return res.status(201).json({
      message: 'Alert sent successfully',
      notification,
      emailStatus
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 4. PUT /api/notifications/settings
// Update notification preferences: email/in-app
router.put('/settings', protect, async (req, res) => {
  try {
    const { emailEnabled } = req.body;
    
    if (emailEnabled !== undefined) {
      userPreferences[req.user._id.toString()] = {
        emailEnabled: Boolean(emailEnabled)
      };
    }

    const currentPreferences = userPreferences[req.user._id.toString()] || { emailEnabled: true };
    return res.status(200).json({
      message: 'Notification settings updated',
      preferences: currentPreferences
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
