import express from 'express';
import { Problem } from '../models/Problem.js';
import { Submission } from '../models/Submission.js';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { runJudgeExecution } from '../executor.js';

const router = express.Router();

// POST /api/submissions/run - Run code sample / custom input
router.post('/run', async (req, res) => {
  const { problemId, code, language, customInput } = req.body;

  try {
    const problem = await Problem.findOne({
      $or: [{ problemId: problemId }, { slug: problemId }]
    });

    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const result = await runJudgeExecution({
      code,
      language,
      problem,
      customInput,
      user: req.user || null,
      isRunOnly: true
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Judge execution failed: ' + err.message });
  }
});

// POST /api/submissions/submit - Official evaluation (Requires Authentication)
router.post('/submit', authenticateToken, async (req, res) => {
  const { problemId, code, language } = req.body;

  try {
    const problem = await Problem.findOne({
      $or: [{ problemId: problemId }, { slug: problemId }]
    });

    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Authenticated user not found' });

    const result = await runJudgeExecution({
      code,
      language,
      problem,
      user,
      isRunOnly: false
    });

    // Save submission to MongoDB Atlas
    const savedSub = await Submission.create({
      submissionId: result.submissionId,
      problemId: problem.problemId,
      problemTitle: problem.title,
      userId: user._id.toString(),
      userName: user.username,
      code,
      language,
      verdict: result.verdict,
      runtimeMs: result.runtimeMs,
      memoryMB: result.memoryMB,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases,
      submittedAt: new Date()
    });

    // If Accepted, update user solved progress in MongoDB
    if (result.verdict === 'ACCEPTED') {
      const diffKey = (problem.difficulty || 'Easy').toLowerCase();
      
      // Update User solvedCount in MongoDB if not already counted
      if (!user.solvedProblems) user.solvedProblems = [];
      
      const alreadySolved = user.solvedProblems.includes(problem.problemId);
      if (!alreadySolved) {
        user.solvedProblems.push(problem.problemId);
        
        if (!user.solvedCount) {
          user.solvedCount = { easy: 0, medium: 0, hard: 0, total: 0 };
        }
        
        if (diffKey === 'easy') user.solvedCount.easy = (user.solvedCount.easy || 0) + 1;
        else if (diffKey === 'medium') user.solvedCount.medium = (user.solvedCount.medium || 0) + 1;
        else if (diffKey === 'hard') user.solvedCount.hard = (user.solvedCount.hard || 0) + 1;
        user.solvedCount.total = (user.solvedCount.total || 0) + 1;
        
        // Increase user rating slightly for real progress
        user.rating = (user.rating || 1500) + (diffKey === 'easy' ? 10 : diffKey === 'medium' ? 25 : 50);
        user.maxRating = Math.max(user.maxRating || 1500, user.rating);
        
        await user.save();
      }
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Submission evaluation failed: ' + err.message });
  }
});

// GET /api/submissions/problem/:problemId
router.get('/problem/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findOne({
      $or: [{ problemId: problemId }, { slug: problemId }]
    });

    const targetId = problem ? problem.problemId : problemId;
    const subs = await Submission.find({ problemId: targetId }).sort({ createdAt: -1 }).limit(50);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions: ' + err.message });
  }
});

// GET /api/submissions
router.get('/', async (req, res) => {
  try {
    const subs = await Submission.find().sort({ createdAt: -1 }).limit(100);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions: ' + err.message });
  }
});

export default router;
