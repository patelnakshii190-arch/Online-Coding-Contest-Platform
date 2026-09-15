import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE = path.resolve(process.cwd(), 'database.json');

// Initial seed data with Indian coders & no photo avatars
const initialData = {
  users: [
    {
      id: 'user_1',
      name: 'Aditya Verma',
      username: 'aditya_coder',
      email: 'aditya@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'admin',
      rating: 1850,
      maxRating: 1920,
      rank: 'Knight',
      solvedCount: { easy: 42, medium: 28, hard: 6, total: 76 },
      streak: 14,
      joinedDate: 'January 2024',
    },
    {
      id: 'u_101',
      name: 'Priya Sharma',
      username: 'priya_algo',
      email: 'priya@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'user',
      rating: 3450,
      maxRating: 3500,
      rank: 'Grandmaster',
      solvedCount: { easy: 450, medium: 620, hard: 380, total: 1450 },
      streak: 120,
      joinedDate: 'March 2022',
    },
    {
      id: 'u_102',
      name: 'Rohit Kumar',
      username: 'rohit_dev',
      email: 'rohit@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'user',
      rating: 3120,
      maxRating: 3200,
      rank: 'Master',
      solvedCount: { easy: 320, medium: 410, hard: 210, total: 940 },
      streak: 45,
      joinedDate: 'June 2023',
    }
  ],
  problems: [
    {
      id: 'prob-1',
      slug: 'two-sum',
      title: '1. Two Sum',
      difficulty: 'Easy',
      category: 'Arrays & Hashing',
      tags: ['Array', 'Hash Table'],
      acceptanceRate: 52.4,
      likes: 42100,
      dislikes: 1350,
      timeLimitSec: 1.0,
      memoryLimitMB: 256,
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      inputFormat: 'Line 1: Array of integers nums.\nLine 2: Target integer target.',
      outputFormat: 'Array of two 0-indexed integers [i, j].',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
      sampleTestCases: [
        { id: 'tc-1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', isHidden: false },
        { id: 'tc-2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', isHidden: false }
      ],
      hiddenTestCases: [
        { id: 'tc-h1', input: 'nums = [1,5,8,12,20], target = 20', expectedOutput: '[2,3]', isHidden: true }
      ],
      starterTemplates: {
        cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
        java: `import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`,
        python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
        javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`
      }
    },
    {
      id: 'prob-2',
      slug: 'valid-parentheses',
      title: '20. Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      tags: ['String', 'Stack'],
      acceptanceRate: 40.8,
      likes: 23100,
      dislikes: 980,
      timeLimitSec: 1.0,
      memoryLimitMB: 256,
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      inputFormat: 'Single string s.',
      outputFormat: 'Boolean true or false.',
      constraints: ['1 <= s.length <= 10^4'],
      sampleTestCases: [
        { id: 'tc-vp-1', input: 's = "()"', expectedOutput: 'true', isHidden: false },
        { id: 'tc-vp-2', input: 's = "(]"', expectedOutput: 'false', isHidden: false }
      ],
      hiddenTestCases: [],
      starterTemplates: {
        cpp: `class Solution { public: bool isValid(string s) { return true; } };`,
        java: `class Solution { public boolean isValid(String s) { return true; } }`,
        python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        return True`,
        javascript: `function isValid(s) {\n    return true;\n}`
      }
    }
  ],
  submissions: [],
  contests: [
    {
      id: 'contest-live-1',
      title: 'Weekly Contest 402',
      slug: 'weekly-contest-402',
      description: 'Welcome to Weekly Contest 402! Compete with top programmers worldwide.',
      startTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 70 * 60 * 1000).toISOString(),
      status: 'LIVE',
      durationMinutes: 90,
      registeredCount: 4120,
      isRegistered: true,
      rules: ['Penalty of 5 minutes per wrong submission.', 'Total score then penalty ranking.'],
      problems: [
        { id: 'cp-1', problemId: 'prob-1', letter: 'A', title: 'Two Sum', points: 300, difficulty: 'Easy' },
        { id: 'cp-2', problemId: 'prob-2', letter: 'B', title: 'Valid Parentheses', points: 500, difficulty: 'Easy' }
      ]
    }
  ]
};

// Always overwrite database.json to apply fresh seed
fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));

export const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return initialData;
  }
};

export const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};
