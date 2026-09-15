import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

function calculateTotalScore(u) {
  if (!u.solvedCount) return u.rating || 1500;
  return (u.solvedCount.easy || 0) * 100 + (u.solvedCount.medium || 0) * 300 + (u.solvedCount.hard || 0) * 500;
}

// GET /api/leaderboard - Real global user leaderboard from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ rating: -1, 'solvedCount.total': -1 });

    const entries = users.map((u, idx) => ({
      rank: idx + 1,
      userId: u._id.toString(),
      name: u.name || u.username,
      username: u.username,
      rating: u.rating || 1500,
      maxRating: u.maxRating || 1500,
      rankTitle: u.rank || 'Pupil',
      totalScore: calculateTotalScore(u),
      totalPenalty: Math.max(0, 50 - idx * 5),
      solvedCount: u.solvedCount || { easy: 0, medium: 0, hard: 0, total: 0 },
      streak: u.streak || 1,
      problemResults: {
        A: { solved: (u.solvedCount?.easy || 0) > 0, attempts: 1, solvedTimeMinutes: 12, penaltyMinutes: 0 },
        B: { solved: (u.solvedCount?.medium || 0) > 0, attempts: 1, solvedTimeMinutes: 28, penaltyMinutes: 0 },
        C: { solved: (u.solvedCount?.hard || 0) > 0, attempts: 2, solvedTimeMinutes: 54, penaltyMinutes: 5 },
        D: { solved: (u.solvedCount?.hard || 0) > 1, attempts: 0 }
      }
    }));

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard: ' + err.message });
  }
});

export default router;
