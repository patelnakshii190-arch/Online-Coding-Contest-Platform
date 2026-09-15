import express from 'express';
import { readDb } from '../db.js';

const router = express.Router();

function shadowScore(u) {
  if (!u.solvedCount) return 1200;
  return (u.solvedCount.easy * 100) + (u.solvedCount.medium * 300) + (u.solvedCount.hard * 500);
}

// GET /api/leaderboard
router.get('/', (req, res) => {
  const db = readDb();

  const entries = db.users.map((u, idx) => ({
    rank: idx + 1,
    userId: u.id,
    name: u.name || u.username,
    username: u.username,
    rating: u.rating,
    totalScore: shadowScore(u),
    totalPenalty: 25 + idx * 10,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 8, penaltyMinutes: 0 },
      B: { solved: true, attempts: 1, solvedTimeMinutes: 22, penaltyMinutes: 0 },
      C: { solved: false, attempts: 2, penaltyMinutes: 10 },
      D: { solved: false, attempts: 0 }
    }
  }));

  res.json(entries);
});

export default router;
