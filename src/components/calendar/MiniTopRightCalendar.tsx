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
  Flame, 
  Loader2,
  Square
} from 'lucide-react';
import { executeCodeInBrowser } from '../../services/judgeSimulator';
import { Problem } from '../../types/problem';
import { Submission } from '../../types/submission';

export interface MiniChallengeDay {
  dayNumber: number;
  dateStr: string;
  hasCodeChallenge: boolean; // True for 14 active days
  title: string;
  category: string;
  instructions: string;
  sampleInput: string;
  sampleOutput: string;
  starterTemplates: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
}

export interface MiniSolveRecord {
  dateStr: string;
  solved: boolean;
  solvedAt: string;
}

// 14 Active Challenge Days list out of 30 days
const ACTIVE_14_DAYS = [1, 3, 5, 7, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28];

const MINI_PROBLEMS: Record<number, { title: string; category: string; instructions: string; input: string; output: string }> = {
  1: { title: 'Two Sum Array', category: 'Arrays', instructions: 'Find indices of two numbers adding up to target.', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
  3: { title: 'Valid Palindrome', category: 'Strings', instructions: 'Return true if s is a valid palindrome string.', input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
  5: { title: 'Valid Parentheses', category: 'Stacks', instructions: 'Check if bracket string ()[]{} is balanced.', input: 's = "()[]{}"', output: 'true' },
  7: { title: 'Tree Max Depth', category: 'Trees', instructions: 'Return maximum depth of binary tree.', input: 'root = [3,9,20,null,null,15,7]', output: '3' },
  8: { title: 'Graph BFS Path', category: 'Graphs', instructions: 'Find shortest distance from node 0 to target node 3.', input: 'n = 4, edges = [[0,1],[0,2],[1,3]], start = 0, target = 3', output: '2' },
  10: { title: 'Climbing Stairs', category: 'DP', instructions: 'Count distinct ways to climb n stairs.', input: 'n = 3', output: '3' },
  12: { title: 'Reverse List', category: 'Linked List', instructions: 'Reverse singly linked list array.', input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
  14: { title: 'Buy Sell Stock', category: 'Arrays', instructions: 'Calculate max profit from stock prices.', input: 'prices = [7,1,5,3,6,4]', output: '5' },
  16: { title: 'Longest Substring', category: 'Sliding Window', instructions: 'Find length of longest substring without repeating characters.', input: 's = "abcabcbb"', output: '3' },
  18: { title: 'Container Most Water', category: 'Two Pointers', instructions: 'Find container holding max water.', input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
  20: { title: 'Subarray Sum', category: 'Prefix Sum', instructions: 'Find total continuous subarrays summing to k.', input: 'nums = [1,1,1], k = 2', output: '2' },
  22: { title: 'Find Duplicate', category: 'Arrays', instructions: 'Find duplicate number in array.', input: 'nums = [1,3,4,2,2]', output: '2' },
  25: { title: 'Binary Search', category: 'Algorithms', instructions: 'Search target in sorted array.', input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
  28: { title: 'Fibonacci DP', category: 'DP', instructions: 'Return nth Fibonacci number.', input: 'n = 4', output: '3' }
};

const LOCAL_MINI_CALENDAR_KEY = 'quantumarena_mini_calendar_v1';

export const MiniTopRightCalendar: React.FC = () => {
  const [solveRecords, setSolveRecords] = useState<Record<string, MiniSolveRecord>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_MINI_CALENDAR_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      '2026-09-01': { dateStr: '2026-09-01', solved: true, solvedAt: '10:15 AM' }
    };
  });

  const [selectedDay, setSelectedDay] = useState<MiniChallengeDay | null>(null);
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [userCode, setUserCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testSubmission, setTestSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_MINI_CALENDAR_KEY, JSON.stringify(solveRecords));
    } catch {}
  }, [solveRecords]);

  // Generate 14 Active Date Tiles
  const daysList: MiniChallengeDay[] = ACTIVE_14_DAYS.map((dayNum) => {
    const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
    const prob = MINI_PROBLEMS[dayNum] || MINI_PROBLEMS[1];

    return {
      dayNumber: dayNum,
      dateStr,
      hasCodeChallenge: true,
      title: prob.title,
      category: prob.category,
      instructions: prob.instructions,
      sampleInput: prob.input,
      sampleOutput: prob.output,
      starterTemplates: {
        javascript: `function solve(input) {\n  // Code for Day ${dayNum} (${prob.title})\n  \n}`,
        python: `def solve(input):\n    # Code for Day ${dayNum}\n    pass`,
        cpp: `#include <iostream>\nint main() { return 0; }`,
        java: `class Solution { public Object solve(Object in) { return in; } }`
      }
    };
  });

  const handleOpenDay = (day: MiniChallengeDay) => {
    setSelectedDay(day);
    setUserCode(day.starterTemplates[selectedLang]);
    setTestSubmission(null);
  };

  const handleScanAndValidate = async () => {
    if (!selectedDay) return;

    setIsEvaluating(true);
    setTestSubmission(null);

    try {
      const mockProblem: Problem = {
        id: selectedDay.dateStr,
        slug: selectedDay.dayNumber === 1 ? 'two-sum' : selectedDay.dayNumber === 3 ? 'valid-palindrome' : selectedDay.dayNumber === 5 ? 'valid-parentheses' : 'two-sum',
        title: selectedDay.title,
        difficulty: 'Easy',
        category: selectedDay.category,
        tags: [selectedDay.category],
        acceptanceRate: 95,
        likes: 200,
        dislikes: 0,
        timeLimitSec: 2.0,
        memoryLimitMB: 256,
        description: selectedDay.instructions,
        inputFormat: selectedDay.sampleInput,
        outputFormat: selectedDay.sampleOutput,
        constraints: ['1 <= input <= 1000'],
        sampleTestCases: [{ id: 'tc1', input: selectedDay.sampleInput, expectedOutput: selectedDay.sampleOutput, isHidden: false }],
        hiddenTestCases: [],
        starterTemplates: selectedDay.starterTemplates
      };

      const result = await executeCodeInBrowser({
        code: userCode,
        language: selectedLang,
        problem: mockProblem,
        isRunOnly: false
      });

      setTestSubmission(result);

      if (result.verdict === 'ACCEPTED') {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSolveRecords((prev) => ({
          ...prev,
          [selectedDay.dateStr]: {
            dateStr: selectedDay.dateStr,
            solved: true,
            solvedAt: timeStr
          }
        }));
      }
    } catch {
    } finally {
      setIsEvaluating(false);
    }
  };

  const solvedCount = Object.values(solveRecords).filter((r) => r.solved).length;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-amber-200 rounded-2xl p-3.5 shadow-sm font-sans space-y-2 max-w-xs">
      
      {/* Top Right Mini Calendar Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-2 text-xs font-mono">
        <div className="flex items-center space-x-1.5 font-bold text-slate-800">
          <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
          <span>CODE DATES</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
          {solvedCount}/14 SOLVED
        </span>
      </div>

      {/* 14 Small Square Date Tiles Grid */}
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {daysList.map((day) => {
          const isSolved = solveRecords[day.dateStr]?.solved;

          return (
            <div
              key={day.dateStr}
              onClick={() => handleOpenDay(day)}
              title={`Sept ${day.dayNumber}: ${day.title} (${isSolved ? 'Solved at ' + solveRecords[day.dateStr].solvedAt : 'Click to Solve Code'})`}
              className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center text-[11px] font-mono font-bold cursor-pointer transition-all relative ${
                isSolved
                  ? 'bg-emerald-500 text-white shadow-xs border-2 border-emerald-600 hover:scale-105'
                  : 'bg-sky-50 text-sky-900 border-2 border-sky-400 hover:bg-sky-100 hover:border-sky-500 shadow-2xs hover:scale-105'
              }`}
            >
              <span>{day.dayNumber}</span>
              {isSolved ? (
                <span className="text-[8px] leading-none text-emerald-100">✓</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-400 font-mono text-center pt-0.5">
        Highlighted squares contain code to solve!
      </p>

      {/* Quick Solve Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 border border-sky-600 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-3 font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
                  {selectedDay.dayNumber}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{selectedDay.title}</h4>
                  <p className="text-[10px] text-slate-400">Sept {selectedDay.dayNumber}, 2026 • {selectedDay.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              {selectedDay.instructions}
            </p>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck={false}
              rows={8}
              className="w-full bg-slate-950 text-emerald-300 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed focus:outline-none"
            />

            {testSubmission && (
              <div className={`p-2.5 rounded-xl border text-[11px] font-mono ${
                testSubmission.verdict === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}>
                {testSubmission.verdict === 'ACCEPTED' ? '🎉 RIGHT! Code Solved! Square marked green ✓' : '❌ Wrong Answer. Fix code & re-test.'}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 font-sans">
              <button onClick={() => setSelectedDay(null)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-[11px]">
                Close
              </button>
              <button
                onClick={handleScanAndValidate}
                disabled={isEvaluating}
                className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1.5"
              >
                {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>Scan & Solve Code</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
