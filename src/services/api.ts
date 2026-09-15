import { Problem } from '../types/problem';
import { Contest, LeaderboardEntry } from '../types/contest';
import { Submission } from '../types/submission';
import { StorageService } from './storage';
import { executeCodeInBrowser } from './judgeSimulator';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('codearena_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const ApiService = {
  // Problems API
  getProblems: async (params?: { difficulty?: string; tag?: string; search?: string }): Promise<Problem[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params?.tag) queryParams.append('tag', params.tag);
      if (params?.search) queryParams.append('search', params.search);

      const url = `${API_BASE}/problems${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }

    let problems = StorageService.getProblems();
    if (params?.difficulty && params.difficulty !== 'ALL') {
      problems = problems.filter((p) => p.difficulty.toLowerCase() === params.difficulty?.toLowerCase());
    }
    if (params?.tag && params.tag !== 'ALL') {
      problems = problems.filter((p) => p.tags.includes(params.tag!) || p.category === params.tag);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      problems = problems.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return problems;
  },

  getAdminProblems: async (): Promise<Problem[]> => {
    try {
      const res = await fetch(`${API_BASE}/problems/admin/all`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getProblems();
  },

  getProblemBySlug: async (slug: string): Promise<Problem | null> => {
    try {
      const res = await fetch(`${API_BASE}/problems/${slug}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getProblemBySlug(slug);
  },

  createProblem: async (problemData: Partial<Problem>): Promise<Problem> => {
    try {
      const res = await fetch(`${API_BASE}/problems`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(problemData),
      });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }

    const newProblem: Problem = {
      id: 'prob-' + Math.random().toString(36).substr(2, 6),
      slug: problemData.slug || (problemData.title || 'custom').toLowerCase().replace(/\s+/g, '-'),
      title: problemData.title || 'New Problem',
      difficulty: problemData.difficulty || 'Easy',
      category: problemData.category || 'Algorithms',
      tags: problemData.tags || ['General'],
      acceptanceRate: 0,
      likes: 0,
      dislikes: 0,
      timeLimitSec: problemData.timeLimitSec || 1.0,
      memoryLimitMB: problemData.memoryLimitMB || 256,
      description: problemData.description || '',
      inputFormat: problemData.inputFormat || '',
      outputFormat: problemData.outputFormat || '',
      constraints: problemData.constraints || [],
      sampleTestCases: problemData.sampleTestCases || [],
      hiddenTestCases: problemData.hiddenTestCases || [],
      starterTemplates: problemData.starterTemplates || {
        javascript: '// Write solution here\nfunction solution(input) {\n  return input;\n}',
        python: '# Write solution here\ndef solution(input):\n    return input',
        cpp: '// Write solution here\n#include <iostream>\nint main() {\n  return 0;\n}',
        java: '// Write solution here\nclass Solution {\n    public Object solve(Object input) {\n        return input;\n    }\n}',
      },
    };

    return StorageService.saveProblem(newProblem);
  },

  updateProblem: async (id: string, problemData: Partial<Problem>): Promise<Problem> => {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(problemData),
      });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }

    const existing = StorageService.getProblemBySlug(id) || StorageService.getProblems().find((p) => p.id === id);
    if (!existing) throw new Error('Problem not found');
    const updated = { ...existing, ...problemData };
    return StorageService.saveProblem(updated);
  },

  deleteProblem: async (id: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return;
    } catch {
      // Static fallback
    }
    const problems = StorageService.getProblems().filter((p) => p.id !== id && p.slug !== id);
    localStorage.setItem('quantumarena_problems', JSON.stringify(problems));
  },

  // Submissions API
  submitCode: async (problem: Problem, code: string, language: string): Promise<Submission> => {
    try {
      const res = await fetch(`${API_BASE}/submissions/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
        }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Client-side static judge fallback
    }

    const sub = await executeCodeInBrowser({ code, language, problem, isRunOnly: false });
    return StorageService.addSubmission(sub);
  },

  runCodeSample: async (
    problem: Problem,
    code: string,
    language: string,
    customInput?: string
  ): Promise<Submission> => {
    try {
      const res = await fetch(`${API_BASE}/submissions/run`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          customInput,
        }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Client-side static judge fallback
    }

    return await executeCodeInBrowser({ code, language, problem, customInput, isRunOnly: true });
  },

  getSubmissionsForProblem: async (problemId: string): Promise<Submission[]> => {
    try {
      const res = await fetch(`${API_BASE}/submissions/problem/${problemId}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getSubmissions().filter((s) => s.problemId === problemId);
  },

  getAllSubmissions: async (): Promise<Submission[]> => {
    try {
      const res = await fetch(`${API_BASE}/submissions`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getSubmissions();
  },

  // Contests API
  getContests: async (): Promise<Contest[]> => {
    try {
      const res = await fetch(`${API_BASE}/contests`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getContests();
  },

  getContestBySlug: async (slug: string): Promise<Contest | null> => {
    try {
      const res = await fetch(`${API_BASE}/contests/${slug}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    const contests = StorageService.getContests();
    return contests.find((c) => c.slug === slug || c.id === slug) || null;
  },

  toggleContestRegistration: async (contestId: string): Promise<Contest> => {
    const contests = StorageService.getContests();
    const contest = contests.find((c) => c.id === contestId || c.slug === contestId);
    if (!contest) throw new Error('Contest not found');

    contest.isRegistered = !contest.isRegistered;
    contest.registeredCount += contest.isRegistered ? 1 : -1;
    localStorage.setItem('quantumarena_contests', JSON.stringify(contests));
    return contest;
  },

  createContest: async (contestData: Partial<Contest>): Promise<Contest> => {
    const contests = StorageService.getContests();
    const newContest: Contest = {
      id: 'contest-' + Math.random().toString(36).substr(2, 6),
      title: contestData.title || 'New Contest',
      slug: (contestData.title || 'contest').toLowerCase().replace(/\s+/g, '-'),
      description: contestData.description || '',
      startTime: contestData.startTime || new Date().toISOString(),
      endTime: contestData.endTime || new Date(Date.now() + 7200000).toISOString(),
      status: contestData.status || 'UPCOMING',
      durationMinutes: contestData.durationMinutes || 90,
      registeredCount: 1,
      isRegistered: true,
      rules: contestData.rules || [],
      problems: contestData.problems || [],
    };

    contests.unshift(newContest);
    localStorage.setItem('quantumarena_contests', JSON.stringify(contests));
    return newContest;
  },

  updateContest: async (id: string, contestData: Partial<Contest>): Promise<Contest> => {
    const contests = StorageService.getContests();
    const idx = contests.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) throw new Error('Contest not found');
    contests[idx] = { ...contests[idx], ...contestData };
    localStorage.setItem('quantumarena_contests', JSON.stringify(contests));
    return contests[idx];
  },

  deleteContest: async (id: string): Promise<void> => {
    const contests = StorageService.getContests().filter((c) => c.id !== id && c.slug !== id);
    localStorage.setItem('quantumarena_contests', JSON.stringify(contests));
  },

  // Leaderboard API
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }
    return StorageService.getLeaderboard();
  },
};
