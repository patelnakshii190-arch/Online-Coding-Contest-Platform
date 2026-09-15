import express from 'express';
import { readDb, writeDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/problems
router.get('/', (req, res) => {
  const db = readDb();
  const { difficulty, tag, search } = req.query;

  let filtered = db.problems;

  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter((p) => p.difficulty === difficulty);
  }
  if (tag && tag !== 'All') {
    filtered = filtered.filter((p) => p.tags.includes(tag));
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.slug.includes(q));
  }

  res.json(filtered);
});

// GET /api/problems/:slug
router.get('/:slug', (req, res) => {
  const db = readDb();
  const problem = db.problems.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!problem) return res.status(404).json({ message: 'Problem not found' });
  res.json(problem);
});

// POST /api/problems (Admin only)
router.post('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const db = readDb();
  const problemData = req.body;

  const newProblem = {
    ...problemData,
    id: 'prob-' + (db.problems.length + 1),
    likes: 0,
    dislikes: 0,
    acceptanceRate: 0.0,
  };

  db.problems.unshift(newProblem);
  writeDb(db);

  res.status(201).json(newProblem);
});

export default router;
