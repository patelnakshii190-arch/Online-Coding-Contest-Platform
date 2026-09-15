import express from 'express';
import { readDb, writeDb } from '../db.js';
import { runJudgeExecution } from '../executor.js';

const router = express.Router();

// POST /api/submissions/run
router.post('/run', async (req, res) => {
  const { problemId, code, language, customInput } = req.body;
  const db = readDb();
  const problem = db.problems.find((p) => p.id === problemId || p.slug === problemId);

  if (!problem) return res.status(404).json({ message: 'Problem not found' });

  try {
    const result = await runJudgeExecution({
      code,
      language,
      problem,
      customInput,
      isRunOnly: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Judge execution failed: ' + err.message });
  }
});

// POST /api/submissions/submit
router.post('/submit', async (req, res) => {
  const { problemId, code, language } = req.body;
  const db = readDb();
  const problem = db.problems.find((p) => p.id === problemId || p.slug === problemId);

  if (!problem) return res.status(404).json({ message: 'Problem not found' });

  try {
    const result = await runJudgeExecution({
      code,
      language,
      problem,
      isRunOnly: false,
    });

    db.submissions.unshift(result);

    if (result.verdict === 'ACCEPTED') {
      const idx = db.problems.findIndex((p) => p.id === problem.id);
      if (idx !== -1) {
        db.problems[idx].solvedStatus = 'solved';
      }
    }

    writeDb(db);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Submission failed: ' + err.message });
  }
});

// GET /api/submissions/problem/:problemId
router.get('/problem/:problemId', (req, res) => {
  const db = readDb();
  const subs = db.submissions.filter((s) => s.problemId === req.params.problemId);
  res.json(subs);
});

// GET /api/submissions
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.submissions);
});

export default router;
