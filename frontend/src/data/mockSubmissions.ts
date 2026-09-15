import { Submission } from '../types/submission';

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-901',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    userId: 'user_1',
    username: 'aditya_coder',
    language: 'cpp',
    code: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (mp.find(complement) != mp.end()) return {mp[complement], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
    verdict: 'ACCEPTED',
    passedTestCases: 4,
    totalTestCases: 4,
    runtimeMs: 12,
    memoryMB: 10.4,
    submittedAt: '2026-08-30T14:22:00Z',
  },
  {
    id: 'sub-902',
    problemId: 'prob-3',
    problemTitle: 'Longest Substring Without Repeating Characters',
    userId: 'user_1',
    username: 'aditya_coder',
    language: 'python',
    code: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_map = {}\n        left = max_len = 0\n        for right, char in enumerate(s):\n            if char in char_map:\n                left = max(left, char_map[char] + 1)\n            char_map[char] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len`,
    verdict: 'ACCEPTED',
    passedTestCases: 3,
    totalTestCases: 3,
    runtimeMs: 44,
    memoryMB: 14.2,
    submittedAt: '2026-08-29T10:15:00Z',
  },
];
