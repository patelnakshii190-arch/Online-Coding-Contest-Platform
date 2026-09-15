import { Problem } from '../types/problem';

export const mockProblems: Problem[] = [
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
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.`,
    inputFormat: 'Line 1: Array of integers `nums`.\nLine 2: Target integer `target`.',
    outputFormat: 'Array of two 0-indexed integers `[i, j]`.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    sampleTestCases: [
      {
        id: 'tc-1',
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isHidden: false
      },
      {
        id: 'tc-2',
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        isHidden: false
      },
      {
        id: 'tc-3',
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        isHidden: false
      }
    ],
    hiddenTestCases: [
      {
        id: 'tc-h1',
        input: 'nums = [1, 5, 8, 12, 20], target = 20',
        expectedOutput: '[2,3]',
        isHidden: true
      }
    ],
    starterTemplates: {
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (mp.find(complement) != mp.end()) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      go: `func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        if idx, ok := m[target-num]; ok {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}`,
      rust: `use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            let complement = target - num;
            if let Some(&prev_idx) = map.get(&complement) {
                return vec![prev_idx as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}`
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
    description: `Given a string \`s\` containing just the characters \`'(' \`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'Single string `s`.',
    outputFormat: 'Boolean `true` or `false`.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    sampleTestCases: [
      {
        id: 'tc-vp-1',
        input: 's = "()"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        id: 'tc-vp-2',
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        id: 'tc-vp-3',
        input: 's = "(]"',
        expectedOutput: 'false',
        isHidden: false
      }
    ],
    hiddenTestCases: [],
    starterTemplates: {
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for(char c : s) {
            if(c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if(st.empty()) return false;
                if(c == ')' && st.top() != '(') return false;
                if(c == '}' && st.top() != '{') return false;
                if(c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') stack.push(c);
            else {
                if (stack.isEmpty()) return false;
                if (c == ')' && stack.peek() != '(') return false;
                if (c == '}' && stack.peek() != '{') return false;
                if (c == ']' && stack.peek() != '[') return false;
                stack.pop();
            }
        }
        return stack.isEmpty();
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.pop() !== map[char]) return false;
        }
    }
    return stack.length === 0;
}`,
      go: `func isValid(s string) bool {
    // Write your code here
    return true
}`,
      rust: `impl Solution {
    pub fn is_valid(s: String) -> bool {
        // Write your code here
        true
    }
}`
    }
  },
  {
    id: 'prob-3',
    slug: 'longest-substring-without-repeating-characters',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: 34.5,
    likes: 38400,
    dislikes: 1720,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    inputFormat: 'Single string `s`.',
    outputFormat: 'Integer representing the maximum length.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    sampleTestCases: [
      {
        id: 'tc-ls-1',
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        isHidden: false
      },
      {
        id: 'tc-ls-2',
        input: 's = "bbbbb"',
        expectedOutput: '1',
        isHidden: false
      },
      {
        id: 'tc-ls-3',
        input: 's = "pwwkew"',
        expectedOutput: '3',
        isHidden: false
      }
    ],
    hiddenTestCases: [],
    starterTemplates: {
      cpp: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> mp;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            if (mp.count(s[right])) {
                left = max(left, mp[s[right]] + 1);
            }
            mp[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            if (map.containsKey(s.charAt(right))) {
                left = Math.max(left, map.get(s.charAt(right)) + 1);
            }
            map.put(s.charAt(right), right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = max_len = 0
        for right, char in enumerate(s):
            if char in char_map:
                left = max(left, char_map[char] + 1)
            char_map[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
    let map = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right])) {
            left = Math.max(left, map.get(s[right]) + 1);
        }
        map.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      go: `func lengthOfLongestSubstring(s string) int { return 3 }`,
      rust: `impl Solution { pub fn length_of_longest_substring(s: String) -> i32 { 3 } }`
    }
  },
  {
    id: 'prob-4',
    slug: 'median-of-two-sorted-arrays',
    title: '4. Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 38.1,
    likes: 27800,
    dislikes: 2950,
    timeLimitSec: 1.5,
    memoryLimitMB: 256,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be **O(log (m+n))**.`,
    inputFormat: 'nums1 array, nums2 array.',
    outputFormat: 'Floating point value of median.',
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ],
    sampleTestCases: [
      {
        id: 'tc-med-1',
        input: 'nums1 = [1,3], nums2 = [2]',
        expectedOutput: '2.00000',
        isHidden: false
      },
      {
        id: 'tc-med-2',
        input: 'nums1 = [1,2], nums2 = [3,4]',
        expectedOutput: '2.50000',
        isHidden: false
      }
    ],
    hiddenTestCases: [],
    starterTemplates: {
      cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Implement O(log(m+n)) Binary Search
        return 2.0;
    }
};`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        return 2.0;
    }
}`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        return 2.0`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
    return 2.0;
}`,
      go: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 { return 2.0 }`,
      rust: `impl Solution { pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 { 2.0 } }`
    }
  },
  {
    id: 'prob-5',
    slug: 'coin-change',
    title: '322. Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    acceptanceRate: 43.1,
    likes: 18900,
    dislikes: 420,
    timeLimitSec: 1.0,
    memoryLimitMB: 256,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    inputFormat: 'coins array, amount integer.',
    outputFormat: 'Minimum coins count integer.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    sampleTestCases: [
      {
        id: 'tc-cc-1',
        input: 'coins = [1,2,5], amount = 11',
        expectedOutput: '3',
        isHidden: false
      },
      {
        id: 'tc-cc-2',
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1',
        isHidden: false
      }
    ],
    hiddenTestCases: [],
    starterTemplates: {
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) dp[i] = min(dp[i], 1 + dp[i - c]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i - c >= 0) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i - c >= 0:
                    dp[i] = min(dp[i], 1 + dp[i - c])
        return dp[amount] if dp[amount] <= amount else -1`,
      javascript: `function coinChange(coins, amount) {
    let dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (let c of coins) {
            if (i - c >= 0) dp[i] = Math.min(dp[i], 1 + dp[i - c]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      go: `func coinChange(coins []int, amount int) int { return 3 }`,
      rust: `impl Solution { pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 { 3 } }`
    }
  }
];
