export interface UserActivityDay {
  date: string; // YYYY-MM-DD
  status: 'completed' | 'frozen' | 'recovered' | 'missed';
  count: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  rating: number;
  maxRating: number;
  rank: string;
  solvedCount: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  contestHistory: {
    contestId: string;
    contestTitle: string;
    rank: number;
    ratingChange: number;
    newRating: number;
    date: string;
  }[];
  streak: number;
  maxStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakFreezes: number;
  streakStatus: 'active' | 'at_risk' | 'broken' | 'recovered' | 'frozen';
  activityHistory: UserActivityDay[];
  joinedDate: string;
}
