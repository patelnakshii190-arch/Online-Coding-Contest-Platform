import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Problem } from './models/Problem.js';
import { Contest } from './models/Contest.js';
import { Submission } from './models/Submission.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const USERS_DATA = [
  {
    name: 'Priya Sharma',
    username: 'priya_algo',
    email: 'priya@quantumarena.in',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 3450,
    maxRating: 3450,
    rank: 'Grandmaster',
    streak: 28,
    solvedCount: { easy: 80, medium: 60, hard: 25, total: 165 }
  },
  {
    name: 'Rohit Kumar',
    username: 'rohit_dev',
    email: 'rohit@quantumarena.in',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 3120,
    maxRating: 3200,
    rank: 'Master',
    streak: 19,
    solvedCount: { easy: 65, medium: 48, hard: 15, total: 128 }
  },
  {
    name: 'Ananya Gupta',
    username: 'ananya_cpp',
    email: 'ananya@quantumarena.in',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 2890,
    maxRating: 2950,
    rank: 'International Master',
    streak: 14,
    solvedCount: { easy: 50, medium: 35, hard: 10, total: 95 }
  },
  {
    name: 'Vikram Singh',
    username: 'vikram_singh',
    email: 'vikram@quantumarena.in',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    rating: 2450,
    maxRating: 2500,
    rank: 'Candidate Master',
    streak: 9,
    solvedCount: { easy: 40, medium: 25, hard: 5, total: 70 }
  },
  {
    name: 'Platform Administrator',
    username: 'system_admin',
    email: 'admin@quantumarena.in',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    rating: 2400,
    maxRating: 2400,
    rank: 'Platform Admin',
    streak: 50,
    solvedCount: { easy: 100, medium: 80, hard: 20, total: 200 }
  }
];

