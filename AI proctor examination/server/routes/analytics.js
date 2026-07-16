import express from 'express';
import { protect } from '../middleware/auth.js';
import TestSession from '../models/TestSession.js';

const router = express.Router();

// 1. GET /api/analytics/report/:sessionId
// Get individual session report with score, accuracy, time
router.get('/report/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId).populate('testSeries', 'title description');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to session report' });
    }

    const totalQuestions = session.responses.length;
    const correctAnswers = session.responses.filter(r => r.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    
    let totalTime = 0;
    session.responses.forEach(r => totalTime += (r.timeSpent || 0));

    return res.status(200).json({
      sessionId: session._id,
      title: session.testSeries?.title || 'Unknown Test',
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score: session.totalScore,
      percentile: session.percentile,
      totalTimeSpent: totalTime, // in seconds
      currentTheta: session.currentTheta
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/analytics/skills/:sessionId
// Get category-wise/skill-wise performance report
router.get('/skills/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId).populate('responses.questionId');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Grouping responses by category
    const categories = {};

    session.responses.forEach((resp) => {
      const q = resp.questionId;
      if (!q) return;

      const cat = q.category || 'general';
      if (!categories[cat]) {
        categories[cat] = {
          category: cat,
          total: 0,
          correct: 0,
          timeSpent: 0,
        };
      }

      categories[cat].total += 1;
      if (resp.isCorrect) categories[cat].correct += 1;
      categories[cat].timeSpent += resp.timeSpent || 0;
    });

    const categoryBreakdown = Object.values(categories).map((c) => ({
      category: c.category,
      total: c.total,
      correct: c.correct,
      accuracy: parseFloat(((c.correct / c.total) * 100).toFixed(2)),
      averageTime: parseFloat((c.timeSpent / c.total).toFixed(1)),
    }));

    return res.status(200).json({ categoryBreakdown });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. GET /api/analytics/history
// Get historical trend of user's ability estimates (thetas) across completed sessions
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await TestSession.find({ user: req.user._id, status: 'completed' })
      .populate('testSeries', 'title')
      .sort({ createdAt: 1 }); // chronological

    const history = sessions.map((s) => ({
      sessionId: s._id,
      testTitle: s.testSeries?.title || 'Mock Test',
      date: s.endTime || s.createdAt,
      finalTheta: s.currentTheta,
      score: s.totalScore,
      percentile: s.percentile
    }));

    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 4. GET /api/analytics/distribution/:testSeriesId
// Get test score distribution, mean, median, SD
router.get('/distribution/:testSeriesId', protect, async (req, res) => {
  try {
    const { testSeriesId } = req.params;
    const sessions = await TestSession.find({ testSeries: testSeriesId, status: 'completed' });
    
    if (sessions.length === 0) {
      return res.status(200).json({
        message: 'No completed sessions found for this test',
        stats: { mean: 0, median: 0, stdDev: 0, count: 0 },
        distribution: []
      });
    }

    const scores = sessions.map(s => s.totalScore).sort((a, b) => a - b);
    const count = scores.length;

    // Calculate Mean
    const sum = scores.reduce((a, b) => a + b, 0);
    const mean = parseFloat((sum / count).toFixed(2));

    // Calculate Median
    let median = 0;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = parseFloat(((scores[mid - 1] + scores[mid]) / 2).toFixed(2));
    } else {
      median = scores[mid];
    }

    // Calculate Standard Deviation
    const sqDiffs = scores.map(s => Math.pow(s - mean, 2));
    const meanSqDiff = sqDiffs.reduce((a, b) => a + b, 0) / count;
    const stdDev = parseFloat(Math.sqrt(meanSqDiff).toFixed(2));

    // Generate bucket distribution for charting (0-20, 21-40, 41-60, 61-80, 81-100)
    const buckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    scores.forEach((s) => {
      if (s <= 20) buckets['0-20'] += 1;
      else if (s <= 40) buckets['21-40'] += 1;
      else if (s <= 60) buckets['41-60'] += 1;
      else if (s <= 80) buckets['61-80'] += 1;
      else buckets['81-100'] += 1;
    });

    const distribution = Object.keys(buckets).map(key => ({
      range: key,
      count: buckets[key]
    }));

    return res.status(200).json({
      stats: { mean, median, stdDev, count },
      distribution
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 5. GET /api/analytics/percentile/:sessionId
// Get calculated percentile ranking for the session
router.get('/percentile/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Re-evaluate percentile
    const otherSessions = await TestSession.find({
      testSeries: session.testSeries,
      status: 'completed',
      _id: { $ne: session._id }
    });

    const totalCompetitors = otherSessions.length;
    let percentile = 100.0;
    if (totalCompetitors > 0) {
      const scoringLower = otherSessions.filter(s => s.totalScore < session.totalScore).length;
      percentile = parseFloat(((scoringLower / totalCompetitors) * 100).toFixed(2));
      
      // Update DB copy just in case it wasn't synced
      session.percentile = percentile;
      await session.save();
    }

    return res.status(200).json({
      sessionId: session._id,
      score: session.totalScore,
      percentile,
      competitorsCount: totalCompetitors
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 6. GET /api/analytics/export-pdf/:sessionId
// Generate download token for PDF score card
router.get('/export-pdf/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Mock generation token
    const pdfToken = `pdf-report-token-${session._id}-${Date.now()}`;
    return res.status(200).json({
      downloadUrl: `/api/analytics/download-report?token=${pdfToken}`,
      sessionId: session._id,
      exportDate: new Date()
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
