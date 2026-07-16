import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import TestSession from '../models/TestSession.js';
import Question from '../models/Question.js';
import TestSeries from '../models/TestSeries.js';
import { estimateThetaEAP, getItemInformation, calibrateDifficulty } from '../services/irtEngine.js';

const router = express.Router();

// 1. POST /api/adaptive/initialize
// Initialize adaptive session, sets initial theta
router.post('/initialize', protect, async (req, res) => {
  try {
    const { testSeriesId } = req.body;
    
    // Check if test series exists
    const testSeries = await TestSeries.findById(testSeriesId);
    if (!testSeries) {
      return res.status(404).json({ message: 'Test series not found' });
    }

    // Check if user has access if it's premium
    if (testSeries.isPremium && !req.user.purchasedTestSeries.includes(testSeriesId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Please purchase this premium test series to start' });
    }

    // Check if there is an active session
    let session = await TestSession.findOne({
      user: req.user._id,
      testSeries: testSeriesId,
      status: 'active',
    });

    if (session) {
      return res.status(200).json({ message: 'Active session found', session });
    }

    // Create a new active adaptive session
    session = new TestSession({
      user: req.user._id,
      testSeries: testSeriesId,
      currentTheta: 0.0,
      abilityHistory: [0.0],
      responses: [],
      currentQuestionIndex: 0,
      startTime: new Date(),
      status: 'active',
      reviewStatus: 'clean',
    });

    await session.save();
    return res.status(201).json({ message: 'Adaptive session initialized', session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/adaptive/next-question
// Get next adaptive question based on current theta and category
router.get('/next-question', protect, async (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = await TestSession.findById(sessionId).populate('testSeries');
    if (!session || session.status !== 'active') {
      return res.status(404).json({ message: 'Active session not found' });
    }

    // Get list of already answered questions
    const answeredIds = session.responses.map((r) => r.questionId.toString());

    // Retrieve all questions in this test series
    const testSeries = await TestSeries.findById(session.testSeries._id).populate('questions');
    const availableQuestions = testSeries.questions.filter(
      (q) => !answeredIds.includes(q._id.toString()) && q.status === 'active'
    );

    if (availableQuestions.length === 0) {
      return res.status(200).json({ message: 'No more questions available. Test completed.', finished: true });
    }

    // Select the question with the maximum Item Information Function (IIF) at the current theta
    let bestQuestion = null;
    let maxInfo = -Infinity;

    for (const q of availableQuestions) {
      const info = getItemInformation(session.currentTheta, q.discrimination, q.difficulty, q.guessing);
      if (info > maxInfo) {
        maxInfo = info;
        bestQuestion = q;
      }
    }

    // Return the question (hiding correct answer index from client)
    const questionObj = {
      _id: bestQuestion._id,
      text: bestQuestion.text,
      options: bestQuestion.options,
      category: bestQuestion.category,
      difficulty: bestQuestion.difficulty,
      discrimination: bestQuestion.discrimination,
    };

    return res.status(200).json({ question: questionObj, finished: false });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. POST /api/adaptive/submit-response
// Submit answer for current question, updates theta using 2PL/3PL
router.post('/submit-response', protect, async (req, res) => {
  try {
    const { sessionId, questionId, selectedOptionIndex, timeSpent } = req.body;

    const session = await TestSession.findById(sessionId);
    if (!session || session.status !== 'active') {
      return res.status(404).json({ message: 'Active session not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Verify question is not already answered
    const alreadyAnswered = session.responses.some((r) => r.questionId.toString() === questionId);
    if (alreadyAnswered) {
      return res.status(400).json({ message: 'Question already answered' });
    }

    const isCorrect = question.correctOptionIndex === Number(selectedOptionIndex);

    // Prepare responses data structure for EAP engine
    // We need to fetch parameters for all previously answered questions as well
    const previousResponses = [];
    for (const resItem of session.responses) {
      const q = await Question.findById(resItem.questionId);
      previousResponses.push({
        isCorrect: resItem.isCorrect,
        a: q.discrimination,
        b: q.difficulty,
        c: q.guessing,
      });
    }

    // Append current response details
    previousResponses.push({
      isCorrect,
      a: question.discrimination,
      b: question.difficulty,
      c: question.guessing,
    });

    // Compute new theta and standard error
    const { theta } = estimateThetaEAP(previousResponses);

    // Save response details to the session
    session.responses.push({
      questionId,
      selectedOptionIndex,
      isCorrect,
      timeSpent: timeSpent || 0,
      thetaAfter: theta,
    });

    session.currentTheta = theta;
    session.abilityHistory.push(theta);
    session.currentQuestionIndex += 1;

    await session.save();

    return res.status(200).json({
      message: 'Response submitted successfully',
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      newTheta: theta,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 4. GET /api/adaptive/session-progress
// Get current theta, ability history, and list of answered questions
router.get('/session-progress', protect, async (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = await TestSession.findById(sessionId)
      .populate('responses.questionId', 'text category difficulty');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    return res.status(200).json({
      currentTheta: session.currentTheta,
      abilityHistory: session.abilityHistory,
      responsesCount: session.responses.length,
      responses: session.responses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 5. GET /api/adaptive/item-information
// Calculate Item Information Function (IIF) for a question at different thetas
router.get('/item-information', protect, async (req, res) => {
  try {
    const { questionId } = req.query;
    const q = await Question.findById(questionId);
    if (!q) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Generate curve points for theta from -3.0 to +3.0
    const infoCurve = [];
    for (let t = -3.0; t <= 3.0; t += 0.5) {
      const info = getItemInformation(t, q.discrimination, q.difficulty, q.guessing);
      infoCurve.push({ theta: t, information: parseFloat(info.toFixed(4)) });
    }

    return res.status(200).json({ questionId: q._id, text: q.text, infoCurve });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 6. POST /api/adaptive/reset
// Reset/restart adaptive test session
router.post('/reset', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Ensure session belongs to user
    if (session.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized session reset' });
    }

    session.currentTheta = 0.0;
    session.abilityHistory = [0.0];
    session.responses = [];
    session.currentQuestionIndex = 0;
    session.startTime = new Date();
    session.endTime = undefined;
    session.status = 'active';
    session.proctoringFlags = [];
    session.reviewStatus = 'clean';
    session.totalScore = 0;
    session.percentile = 0;

    await session.save();
    return res.status(200).json({ message: 'Session reset successfully', session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 7. PUT /api/adaptive/calibrate-question
// Admin: Adjust a, b, c parameters of a question based on stats
router.put('/calibrate-question', protect, authorize('admin', 'content-creator'), async (req, res) => {
  try {
    const { questionId, manualB, manualA, manualC } = req.body;
    const q = await Question.findById(questionId);
    if (!q) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (manualB !== undefined) q.difficulty = Number(manualB);
    if (manualA !== undefined) q.discrimination = Number(manualA);
    if (manualC !== undefined) q.guessing = Number(manualC);

    await q.save();
    return res.status(200).json({ message: 'Question parameters calibrated', question: q });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
