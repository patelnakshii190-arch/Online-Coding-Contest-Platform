import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Sparkles, 
  X, 
  Play, 
  AlertTriangle, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  FileCode,
  Loader2,
  Lock
} from 'lucide-react';
import { executeCodeInBrowser } from '../../services/judgeSimulator';
import { Problem } from '../../types/problem';
import { Submission } from '../../types/submission';

export interface DailyChallenge {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string;
  problemSlug: string;
  sampleInput: string;
  sampleOutput: string;
  starterTemplates: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
}

export interface SolveRecord {
  dateStr: string;
  solved: boolean;
  solvedAt: string; // Formatted timestamp like "05:11 PM"
  language: string;
  code: string;
}

const DAILY_PROBLEMS_MAP: Record<number, Omit<DailyChallenge, 'dateStr' | 'dayNumber'>> = {
  1: {
    title: 'Two Sum HashMap',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    instructions: 'Find indices of two numbers in array nums that sum up to target.',
    problemSlug: 'two-sum',
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    starterTemplates: {
      javascript: 'function twoSum(nums, target) {\n  // Write code for Sept 1 challenge\n  \n}',
      python: 'def two_sum(nums, target):\n    # Write code for Sept 1 challenge\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}'
    }
  },
  2: {
    title: 'Valid Palindrome Two Pointers',
    category: 'Strings',
    difficulty: 'Easy',
    instructions: 'Test if string s is a valid palindrome ignoring non-alphanumeric characters.',
    problemSlug: 'valid-palindrome',
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    starterTemplates: {
      javascript: 'function isPalindrome(s) {\n  // Write code for Sept 2 challenge\n  \n}',
      python: 'def is_palindrome(s: str) -> bool:\n    pass',
      cpp: '#include <string>\nusing namespace std;\nbool isPalindrome(string s) {\n    return false;\n}',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}'
    }
  },
  3: {
    title: 'Valid Parentheses Stack',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    instructions: 'Verify if bracket string s with (), {}, [] is balanced.',
    problemSlug: 'valid-parentheses',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    starterTemplates: {
      javascript: 'function isValidBrackets(s) {\n  // Write code for Sept 3 challenge\n  \n}',
      python: 'def is_valid_brackets(s: str) -> bool:\n    pass',
      cpp: '#include <stack>\n#include <string>\nusing namespace std;\nbool isValidBrackets(string s) {\n    return false;\n}',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}'
    }
  },
  4: {
    title: 'Maximum Depth of Binary Tree',
    category: 'Trees & Recursion',
    difficulty: 'Easy',
    instructions: 'Calculate maximum height/depth of a binary tree given root.',
    problemSlug: 'binary-tree-depth',
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '3',
    starterTemplates: {
      javascript: 'function maxDepth(root) {\n  // Write code for Sept 4 challenge\n  \n}',
      python: 'def max_depth(root) -> int:\n    pass',
      cpp: '#include <algorithm>\nusing namespace std;\nint maxDepth(void* root) {\n    return 0;\n}',
      java: 'class Solution {\n    public int maxDepth(Object root) {\n        return 0;\n    }\n}'
    }
  },
  5: {
    title: 'Graph BFS Shortest Path',
    category: 'Graph Theory',
    difficulty: 'Medium',
    instructions: 'Traverse adjacency graph starting from node 0 using BFS to target node 3.',
    problemSlug: 'graph-bfs',
    sampleInput: 'n = 4, edges = [[0,1],[0,2],[1,3]], start = 0, target = 3',
    sampleOutput: '2',
    starterTemplates: {
      javascript: 'function bfs(startNode, graph) {\n  // Write code for Sept 5 challenge\n  \n}',
      python: 'def bfs(start_node, graph):\n    pass',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\nint bfs(int start, vector<vector<int>>& adj) {\n    return 0;\n}',
      java: 'class Solution {\n    public int bfs(int start, Object adj) {\n        return 0;\n    }\n}'
    }
  },
  6: {
    title: 'Climbing Stairs Dynamic Programming',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    instructions: 'Calculate distinct ways to climb n stairs taking 1 or 2 steps.',
    problemSlug: 'climbing-stairs',
    sampleInput: 'n = 3',
    sampleOutput: '3',
    starterTemplates: {
      javascript: 'function climbStairs(n) {\n  // Write code for Sept 6 challenge\n  \n}',
      python: 'def climb_stairs(n: int) -> int:\n    pass',
      cpp: 'int climbStairs(int n) {\n    return 0;\n}',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}'
    }
  },
  7: {
    title: 'Reverse Linked List',
    category: 'Linked Lists',
    difficulty: 'Easy',
    instructions: 'Reverse a singly linked list and return new head.',
    problemSlug: 'reverse-linked-list',
    sampleInput: 'head = [1,2,3,4,5]',
    sampleOutput: '[5,4,3,2,1]',
    starterTemplates: {
      javascript: 'function reverseList(head) {\n  // Write code for Sept 7 challenge\n  \n}',
      python: 'def reverse_list(head):\n    pass',
      cpp: 'void* reverseList(void* head) {\n    return head;\n}',
      java: 'class Solution {\n    public Object reverseList(Object head) {\n        return head;\n    }\n}'
    }
  },
  8: {
    title: 'Best Time to Buy & Sell Stock',
    category: 'Arrays & Sliding Window',
    difficulty: 'Easy',
    instructions: 'Calculate max profit from buying on day i and selling on day j.',
    problemSlug: 'two-sum',
    sampleInput: 'prices = [7,1,5,3,6,4]',
    sampleOutput: '5',
    starterTemplates: {
      javascript: 'function maxProfit(prices) {\n  // Write code for Sept 8 challenge\n  \n}',
      python: 'def max_profit(prices):\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nint maxProfit(vector<int>& prices) {\n    return 0;\n}',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}'
    }
  },
  9: {
    title: 'Longest Substring Without Repeats',
    category: 'Sliding Window',
    difficulty: 'Medium',
    instructions: 'Find length of longest substring without repeating characters.',
    problemSlug: 'valid-palindrome',
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    starterTemplates: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write code for Sept 9 challenge\n  \n}',
      python: 'def length_of_longest_substring(s: str) -> int:\n    pass',
      cpp: '#include <string>\nusing namespace std;\nint lengthOfLongestSubstring(string s) {\n    return 0;\n}',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}'
    }
  },
  10: {
    title: 'Container With Most Water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    instructions: 'Find two lines that together with x-axis forms container holding max water.',
    problemSlug: 'two-sum',
    sampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
    sampleOutput: '49',
    starterTemplates: {
      javascript: 'function maxArea(height) {\n  // Write code for Sept 10 challenge\n  \n}',
      python: 'def max_area(height):\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nint maxArea(vector<int>& height) {\n    return 0;\n}',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}'
    }
  }
};