const PROBLEMS_DATA = [
  {
    problemId: 'prob-1',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    acceptanceRate: 34.5,
    likes: 38200,
    dislikes: 1650,
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 'Single line containing string s.',
    outputFormat: 'Return integer length of longest unique substring.',
    constraints: ['0 <= s.length <= 5 * 10^4'],
    sampleTestCases: [
      { id: 'tc-1', input: 'abcabcbb', expectedOutput: '3', isHidden: false }
    ],
    hiddenTestCases: [
      { id: 'htc-1', input: 'bbbbb', expectedOutput: '1', isHidden: true },
      { id: 'htc-2', input: 'pwwkew', expectedOutput: '3', isHidden: true }
    ],
    solutionExplanation: `Sliding Window Approach:\nUse a set or dynamic map to track characters in the current window [left, right].\nWhen a duplicate character appears at s[right], shrink the window by advancing left pointer until duplicate is removed.\nTrack maxLen = max(maxLen, right - left + 1).\nTime Complexity: O(N)\nSpace Complexity: O(min(N, M)) where M is character set size.`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\nint lengthOfLongestSubstring(string s) { unordered_set<char> st; int left = 0, maxLen = 0; for (int right = 0; right < s.length(); right++) { while (st.count(s[right])) { st.erase(s[left++]); } st.insert(s[right]); maxLen = max(maxLen, right - left + 1); } return maxLen; }\nint main() { string s; getline(cin, s); cout << lengthOfLongestSubstring(s) << endl; return 0; }`,
      python: `import sys\ndef length_of_longest_substring(s: str) -> int:\n    char_set = set(); left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set: char_set.remove(s[left]); left += 1\n        char_set.add(s[right]); max_len = max(max_len, right - left + 1)\n    return max_len\nif __name__ == "__main__": line = sys.stdin.read().rstrip('\\n'); print(length_of_longest_substring(line))`
    }
  },
  {
    problemId: 'prob-2',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Greedy'],
    acceptanceRate: 54.1,
    likes: 27500,
    dislikes: 1480,
    description: 'Given an integer array height of length n, return the maximum amount of water a container can store.',
    inputFormat: 'Line contains space-separated integer heights.',
    outputFormat: 'Return maximum water area integer.',
    constraints: ['2 <= n <= 10^5'],
    sampleTestCases: [{ id: 'tc-1', input: '1 8 6 2 5 4 8 3 7', expectedOutput: '49', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '1 1', expectedOutput: '1', isHidden: true }],
    solutionExplanation: `Two Pointer Greedy Strategy:\nInitialize left = 0, right = n - 1.\nCalculate current_water = min(height[left], height[right]) * (right - left).\nUpdate max_water = max(max_water, current_water).\nMove pointer pointing to the shorter line because moving the taller line can never yield a larger area.\nTime Complexity: O(N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxArea(vector<int>& height) { int left = 0, right = height.size() - 1, maxWater = 0; while (left < right) { int currentWater = min(height[left], height[right]) * (right - left); maxWater = max(maxWater, currentWater); if (height[left] < height[right]) left++; else right--; } return maxWater; }\nint main() { vector<int> h; int val; while (cin >> val) { h.push_back(val); if (cin.peek() == '\\n') break; } cout << maxArea(h) << endl; return 0; }`,
      python: `import sys\ndef max_area(height: list[int]) -> int:\n    left, right = 0, len(height) - 1; max_water = 0\n    while left < right:\n        current_water = min(height[left], height[right]) * (right - left)\n        max_water = max(max_water, current_water)\n        if height[left] < height[right]: left += 1\n        else: right -= 1\n    return max_water\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(max_area(list(map(int, line.split()))))`
    }
  },
  {
    problemId: 'prob-3',
    title: 'Maximum Subarray Sum',
    slug: 'maximum-subarray-sum',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 50.4,
    likes: 33800,
    dislikes: 1420,
    description: 'Given an integer array nums, find the contiguous subarray with the largest sum using Kadanes Algorithm.',
    inputFormat: 'Line of space-separated integers.',
    outputFormat: 'Return maximum sum integer.',
    constraints: ['1 <= nums.length <= 10^5'],
    sampleTestCases: [{ id: 'tc-1', input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '5 4 -1 7 8', expectedOutput: '23', isHidden: true }],
    solutionExplanation: `Kadanes Algorithm:\nMaintain currMax and maxSoFar initialized to nums[0].\nFor each element x in nums[1...N]:\ncurrMax = max(x, currMax + x)\nmaxSoFar = max(maxSoFar, currMax)\nTime Complexity: O(N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxSubArray(vector<int>& nums) { int maxSoFar = nums[0], currMax = nums[0]; for (size_t i = 1; i < nums.size(); i++) { currMax = max(nums[i], currMax + nums[i]); maxSoFar = max(maxSoFar, currMax); } return maxSoFar; }\nint main() { vector<int> n; int val; while (cin >> val) { n.push_back(val); if (cin.peek() == '\\n') break; } cout << maxSubArray(n) << endl; return 0; }`,
      python: `import sys\ndef max_sub_array(nums: list[int]) -> int:\n    max_so_far = curr_max = nums[0]\n    for x in nums[1:]: curr_max = max(x, curr_max + x); max_so_far = max(max_so_far, curr_max)\n    return max_so_far\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(max_sub_array(list(map(int, line.split()))))`
    }
  },
  {
    problemId: 'prob-4',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    tags: ['Two Pointers', 'Dynamic Programming'],
    acceptanceRate: 61.2,
    likes: 31000,
    dislikes: 460,
    description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    inputFormat: 'Line of space-separated heights.',
    outputFormat: 'Return trapped water area integer.',
    constraints: ['1 <= n <= 2 * 10^4'],
    sampleTestCases: [{ id: 'tc-1', input: '0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '4 2 0 3 2 5', expectedOutput: '9', isHidden: true }],
    solutionExplanation: `Two Pointer Elevation Trap:\nMaintain left and right pointers along with leftMax and rightMax.\nIf height[left] <= height[right]:\n  if height[left] >= leftMax: update leftMax\n  else: add leftMax - height[left] to water\n  advance left\nElse do symmetric update for right.\nTime Complexity: O(N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint trap(vector<int>& h) { int left = 0, right = h.size() - 1, leftMax = 0, rightMax = 0, water = 0; while (left < right) { if (h[left] <= h[right]) { if (h[left] >= leftMax) leftMax = h[left]; else water += leftMax - h[left]; left++; } else { if (h[right] >= rightMax) rightMax = h[right]; else water += rightMax - h[right]; right--; } } return water; }\nint main() { vector<int> h; int v; while(cin >> v) { h.push_back(v); if(cin.peek()=='\\n') break; } cout << trap(h) << endl; return 0; }`,
      python: `import sys\ndef trap(height: list[int]) -> int:\n    left, right = 0, len(height) - 1; left_max = right_max = water = 0\n    while left < right:\n        if height[left] <= height[right]:\n            if height[left] >= left_max: left_max = height[left]\n            else: water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max: right_max = height[right]\n            else: water += right_max - height[right]\n            right -= 1\n    return water\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(trap(list(map(int, line.split()))))`
    }
  },
  {
    problemId: 'prob-5',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    category: 'Binary Search',
    tags: ['Binary Search', 'Array'],
    acceptanceRate: 39.8,
    likes: 25100,
    dislikes: 1450,
    description: 'Given a sorted array nums rotated at a pivot, return the index of target, or -1 if not found.',
    inputFormat: 'First line space-separated nums. Second line target.',
    outputFormat: 'Return integer index or -1.',
    constraints: ['1 <= nums.length <= 5000'],
    sampleTestCases: [{ id: 'tc-1', input: '4 5 6 7 0 1 2\n0', expectedOutput: '4', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '4 5 6 7 0 1 2\n3', expectedOutput: '-1', isHidden: true }],
    solutionExplanation: `Modified Binary Search:\nFind mid = (left + right) / 2.\nCheck which half is sorted:\n- If nums[left] <= nums[mid], left half is sorted.\n  If target lies within [nums[left], nums[mid]), search left half (right = mid - 1).\n  Else search right half (left = mid + 1).\n- Else right half is sorted.\nTime Complexity: O(log N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint search(vector<int>& nums, int target) { int left = 0, right = nums.size() - 1; while (left <= right) { int mid = left + (right - left) / 2; if (nums[mid] == target) return mid; if (nums[left] <= nums[mid]) { if (nums[left] <= target && target < nums[mid]) right = mid - 1; else left = mid + 1; } else { if (nums[mid] < target && target <= nums[right]) left = mid + 1; else right = mid - 1; } } return -1; }\nint main() { vector<int> nums; int val; while(cin >> val) { nums.push_back(val); if(cin.peek()=='\\n') break; } int target; cin >> target; cout << search(nums, target) << endl; return 0; }`,
      python: `import sys\ndef search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]: right = mid - 1\n            else: left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]: left = mid + 1\n            else: right = mid - 1\n    return -1\nif __name__ == "__main__": lines = sys.stdin.read().splitlines(); print(search(list(map(int, lines[0].split())), int(lines[1])))`
    }
  },
  {
    problemId: 'prob-6',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming'],
    acceptanceRate: 52.3,
    likes: 21500,
    dislikes: 740,
    description: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. Return distinct ways to top.',
    inputFormat: 'Single integer n.',
    outputFormat: 'Return integer ways.',
    constraints: ['1 <= n <= 45'],
    sampleTestCases: [{ id: 'tc-1', input: '3', expectedOutput: '3', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '5', expectedOutput: '8', isHidden: true }],
    solutionExplanation: `Fibonacci Sequence DP:\ndp[i] = dp[i-1] + dp[i-2] with base cases dp[1] = 1, dp[2] = 2.\nCan optimize space to O(1) by maintaining two variables a and b.\nTime Complexity: O(N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\nusing namespace std;\nint climbStairs(int n) { if (n <= 2) return n; int a = 1, b = 2; for (int i = 3; i <= n; i++) { int temp = a + b; a = b; b = temp; } return b; }\nint main() { int n; if (cin >> n) cout << climbStairs(n) << endl; return 0; }`,
      python: `import sys\ndef climb_stairs(n: int) -> int:\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1): a, b = b, a + b\n    return b\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(climb_stairs(int(line)))`
    }
  },
  {
    problemId: 'prob-7',
    title: 'Palindrome Number Check',
    slug: 'palindrome-number-check',
    difficulty: 'Easy',
    category: 'Math & Strings',
    tags: ['Math', 'String'],
    acceptanceRate: 55.1,
    likes: 13200,
    dislikes: 450,
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    inputFormat: 'Single integer x.',
    outputFormat: 'Return true or false.',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    sampleTestCases: [{ id: 'tc-1', input: '121', expectedOutput: 'true', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '-121', expectedOutput: 'false', isHidden: true }],
    solutionExplanation: `String / Math Reversal:\nNegative numbers are never palindromes.\nFor non-negative numbers, convert to string and compare with reversed string, or reverse integer mathematically by extracting digits.\nTime Complexity: O(log10 N)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nbool isPalindrome(int x) { if (x < 0) return false; string s = to_string(x), r = s; reverse(r.begin(), r.end()); return s == r; }\nint main() { int x; if (cin >> x) cout << (isPalindrome(x) ? "true" : "false") << endl; return 0; }`,
      python: `import sys\ndef is_palindrome(x: int) -> bool:\n    if x < 0: return False\n    s = str(x)\n    return s == s[::-1]\nif __name__ == "__main__": line = sys.stdin.read().strip(); print("true" if is_palindrome(int(line)) else "false")`
    }
  },
  {
    problemId: 'prob-8',
    title: 'Reverse Words in a String',
    slug: 'reverse-words-in-a-string',
    difficulty: 'Medium',
    category: 'Strings & Arrays',
    tags: ['String', 'Two Pointers'],
    acceptanceRate: 43.8,
    likes: 8200,
    dislikes: 510,
    description: 'Given an input string s, reverse the order of the words.',
    inputFormat: 'Single string line s.',
    outputFormat: 'Return reversed words string.',
    constraints: ['1 <= s.length <= 10^4'],
    sampleTestCases: [{ id: 'tc-1', input: 'the sky is blue', expectedOutput: 'blue is sky the', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '  hello world  ', expectedOutput: 'world hello', isHidden: true }],
    solutionExplanation: `Split & Reverse Words:\nSplit the string into non-empty tokens separated by spaces.\nReverse the array of tokens.\nJoin tokens with a single space.\nTime Complexity: O(N)\nSpace Complexity: O(N).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nstring reverseWords(string s) { stringstream ss(s); string word; vector<string> words; while (ss >> word) words.push_back(word); reverse(words.begin(), words.end()); string ans = ""; for (size_t i = 0; i < words.size(); i++) ans += words[i] + (i + 1 == words.size() ? "" : " "); return ans; }\nint main() { string s; getline(cin, s); cout << reverseWords(s) << endl; return 0; }`,
      python: `import sys\ndef reverse_words(s: str) -> str: return " ".join(reversed(s.split()))\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(reverse_words(line))`
    }
  },
  {
    problemId: 'prob-9',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack & Strings',
    tags: ['Stack', 'String'],
    acceptanceRate: 40.8,
    likes: 23100,
    dislikes: 1100,
    description: 'Given a string s containing bracket characters, determine if the string is valid.',
    inputFormat: 'Single string line s.',
    outputFormat: 'Return true or false.',
    constraints: ['1 <= s.length <= 10^4'],
    sampleTestCases: [{ id: 'tc-1', input: '()[]{}', expectedOutput: 'true', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '(]', expectedOutput: 'false', isHidden: true }],
    solutionExplanation: `Stack Matching:\nIterate through string s.\nPush open brackets '(', '{', '[' onto stack.\nFor closing brackets, pop stack and check matching bracket pair.\nReturn true if stack is empty at end.\nTime Complexity: O(N)\nSpace Complexity: O(N).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nbool isValid(string s) { stack<char> st; for (char c : s) { if (c == '(' || c == '{' || c == '[') st.push(c); else { if (st.empty()) return false; char top = st.top(); st.pop(); if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false; } } return st.empty(); }\nint main() { string s; if (cin >> s) cout << (isValid(s) ? "true" : "false") << endl; return 0; }`,
      python: `import sys\ndef is_valid(s: str) -> bool:\n    stack = []; mp = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mp:\n            top = stack.pop() if stack else '#'\n            if mp[char] != top: return False\n        else: stack.append(char)\n    return not stack\nif __name__ == "__main__": line = sys.stdin.read().strip(); print("true" if is_valid(line) else "false")`
    }
  },
  {
    problemId: 'prob-10',
    title: '3Sum (Three Sum)',
    slug: '3sum-three-sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    acceptanceRate: 33.2,
    likes: 29500,
    dislikes: 2700,
    description: 'Given an integer array nums, return count of triplets that sum to 0.',
    inputFormat: 'Line of space-separated numbers.',
    outputFormat: 'Return integer count.',
    constraints: ['3 <= nums.length <= 3000'],
    sampleTestCases: [{ id: 'tc-1', input: '-1 0 1 2 -1 -4', expectedOutput: '2', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '0 0 0', expectedOutput: '1', isHidden: true }],
    solutionExplanation: `Sorted Two Pointers for Triplets:\nSort array nums.\nFix index i from 0 to N-1.\nUse left = i + 1, right = N - 1 to find nums[i] + nums[left] + nums[right] == 0.\nSkip duplicate elements to guarantee unique triplets.\nTime Complexity: O(N^2)\nSpace Complexity: O(1).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint threeSumCount(vector<int>& nums) { sort(nums.begin(), nums.end()); int count = 0; for (size_t i = 0; i < nums.size(); i++) { if (i > 0 && nums[i] == nums[i-1]) continue; int left = i + 1, right = nums.size() - 1; while (left < right) { int sum = nums[i] + nums[left] + nums[right]; if (sum == 0) { count++; left++; right--; while (left < right && nums[left] == nums[left-1]) left++; while (left < right && nums[right] == nums[right+1]) right--; } else if (sum < 0) left++; else right--; } } return count; }\nint main() { vector<int> n; int v; while (cin >> v) { n.push_back(v); if (cin.peek() == '\\n') break; } cout << threeSumCount(n) << endl; return 0; }`,
      python: `import sys\ndef three_sum_count(nums: list[int]) -> int:\n    nums.sort(); count = 0\n    for i in range(len(nums)):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            s = nums[i] + nums[left] + nums[right]\n            if s == 0:\n                count += 1; left += 1; right -= 1\n                while left < right and nums[left] == nums[left-1]: left += 1\n                while left < right and nums[right] == nums[right+1]: right -= 1\n            elif s < 0: left += 1\n            else: right -= 1\n    return count\nif __name__ == "__main__": line = sys.stdin.read().strip(); print(three_sum_count(list(map(int, line.split()))))`
    }
  },
  {
    problemId: 'prob-11',
    title: 'Coin Change Problem',
    slug: 'coin-change-problem',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    acceptanceRate: 42.1,
    likes: 18400,
    dislikes: 410,
    description: 'Given an array coins and amount, return fewest coins needed to make up amount, or -1.',
    inputFormat: 'First line coins. Second line amount.',
    outputFormat: 'Return minimum coins integer or -1.',
    constraints: ['1 <= coins.length <= 12'],
    sampleTestCases: [{ id: 'tc-1', input: '1 2 5\n11', expectedOutput: '3', isHidden: false }],
    hiddenTestCases: [{ id: 'htc-1', input: '2\n3', expectedOutput: '-1', isHidden: true }],
    solutionExplanation: `Unbounded Knapsack DP:\ndp[i] represents min coins for amount i.\nInitialize dp array of size amount + 1 with amount + 1.\ndp[0] = 0.\nFor i from 1 to amount:\n  For coin c in coins:\n    if i >= c: dp[i] = min(dp[i], dp[i - c] + 1)\nReturn dp[amount] > amount ? -1 : dp[amount].\nTime Complexity: O(N * Amount)\nSpace Complexity: O(Amount).`,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    starterTemplates: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint coinChange(vector<int>& coins, int amount) { vector<int> dp(amount + 1, amount + 1); dp[0] = 0; for (int i = 1; i <= amount; i++) { for (int c : coins) { if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1); } } return dp[amount] > amount ? -1 : dp[amount]; }\nint main() { vector<int> coins; int val; while (cin >> val) { coins.push_back(val); if (cin.peek() == '\\n') break; } int amount; cin >> amount; cout << coinChange(coins, amount) << endl; return 0; }`,
      python: `import sys\ndef coin_change(coins: list[int], amount: int) -> int:\n    dp = [amount + 1] * (amount + 1); dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i >= c: dp[i] = min(dp[i], dp[i - c] + 1)\n    return -1 if dp[amount] > amount else dp[amount]\nif __name__ == "__main__": lines = sys.stdin.read().splitlines(); print(coin_change(list(map(int, lines[0].split())), int(lines[1])))`
    }
  }
];

const CONTESTS_DATA = [
  {
    contestId: 'contest-live-1',
    title: 'Weekly Contest 402',
    slug: 'weekly-contest-402',
    description: 'Welcome to Weekly Contest 402! Compete with top algorithm developers worldwide. 4 algorithmic challenges in 90 minutes.',
    startTime: new Date(Date.now() - 25 * 60 * 1000),
    endTime: new Date(Date.now() + 65 * 60 * 1000),
    status: 'LIVE',
    durationMinutes: 90,
    registeredCount: 4120,
    rules: [
      'Penalty of 5 minutes for every wrong submission.',
      'Ranking is determined by total score, then total penalty time.',
      'Plagiarism checks will be conducted post-contest.'
    ],
    problems: [
      { id: 'cp-1', problemId: 'prob-1', letter: 'A', title: 'Longest Substring Without Repeating', points: 300, difficulty: 'Medium' },
      { id: 'cp-2', problemId: 'prob-2', letter: 'B', title: 'Container With Most Water', points: 500, difficulty: 'Medium' },
      { id: 'cp-3', problemId: 'prob-3', letter: 'C', title: 'Maximum Subarray Sum', points: 1000, difficulty: 'Medium' },
      { id: 'cp-4', problemId: 'prob-4', letter: 'D', title: 'Trapping Rain Water', points: 1500, difficulty: 'Hard' }
    ]
  },
  {
    contestId: 'contest-up-1',
    title: 'Biweekly Contest 128',
    slug: 'biweekly-contest-128',
    description: 'Official biweekly rated round with ₹1,50,000 Prize Pool. Test your algorithms, data structures, and speed for global rating points.',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + (2 * 24 * 60 + 90) * 60 * 1000),
    status: 'UPCOMING',
    durationMinutes: 90,
    registeredCount: 1890,
    rules: [
      'Standard ICPC penalty rules apply.',
      'All submissions are evaluated against hidden test suites.'
    ],
    problems: [
      { id: 'cp-10', problemId: 'prob-5', letter: 'A', title: 'Search in Rotated Sorted Array', points: 300, difficulty: 'Medium' }
    ]
  },
  {
    contestId: 'contest-up-2',
    title: 'Quantum Championship 2026',
    slug: 'quantum-championship-2026',
    description: 'High-stakes competitive round featuring ₹5,00,000 INR Prize Pool. Compete against top rated algorithm engineers.',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + (5 * 24 * 60 + 120) * 60 * 1000),
    status: 'UPCOMING',
    durationMinutes: 120,
    registeredCount: 6540,
    rules: [
      '₹5,00,000 INR Prize Pool distributed to top 10 finishers.',
      'Strict anti-cheat screening enforced.'
    ],
    problems: [
      { id: 'cp-20', problemId: 'prob-4', letter: 'A', title: 'Trapping Rain Water', points: 500, difficulty: 'Hard' }
    ]
  },
  {
    contestId: 'contest-live-2',
    title: 'Beginner Speed Sprint #15',
    slug: 'beginner-speed-sprint-15',
    description: 'A 60-minute fast-paced practice arena for beginner to intermediate coders looking to build speed.',
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    endTime: new Date(Date.now() + 50 * 60 * 1000),
    status: 'LIVE',
    durationMinutes: 60,
    registeredCount: 2310,
    rules: [
      'Beginner friendly problem set.',
      'Instant feedback with detailed testcase results.'
    ],
    problems: [
      { id: 'cp-30', problemId: 'prob-1', letter: 'A', title: 'Longest Substring Without Repeating', points: 200, difficulty: 'Medium' }
    ]
  }
];

async function runSeeder() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in backend/.env!');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB Atlas Cluster...`);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('🍃 Connected to MongoDB Atlas Successfully!');

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Contest.deleteMany({});
    await Submission.deleteMany({});

    console.log('Inserting Users...');
    await User.insertMany(USERS_DATA);

    console.log(`Inserting All ${PROBLEMS_DATA.length} Problems...`);
    await Problem.insertMany(PROBLEMS_DATA);

    console.log(`Inserting All ${CONTESTS_DATA.length} Contests...`);
    await Contest.insertMany(CONTESTS_DATA);

    console.log('🎉 MongoDB Atlas Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder Error:', err.message);
    process.exit(1);
  }
}

runSeeder();
