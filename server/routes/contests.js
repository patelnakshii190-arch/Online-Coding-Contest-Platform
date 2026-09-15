import express from 'express';
import { readDb, writeDb } from '../db.js';

const router = express.Router();

// GET /api/contests
router.get('/', (req, res) => {
  const db = readDb();
  res.json(db.contests);
});

// GET /api/contests/:slug
router.get('/:slug', (req, res) => {
  const db = readDb();
  const contest = db.contests.find((c) => c.slug === req.params.slug || c.id === req.params.slug);
  if (!contest) return res.status(404).json({ message: 'Contest not found' });
  res.json(contest);
});

// POST /api/contests/:id/register
router.post('/:id/register', (req, res) => {
  const db = readDb();
  const contest = db.contests.find((c) => c.id === req.params.id);
  if (!contest) return res.status(404).json({ message: 'Contest not found' });

  contest.isRegistered = !contest.isRegistered;
  contest.registeredCount = contest.isRegistered ? contest.registeredCount + 1 : contest.registeredCount - 1;

  writeDb(db);
  res.json(contest);
});

export default router;
