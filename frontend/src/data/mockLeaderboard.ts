import { LeaderboardEntry } from '../types/contest';

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u-101',
    name: 'Priya Sharma',
    username: 'priya_algo',
    rating: 3450,
    totalScore: 3300,
    totalPenalty: 42,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 6, penaltyMinutes: 0 },
      B: { solved: true, attempts: 1, solvedTimeMinutes: 14, penaltyMinutes: 0 },
      C: { solved: true, attempts: 1, solvedTimeMinutes: 28, penaltyMinutes: 0 },
      D: { solved: true, attempts: 2, solvedTimeMinutes: 42, penaltyMinutes: 5 }
    }
  },
  {
    rank: 2,
    userId: 'u-102',
    name: 'Rohit Kumar',
    username: 'rohit_dev',
    rating: 3120,
    totalScore: 3300,
    totalPenalty: 54,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 4, penaltyMinutes: 0 },
      B: { solved: true, attempts: 1, solvedTimeMinutes: 16, penaltyMinutes: 0 },
      C: { solved: true, attempts: 2, solvedTimeMinutes: 32, penaltyMinutes: 5 },
      D: { solved: true, attempts: 1, solvedTimeMinutes: 49, penaltyMinutes: 0 }
    }
  },
  {
    rank: 3,
    userId: 'u-103',
    name: 'Ananya Gupta',
    username: 'ananya_cpp',
    rating: 2890,
    totalScore: 1800,
    totalPenalty: 31,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 8, penaltyMinutes: 0 },
      B: { solved: true, attempts: 1, solvedTimeMinutes: 19, penaltyMinutes: 0 },
      C: { solved: true, attempts: 1, solvedTimeMinutes: 31, penaltyMinutes: 0 },
      D: { solved: false, attempts: 3, penaltyMinutes: 15 }
    }
  },
  {
    rank: 4,
    userId: 'u-104',
    name: 'Vikram Singh',
    username: 'vikram_singh',
    rating: 2450,
    totalScore: 1800,
    totalPenalty: 48,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 10, penaltyMinutes: 0 },
      B: { solved: true, attempts: 2, solvedTimeMinutes: 22, penaltyMinutes: 5 },
      C: { solved: true, attempts: 1, solvedTimeMinutes: 43, penaltyMinutes: 0 },
      D: { solved: false, attempts: 1, penaltyMinutes: 0 }
    }
  },
  {
    rank: 5,
    userId: 'user_1',
    name: 'Aditya Verma',
    username: 'aditya_coder',
    rating: 1850,
    totalScore: 800,
    totalPenalty: 22,
    problemResults: {
      A: { solved: true, attempts: 1, solvedTimeMinutes: 9, penaltyMinutes: 0 },
      B: { solved: true, attempts: 1, solvedTimeMinutes: 22, penaltyMinutes: 0 },
      C: { solved: false, attempts: 2, penaltyMinutes: 10 },
      D: { solved: false, attempts: 0 }
    }
  }
];
