import { Contest } from '../types/contest';

const now = new Date();

export const mockContests: Contest[] = [
  {
    id: 'contest-live-1',
    title: 'Weekly Contest 402',
    slug: 'weekly-contest-402',
    description: 'Welcome to Weekly Contest 402! Compete with top programmers worldwide. 4 algorithmic challenges in 90 minutes.',
    startTime: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() + 65 * 60 * 1000).toISOString(),
    status: 'LIVE',
    durationMinutes: 90,
    registeredCount: 4120,
    isRegistered: true,
    rules: [
      'Penalty of 5 minutes for every wrong submission.',
      'Ranking is determined by total score, then total penalty time.',
      'Plagiarism checks will be conducted post-contest.'
    ],
    problems: [
      { id: 'cp-1', problemId: 'prob-1', letter: 'A', title: 'Two Sum', points: 300, difficulty: 'Easy' },
      { id: 'cp-2', problemId: 'prob-2', letter: 'B', title: 'Valid Parentheses', points: 500, difficulty: 'Easy' },
      { id: 'cp-3', problemId: 'prob-3', letter: 'C', title: 'Longest Substring Without Repeating', points: 1000, difficulty: 'Medium' },
      { id: 'cp-4', problemId: 'prob-5', letter: 'D', title: 'Coin Change', points: 1500, difficulty: 'Medium' }
    ]
  },
  {
    id: 'contest-up-1',
    title: 'Biweekly Contest 128',
    slug: 'biweekly-contest-128',
    description: 'Official biweekly rated round. Test your algorithms, data structures, and speed.',
    startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() + (2 * 24 * 60 + 90) * 60 * 1000).toISOString(),
    status: 'UPCOMING',
    durationMinutes: 90,
    registeredCount: 1890,
    isRegistered: false,
    rules: [
      'Standard ICPC penalty rules apply.',
      'All submissions are evaluated against hidden test suites.'
    ],
    problems: [
      { id: 'cp-10', problemId: 'prob-1', letter: 'A', title: 'Array Sum Challenge', points: 300, difficulty: 'Easy' },
      { id: 'cp-11', problemId: 'prob-3', letter: 'B', title: 'Subsegment Magic', points: 700, difficulty: 'Medium' },
      { id: 'cp-12', problemId: 'prob-4', letter: 'C', title: 'Median Partition', points: 1400, difficulty: 'Hard' }
    ]
  },
  {
    id: 'contest-ended-1',
    title: 'Global Speed Coding Championship 2026',
    slug: 'speed-coding-2026',
    description: 'High speed competitive programming arena with top rated coders across the globe.',
    startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
    status: 'ENDED',
    durationMinutes: 120,
    registeredCount: 8420,
    isRegistered: true,
    rules: [
      'Rated for all users.',
      'Top 10 participants receive exclusive badges.'
    ],
    problems: [
      { id: 'cp-20', problemId: 'prob-1', letter: 'A', title: 'Two Sum', points: 250, difficulty: 'Easy' },
      { id: 'cp-21', problemId: 'prob-2', letter: 'B', title: 'Valid Parentheses', points: 500, difficulty: 'Easy' },
      { id: 'cp-22', problemId: 'prob-4', letter: 'C', title: 'Median of Two Sorted Arrays', points: 1500, difficulty: 'Hard' }
    ]
  }
];
