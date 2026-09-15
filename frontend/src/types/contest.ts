export type ContestStatus = 'UPCOMING' | 'LIVE' | 'ENDED';

export interface ContestProblem {
  id: string;
  problemId: string;
  letter: string;
  title: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Contest {
  id: string;
  contestId?: string;
  title: string;
  slug: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  durationMinutes: number;
  registeredCount: number;
  isRegistered?: boolean;
  problems: ContestProblem[];
  rules: string[];
  problemIds?: string[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  rating: number;
  totalScore: number;
  totalPenalty: number;
  problemResults: Record<string, {
    solved: boolean;
    attempts: number;
    solvedTimeMinutes?: number;
    penaltyMinutes?: number;
  }>;
}