const LOCAL_CALENDAR_KEY = 'quantumarena_daily_calendar_v1';

export const DailyCodingCalendar: React.FC = () => {
  const [currentYear] = useState(2026);
  const [currentMonth] = useState(8); // September (0-indexed: 8 = Sept)
  const [todayDay] = useState(10); // Sept 10

  const [solveRecords, setSolveRecords] = useState<Record<string, SolveRecord>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CALENDAR_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial solved record for September 10 if missing
    return {
      '2026-09-01': {
        dateStr: '2026-09-01',
        solved: true,
        solvedAt: '10:15 AM',
        language: 'javascript',
        code: 'function twoSum(nums, target) { return [0, 1]; }'
      }
    };
  });

  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge | null>(null);
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [userCode, setUserCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testSubmission, setTestSubmission] = useState<Submission | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CALENDAR_KEY, JSON.stringify(solveRecords));
    } catch {}
  }, [solveRecords]);

  // When selected challenge opens, load code
  useEffect(() => {
    if (selectedChallenge) {
      const existing = solveRecords[selectedChallenge.dateStr];
      if (existing && existing.code) {
        setUserCode(existing.code);
      } else {
        setUserCode(selectedChallenge.starterTemplates[selectedLang] || '');
      }
      setTestSubmission(null);
      setEvalError(null);
    }
  }, [selectedChallenge, selectedLang]);

  // Generate September 2026 Calendar days (30 days in September)
  const daysInMonth = 30;
  const calendarDays: DailyChallenge[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
    const mappedProb = DAILY_PROBLEMS_MAP[dayNum] || DAILY_PROBLEMS_MAP[(dayNum % 10) + 1] || DAILY_PROBLEMS_MAP[1];

    return {
      dateStr,
      dayNumber: dayNum,
      title: mappedProb.title,
      category: mappedProb.category,
      difficulty: mappedProb.difficulty,
      instructions: mappedProb.instructions,
      problemSlug: mappedProb.problemSlug,
      sampleInput: mappedProb.sampleInput,
      sampleOutput: mappedProb.sampleOutput,
      starterTemplates: mappedProb.starterTemplates
    };
  });

  const handleScanAndValidateDate = async () => {
    if (!selectedChallenge) return;

    setIsEvaluating(true);
    setTestSubmission(null);
    setEvalError(null);

    try {
      const mockProblem: Problem = {
        id: selectedChallenge.dateStr,
        slug: selectedChallenge.problemSlug,
        title: selectedChallenge.title,
        difficulty: selectedChallenge.difficulty,
        category: selectedChallenge.category,
        tags: [selectedChallenge.category],
        acceptanceRate: 90,
        likes: 150,
        dislikes: 1,
        timeLimitSec: 2.0,
        memoryLimitMB: 256,
        description: selectedChallenge.instructions,
        inputFormat: selectedChallenge.sampleInput,
        outputFormat: selectedChallenge.sampleOutput,
        constraints: ['1 <= input <= 1000'],
        sampleTestCases: [{ id: 'tc1', input: selectedChallenge.sampleInput, expectedOutput: selectedChallenge.sampleOutput, isHidden: false }],
        hiddenTestCases: [],
        starterTemplates: selectedChallenge.starterTemplates
      };

      const result = await executeCodeInBrowser({
        code: userCode,
        language: selectedLang,
        problem: mockProblem,
        isRunOnly: false
      });

      setTestSubmission(result);

      if (result.verdict === 'ACCEPTED') {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setSolveRecords((prev) => ({
          ...prev,
          [selectedChallenge.dateStr]: {
            dateStr: selectedChallenge.dateStr,
            solved: true,
            solvedAt: timeStr,
            language: selectedLang,
            code: userCode
          }
        }));
      }
    } catch (err: any) {
      setEvalError(err.message || 'Execution error during scanning');
    } finally {
      setIsEvaluating(false);
    }
  };

  const monthName = 'September 2026';
  const solvedCount = Object.values(solveRecords).filter((r) => r.solved).length;

  return (
    <div className="bg-white border border-amber-200/80 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold font-mono border border-sky-200 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
              DAILY DATE-WISE CODING CALENDAR
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200">
              {solvedCount} / {daysInMonth} DAYS SOLVED CODE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Date-Wise Daily Problem Calendar & Code Verifier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any date on the calendar to solve that day's assigned coding challenge. Solved dates display <strong className="text-emerald-600 font-bold">[SOLVED CODE]</strong> and your solve time!
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-amber-50/60 p-2 rounded-2xl border border-amber-200 text-xs font-mono font-bold">
          <span className="text-slate-800 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span>{monthName}</span>
          </span>
        </div>
      </div>

      {/* Weekday Table Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-500 border-b border-amber-100 pb-2">
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>

      {/* Calendar 30-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {calendarDays.map((day) => {
          const record = solveRecords[day.dateStr];
          const isSolved = record && record.solved;
          const isToday = day.dayNumber === todayDay;

          return (
            <div
              key={day.dateStr}
              onClick={() => setSelectedChallenge(day)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative group flex flex-col justify-between min-h-[110px] ${
                isSolved
                  ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500 shadow-xs'
                  : isToday
                  ? 'bg-amber-50/70 border-amber-400 hover:border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-sky-400 shadow-2xs'
              }`}
            >
              {/* Top Row: Date Number & Badge */}
              <div className="flex items-center justify-between">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                  isSolved ? 'bg-emerald-500 text-white' :
                  isToday ? 'bg-amber-500 text-white font-black shadow-sm' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {day.dayNumber}
                </span>

                {isSolved ? (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold font-mono border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>SOLVED CODE</span>
                  </span>
                ) : isToday ? (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold font-mono border border-amber-300 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>TODAY</span>
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-mono border border-slate-200">
                    UNSOLVED
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {day.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono line-clamp-1 mt-0.5">
                  {day.category}
                </p>
              </div>

              {/* Bottom Solve Time Stamp / Action Banner */}
              <div className="pt-1 border-t border-amber-100 text-[10px] font-mono flex items-center justify-between">
                {isSolved ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{record.solvedAt}</span>
                  </span>
                ) : (
                  <span className="text-sky-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Start Code</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DATE-WISE CODE SOLVER MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 border border-sky-600/60 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 font-mono max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      Sept {selectedChallenge.dayNumber}, 2026: {selectedChallenge.title}
                    </h3>
                    {solveRecords[selectedChallenge.dateStr]?.solved ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        SOLVED CODE ({solveRecords[selectedChallenge.dateStr].solvedAt})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                        UNSOLVED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedChallenge.category} • Difficulty: <strong className="text-amber-400">{selectedChallenge.difficulty}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problem Instructions */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-sans">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                Daily Challenge Instructions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedChallenge.instructions}
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <div><span className="text-slate-500 font-bold">Sample Input:</span> <code className="text-emerald-300">{selectedChallenge.sampleInput}</code></div>
                <div><span className="text-slate-500 font-bold">Expected Output:</span> <code className="text-amber-300">{selectedChallenge.sampleOutput}</code></div>
              </div>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 font-sans">
              <span className="text-xs text-slate-400 font-mono font-bold mr-1">Language:</span>
              {(['javascript', 'python', 'cpp', 'java'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all font-mono ${
                    selectedLang === lang ? 'bg-sky-500 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Code Editor Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 focus-within:border-sky-500 transition-colors">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                rows={11}
                className="w-full bg-slate-950 text-emerald-300 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>

            {/* Status Display */}
            {isEvaluating && (
              <div className="p-4 bg-sky-950/40 border border-sky-800 rounded-2xl flex items-center space-x-3 text-sky-300 text-xs font-mono animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning code for Sept {selectedChallenge.dayNumber} challenge...</span>
              </div>
            )}

            {testSubmission && !isEvaluating && (
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                testSubmission.verdict === 'ACCEPTED'
                  ? 'bg-emerald-950/50 border-emerald-600/80 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-700/80 text-rose-200'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center space-x-2">
                    {testSubmission.verdict === 'ACCEPTED' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full font-bold text-[11px] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        ACCEPTED (SOLVED CODE)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full font-bold text-[11px] flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        {testSubmission.verdict}
                      </span>
                    )}
                    <span>Passed: {testSubmission.passedTestCases} / {testSubmission.totalTestCases}</span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Runtime: {testSubmission.runtimeMs} ms
                  </span>
                </div>

                {testSubmission.verdict === 'ACCEPTED' ? (
                  <p className="text-emerald-300 font-sans font-medium text-xs pt-1">
                    🎉 Excellent! Code for Sept {selectedChallenge.dayNumber} is RIGHT! Marked as <strong>[SOLVED CODE]</strong> on your calendar!
                  </p>
                ) : (
                  <div className="space-y-1 text-slate-300 font-sans text-xs pt-1">
                    <p className="text-rose-300 font-semibold">
                      ❌ Code output mismatch. Fix code and re-test to record solve timestamp on calendar.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 font-sans">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Close Modal
              </button>

              <button
                onClick={handleScanAndValidateDate}
                disabled={isEvaluating}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-2 font-mono"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Scan Code & Validate Solution</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
