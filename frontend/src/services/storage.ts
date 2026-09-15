import { User } from '../types/user';
import { Problem } from '../types/problem';
import { Submission } from '../types/submission';
import { Contest, LeaderboardEntry } from '../types/contest';
import { mockProblems } from '../data/mockProblems';
import { mockContests } from '../data/mockContests';
import { mockLeaderboard } from '../data/mockLeaderboard';
import { mockSubmissions } from '../data/mockSubmissions';

const KEYS = {
  USERS: 'quantumarena_users',
  CURRENT_USER: 'quantumarena_user_session',
  PROBLEMS: 'quantumarena_problems',
  SUBMISSIONS: 'quantumarena_submissions',
  CONTESTS: 'quantumarena_contests',
  LEADERBOARD: 'quantumarena_leaderboard',
};

// Seed default Admin User
export const defaultAdminUser: User = {
  id: 'admin_1',
  name: 'Platform Administrator',
  username: 'admin_sys',
  email: 'admin@quantumarena.com',
  role: 'admin',
  rating: 2400,
  maxRating: 2400,
  rank: 'Grandmaster',
  solvedCount: { easy: 100, medium: 80, hard: 40, total: 220 },
  contestHistory: [],
  streak: 30,
  maxStreak: 30,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakFreezes: 5,
  streakStatus: 'active',
  activityHistory: [{ date: new Date().toISOString().split('T')[0], status: 'completed', count: 5 }],
  joinedDate: 'January 2024',
};

// Seed default Regular Student User
export const defaultStudentUser: User = {
  id: 'user_1',
  name: 'Aditya Verma',
  username: 'aditya_coder',
  email: 'aditya@example.com',
  role: 'user',
  rating: 1850,
  maxRating: 1920,
  rank: 'Knight',
  solvedCount: { easy: 42, medium: 28, hard: 6, total: 76 },
  contestHistory: [],
  streak: 14,
  maxStreak: 18,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakFreezes: 2,
  streakStatus: 'active',
  activityHistory: [{ date: new Date().toISOString().split('T')[0], status: 'completed', count: 3 }],
  joinedDate: 'January 2024',
};

// Initialize localStorage with seed data if empty
export const initStorage = (): void => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([defaultAdminUser, defaultStudentUser]));
  }
  if (!localStorage.getItem(KEYS.PROBLEMS)) {
    localStorage.setItem(KEYS.PROBLEMS, JSON.stringify(mockProblems));
  }
  if (!localStorage.getItem(KEYS.CONTESTS)) {
    localStorage.setItem(KEYS.CONTESTS, JSON.stringify(mockContests));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(mockSubmissions));
  }
  if (!localStorage.getItem(KEYS.LEADERBOARD)) {
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(mockLeaderboard));
  }
};

// Execute init on load
initStorage();

export const StorageService = {
  // --- USERS & SESSION ---
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : [defaultAdminUser, defaultStudentUser];
    } catch {
      return [defaultAdminUser, defaultStudentUser];
    }
  },

  saveUsers: (users: User[]): void => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      const users = StorageService.getUsers();
      const idx = users.findIndex((u) => u.id === user.id || u.email === user.email);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      StorageService.saveUsers(users);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // --- PROBLEMS ---
  getProblems: (): Problem[] => {
    try {
      const data = localStorage.getItem(KEYS.PROBLEMS);
      return data ? JSON.parse(data) : mockProblems;
    } catch {
      return mockProblems;
    }
  },

  getProblemBySlug: (slug: string): Problem | null => {
    const problems = StorageService.getProblems();
    return problems.find((p) => p.slug === slug || p.id === slug) || null;
  },

  saveProblem: (problem: Problem): Problem => {
    const problems = StorageService.getProblems();
    const existingIdx = problems.findIndex((p) => p.id === problem.id || p.slug === problem.slug);
    if (existingIdx >= 0) {
      problems[existingIdx] = problem;
    } else {
      problems.unshift(problem);
    }
    localStorage.setItem(KEYS.PROBLEMS, JSON.stringify(problems));
    return problem;
  },

  // --- SUBMISSIONS ---
  getSubmissions: (): Submission[] => {
    try {
      const data = localStorage.getItem(KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : mockSubmissions;
    } catch {
      return mockSubmissions;
    }
  },

  addSubmission: (submission: Submission): Submission => {
    const submissions = StorageService.getSubmissions();
    submissions.unshift(submission);
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(submissions));
    return submission;
  },

  // --- CONTESTS ---
  getContests: (): Contest[] => {
    try {
      const data = localStorage.getItem(KEYS.CONTESTS);
      return data ? JSON.parse(data) : mockContests;
    } catch {
      return mockContests;
    }
  },

  // --- LEADERBOARD ---
  getLeaderboard: (): LeaderboardEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : mockLeaderboard;
    } catch {
      return mockLeaderboard;
    }
  },

  // --- STREAK MANAGEMENT ---
  recordUserActivity: (user: User): User => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...user };
    if (!updated.activityHistory) updated.activityHistory = [];

    const existingToday = updated.activityHistory.find((a) => a.date === today);
    if (existingToday) {
      existingToday.count += 1;
      existingToday.status = 'completed';
    } else {
      updated.activityHistory.unshift({ date: today, status: 'completed', count: 1 });
    }

    if (updated.lastActiveDate !== today) {
      const lastDate = updated.lastActiveDate ? new Date(updated.lastActiveDate) : null;
      const currentDate = new Date(today);

      if (lastDate) {
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          updated.streak += 1;
          updated.streakStatus = 'active';
        } else if (diffDays > 1) {
          if (updated.streakStatus !== 'recovered' && updated.streakStatus !== 'frozen') {
            updated.streakStatus = 'broken';
          }
        }
      } else {
        updated.streak = 1;
        updated.streakStatus = 'active';
      }

      updated.lastActiveDate = today;
      if (updated.streak > updated.maxStreak) {
        updated.maxStreak = updated.streak;
      }
    }

    StorageService.saveCurrentUser(updated);
    return updated;
  },

  useStreakFreezeToken: (user: User): User => {
    if (user.streakFreezes <= 0) return user;
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...user,
      streakFreezes: user.streakFreezes - 1,
      streakStatus: 'frozen' as const,
      streak: user.streak > 0 ? user.streak : 1,
    };
    if (!updated.activityHistory) updated.activityHistory = [];
    updated.activityHistory.unshift({ date: today, status: 'frozen', count: 0 });
    StorageService.saveCurrentUser(updated);
    return updated;
  },

  completeStreakRecovery: (user: User): User => {
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...user,
      streak: (user.streak || 0) + 1,
      streakStatus: 'recovered' as const,
      lastActiveDate: today,
    };
    if (!updated.activityHistory) updated.activityHistory = [];
    updated.activityHistory.unshift({ date: today, status: 'recovered', count: 1 });
    if (updated.streak > updated.maxStreak) {
      updated.maxStreak = updated.streak;
    }
    StorageService.saveCurrentUser(updated);
    return updated;
  },
};
