import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  X, 
  Zap, 
  ChevronRight, 
  Layers, 
  Network,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  FileCode,
  Loader2,
  Bot,
  Lightbulb
} from 'lucide-react';
import { executeCodeInBrowser } from '../../services/judgeSimulator';
import { Problem } from '../../types/problem';
import { Submission } from '../../types/submission';
import { AIHintPanel } from '../ai/AIHintPanel';

export interface SkillNode {
  id: string;
  title: string;
  category: string;
  level: number;
  description: string;
  instructions: string;
  problemSlug: string;
  sampleInput: string;
  sampleOutput: string;
  xpReward: number;
  status: 'completed' | 'unlocked' | 'locked';
  prerequisiteId?: string;
  starterTemplates: {
    cpp: string;
    python: string;
    javascript: string;
    java: string;
  };
}

const INITIAL_SKILL_TREE: SkillNode[] = [
  {
    id: 'array',
    title: 'Arrays & Hashing',
    category: 'Data Structures',
    level: 1,
    description: 'Master 1D/2D arrays, hash maps, prefix sums, and sliding window techniques.',
    instructions: 'Write code to solve the Two-Sum problem. Given an array nums and integer target, return indices [i, j] such that nums[i] + nums[j] == target.',
    problemSlug: 'two-sum',
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    xpReward: 100,
    status: 'unlocked',
    starterTemplates: {
      cpp: `// Level 1: Arrays & Hashing (C++)
// Task: Return vector of indices {i, j} where nums[i] + nums[j] == target.
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: Write your solution code here
    
    return {};
}`,
      python: `# Level 1: Arrays & Hashing (Python)
# Task: Return list of indices [i, j] where nums[i] + nums[j] == target.

def two_sum(nums, target):
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 1: Arrays & Hashing (JavaScript)
// Task: Return array of indices [i, j] where nums[i] + nums[j] == target.

function twoSum(nums, target) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 1: Arrays & Hashing (Java)
// Task: Return array of indices {i, j} where nums[i] + nums[j] == target.
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: Write your solution code here
        
        return new int[]{};
    }
}`
    }
  },
  {
    id: 'string',
    title: 'Strings & Two Pointers',
    category: 'Algorithms',
    level: 2,
    description: 'Learn palindrome checks, string matching, and two-pointer boundary convergence.',
    instructions: 'Write code to test if string s is a valid palindrome, ignoring non-alphanumeric characters and cases.',
    problemSlug: 'valid-palindrome',
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    xpReward: 150,
    status: 'locked',
    prerequisiteId: 'array',
    starterTemplates: {
      cpp: `// Level 2: Strings & Two Pointers (C++)
// Task: Return true if string s is a valid palindrome, false otherwise.
#include <string>
using namespace std;

bool isPalindrome(string s) {
    // TODO: Write your solution code here
    
    return false;
}`,
      python: `# Level 2: Strings & Two Pointers (Python)
# Task: Return True if string s is a valid palindrome, False otherwise.

def is_palindrome(s: str) -> bool:
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 2: Strings & Two Pointers (JavaScript)
// Task: Return true if string s is a valid palindrome, false otherwise.

function isPalindrome(s) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 2: Strings & Two Pointers (Java)
// Task: Return true if string s is a valid palindrome, false otherwise.
class Solution {
    public boolean isPalindrome(String s) {
        // TODO: Write your solution code here
        
        return false;
    }
}`
    }
  },
  {
    id: 'stack',
    title: 'Stacks & Queues',
    category: 'Data Structures',
    level: 3,
    description: 'LIFO/FIFO order, expression parsing, and monotonic stack evaluation.',
    instructions: 'Write code to validate bracket matching in string s containing (), {}, []. Return true if balanced.',
    problemSlug: 'valid-parentheses',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    xpReward: 200,
    status: 'locked',
    prerequisiteId: 'string',
    starterTemplates: {
      cpp: `// Level 3: Stacks & Queues (C++)
// Task: Return true if bracket string s is balanced e.g. "()[]{}", false otherwise.
#include <stack>
#include <string>
using namespace std;

bool isValidBrackets(string s) {
    // TODO: Write your solution code here
    
    return false;
}`,
      python: `# Level 3: Stacks & Queues (Python)
# Task: Return True if bracket string s is balanced e.g. "()[]{}", False otherwise.

def is_valid_brackets(s: str) -> bool:
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 3: Stacks & Queues (JavaScript)
// Task: Return true if bracket string s is balanced e.g. "()[]{}", false otherwise.

function isValidBrackets(s) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 3: Stacks & Queues (Java)
// Task: Return true if bracket string s is balanced e.g. "()[]{}", false otherwise.
import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // TODO: Write your solution code here
        
        return false;
    }
}`
    }
  },
  {
    id: 'tree',
    title: 'Binary Trees & BST',
    category: 'Trees & Recursion',
    level: 4,
    description: 'Tree traversals (Inorder/Preorder/Postorder), BST search, and depth calculations.',
    instructions: 'Write code to calculate the maximum depth / height of a binary tree given its root node.',
    problemSlug: 'binary-tree-depth',
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '3',
    xpReward: 250,
    status: 'locked',
    prerequisiteId: 'stack',
    starterTemplates: {
      cpp: `// Level 4: Binary Trees & BST (C++)
// Task: Return max depth (height) of binary tree root node.
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
};

int maxDepth(TreeNode* root) {
    // TODO: Write your solution code here
    
    return 0;
}`,
      python: `# Level 4: Binary Trees & BST (Python)
# Task: Return max depth (height) of binary tree root node.

def max_depth(root) -> int:
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 4: Binary Trees & BST (JavaScript)
// Task: Return max depth (height) of binary tree root node.

function maxDepth(root) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 4: Binary Trees & BST (Java)
// Task: Return max depth (height) of binary tree root node.
class TreeNode {
    int val;
    TreeNode left, right;
}

class Solution {
    public int maxDepth(TreeNode root) {
        // TODO: Write your solution code here
        
        return 0;
    }
}`
    }
  },
  {
    id: 'graph',
    title: 'Graphs & BFS / DFS',
    category: 'Graph Theory',
    level: 5,
    description: 'Adjacency lists, Breadth-First Search (BFS), Depth-First Search (DFS), and shortest path traversal.',
    instructions: 'Write code to perform Breadth-First Search (BFS) starting from node 0 and calculate path distance to target node 3.',
    problemSlug: 'graph-bfs',
    sampleInput: 'n = 4, edges = [[0,1],[0,2],[1,3]], start = 0, target = 3',
    sampleOutput: '2',
    xpReward: 300,
    status: 'locked',
    prerequisiteId: 'tree',
    starterTemplates: {
      cpp: `// Level 5: Graphs & BFS / DFS (C++)
// Task: Traverse graph using BFS starting from start to find shortest path distance.
#include <vector>
#include <queue>
using namespace std;

int bfs(int start, vector<vector<int>>& adj) {
    // TODO: Write your solution code here
    
    return 0;
}`,
      python: `# Level 5: Graphs & BFS / DFS (Python)
# Task: Traverse graph using BFS starting from start_node to find shortest path distance.
from collections import deque

def bfs(start_node, graph):
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 5: Graphs & BFS / DFS (JavaScript)
// Task: Traverse graph using BFS starting from startNode to find shortest path distance.

function bfs(startNode, graph) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 5: Graphs & BFS / DFS (Java)
// Task: Traverse graph using BFS starting from start to find shortest path distance.
import java.util.*;

class GraphBFS {
    public int bfs(int start, List<List<Integer>> adj) {
        // TODO: Write your solution code here
        
        return 0;
    }
}`
    }
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    category: 'Advanced Mastery',
    level: 6,
    description: 'Memoization, tabulation, subproblem optimization, and knapsack dynamic programming.',
    instructions: 'Write code to calculate distinct ways to climb n stairs taking 1 or 2 steps at a time.',
    problemSlug: 'climbing-stairs',
    sampleInput: 'n = 3',
    sampleOutput: '3',
    xpReward: 350,
    status: 'locked',
    prerequisiteId: 'graph',
    starterTemplates: {
      cpp: `// Level 6: Dynamic Programming (C++)
// Task: Return number of distinct ways to climb n stairs.

int climbStairs(int n) {
    // TODO: Write your solution code here
    
    return 0;
}`,
      python: `# Level 6: Dynamic Programming (Python)
# Task: Return number of distinct ways to climb n stairs.

def climb_stairs(n: int) -> int:
    # TODO: Write your solution code here
    pass`,
      javascript: `// Level 6: Dynamic Programming (JavaScript)
// Task: Return number of distinct ways to climb n stairs.

function climbStairs(n) {
  // TODO: Write your solution code here
  
}`,
      java: `// Level 6: Dynamic Programming (Java)
// Task: Return number of distinct ways to climb n stairs.

class Solution {
    public int climbStairs(int n) {
        // TODO: Write your solution code here
        
        return 0;
    }
}`
    }
  }
];

const LOCAL_STORAGE_KEY = 'quantumarena_skill_tree_v3';

export const SkillTree: React.FC = () => {
  const [nodes, setNodes] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load skill tree state', e);
    }
    return INITIAL_SKILL_TREE;
  });

  const [treeStyle, setTreeStyle] = useState<'quest' | 'binary' | 'network'>('quest');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [modalTab, setModalTab] = useState<'editor' | 'ai_hints'>('editor');
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'python' | 'javascript' | 'java'>('javascript');
  const [userCode, setUserCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testSubmission, setTestSubmission] = useState<Submission | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nodes));
    } catch (e) {
      console.error('Failed to save skill tree state', e);
    }
  }, [nodes]);

  // When selected node or language changes, load starter template stub
  useEffect(() => {
    if (selectedNode) {
      setUserCode(selectedNode.starterTemplates[selectedLang] || '');
      setTestSubmission(null);
      setEvalError(null);
      setModalTab('editor');
    }
  }, [selectedNode, selectedLang]);

  const handleScanAndValidate = async () => {
    if (!selectedNode) return;

    setIsEvaluating(true);
    setTestSubmission(null);
    setEvalError(null);

    try {
      // Construct problem object for the test case evaluator
      const mockProblem: Problem = {
        id: selectedNode.id,
        slug: selectedNode.problemSlug,
        title: selectedNode.title,
        difficulty: selectedNode.level <= 2 ? 'Easy' : selectedNode.level <= 4 ? 'Medium' : 'Hard',
        category: selectedNode.category,
        tags: [selectedNode.category],
        acceptanceRate: 85,
        likes: 120,
        dislikes: 2,
        timeLimitSec: 2.0,
        memoryLimitMB: 256,
        description: selectedNode.instructions,
        inputFormat: selectedNode.sampleInput,
        outputFormat: selectedNode.sampleOutput,
        constraints: ['1 <= input <= 1000'],
        sampleTestCases: [
          {
            id: `${selectedNode.id}-tc1`,
            input: selectedNode.sampleInput,
            expectedOutput: selectedNode.sampleOutput,
            isHidden: false
          }
        ],
        hiddenTestCases: [
          {
            id: `${selectedNode.id}-tc2`,
            input: selectedNode.sampleInput,
            expectedOutput: selectedNode.sampleOutput,
            isHidden: true
          }
        ],
        starterTemplates: selectedNode.starterTemplates
      };

      const result = await executeCodeInBrowser({
        code: userCode,
        language: selectedLang,
        problem: mockProblem,
        isRunOnly: false
      });

      setTestSubmission(result);

      if (result.verdict === 'ACCEPTED') {
        // Code is correct! Mark current node completed and unlock next level!
        setNodes((prevNodes) => {
          const updated = prevNodes.map((n) => {
            if (n.id === selectedNode.id) {
              return { ...n, status: 'completed' as const };
            }
            return n;
          });

          return updated.map((n) => {
            if (n.prerequisiteId === selectedNode.id && n.status === 'locked') {
              return { ...n, status: 'unlocked' as const };
            }
            return n;
          });
        });
      }
    } catch (err: any) {
      setEvalError(err.message || 'Execution error during scanning');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all Skill Tree progress back to Level 1?')) {
      setNodes(INITIAL_SKILL_TREE);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSelectedNode(null);
    }
  };

  const completedCount = nodes.filter((n) => n.status === 'completed').length;
  const totalXp = nodes.filter((n) => n.status === 'completed').reduce((acc, n) => acc + n.xpReward, 0);

  // Helper problem object for AI Hint Panel
  const currentMockProblem: Problem | null = selectedNode ? {
    id: selectedNode.id,
    slug: selectedNode.problemSlug,
    title: selectedNode.title,
    difficulty: selectedNode.level <= 2 ? 'Easy' : selectedNode.level <= 4 ? 'Medium' : 'Hard',
    category: selectedNode.category,
    tags: [selectedNode.category],
    acceptanceRate: 85,
    likes: 120,
    dislikes: 2,
    timeLimitSec: 2.0,
    memoryLimitMB: 256,
    description: selectedNode.instructions,
    inputFormat: selectedNode.sampleInput,
    outputFormat: selectedNode.sampleOutput,
    constraints: ['1 <= input <= 1000'],
    sampleTestCases: [{ id: '1', input: selectedNode.sampleInput, expectedOutput: selectedNode.sampleOutput, isHidden: false }],
    hiddenTestCases: [],
    starterTemplates: selectedNode.starterTemplates
  } : null;

  return (
    <div className="bg-white border border-amber-200/80 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold font-mono border border-sky-200 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-sky-600" />
              ALGORITHM SKILL TREE ROADMAP
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200">
              +{totalXp} XP MASTERY
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Interactive Skill Tree: Write Code & Unlock Levels
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an unlocked topic level, write solution code in the template box, scan for correctness, and unlock the next level!
          </p>
        </div>

        {/* Tree Layout Style Selector & Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetProgress}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs flex items-center gap-1 border border-slate-200 font-mono"
            title="Reset Tree Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="flex items-center space-x-1.5 p-1.5 bg-amber-50/60 border border-amber-200 rounded-2xl">
            <button
              onClick={() => setTreeStyle('quest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                treeStyle === 'quest' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quest Tree</span>
            </button>

            <button
              onClick={() => setTreeStyle('binary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                treeStyle === 'binary' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Binary Map</span>
            </button>

            <button
              onClick={() => setTreeStyle('network')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                treeStyle === 'network' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph Network</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Ticker */}
      <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-800">Tree Progress: {completedCount} / {nodes.length} Mastery Levels Solved</span>
        </div>
        <div className="w-48 bg-white h-2.5 rounded-full overflow-hidden border border-amber-200">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / nodes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* TREE LAYOUT 1: QUEST SKILL TREE */}
      {treeStyle === 'quest' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
          {nodes.map((node) => {
            const isCompleted = node.status === 'completed';
            const isUnlocked = node.status === 'unlocked';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => !isLocked && setSelectedNode(node)}
                className={`relative p-6 rounded-3xl border transition-all cursor-pointer space-y-4 group ${
                  isCompleted
                    ? 'bg-emerald-50/30 border-emerald-300 hover:border-emerald-500 shadow-xs'
                    : isUnlocked
                    ? 'bg-white border-sky-300 hover:border-sky-500 shadow-md ring-2 ring-sky-400/20'
                    : 'bg-slate-50/60 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    isUnlocked ? 'bg-sky-100 text-sky-800 border-sky-300' :
                    'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    LEVEL {node.level} • {node.category}
                  </span>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCompleted ? 'bg-emerald-500 text-white' :
                    isUnlocked ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' :
                    'bg-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-sky-600 transition-colors" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs font-mono">
                  <span className="text-amber-600 font-bold">+{node.xpReward} XP</span>
                  {!isLocked ? (
                    <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isCompleted ? 'Edit Code' : 'Write Code & Scan'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold">Requires Lv.{node.level - 1}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TREE LAYOUT 2: HIERARCHICAL BINARY TREE MAP */}
      {treeStyle === 'binary' && (
        <div className="p-8 bg-amber-50/30 border border-amber-200 rounded-3xl space-y-8 text-center overflow-x-auto">
          <div className="text-xs text-slate-500 font-mono">Hierarchy Root: Level 1 Array Node ➔ Leaf Nodes</div>

          {/* Level 1 Root */}
          <div className="flex justify-center">
            {nodes.slice(0, 1).map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="p-5 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/25 flex items-center space-x-3 hover:bg-sky-600 transition-all font-serif"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                <Code2 className="w-5 h-5" />
                <span>ROOT: {node.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              </button>
            ))}
          </div>

          <div className="w-0.5 h-6 bg-sky-300 mx-auto" />

          {/* Level 2 & 3 Branch */}
          <div className="flex justify-center gap-12">
            {nodes.slice(1, 3).map((node) => (
              <button
                key={node.id}
                disabled={node.status === 'locked'}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-2xl font-bold text-xs border flex items-center space-x-2 transition-all font-serif ${
                  node.status === 'completed' ? 'bg-emerald-600 text-white border-emerald-500' :
                  node.status === 'unlocked' ? 'bg-white text-slate-900 border-sky-400 shadow-md' :
                  'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                }`}
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                {node.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{node.title}</span>
              </button>
            ))}
          </div>

          <div className="w-0.5 h-6 bg-sky-300 mx-auto" />

          {/* Level 4, 5 & 6 Leaves */}
          <div className="flex justify-center gap-6 flex-wrap">
            {nodes.slice(3).map((node) => (
              <button
                key={node.id}
                disabled={node.status === 'locked'}
                onClick={() => setSelectedNode(node)}
                className={`p-3.5 rounded-2xl font-bold text-xs border flex items-center space-x-2 transition-all font-serif ${
                  node.status === 'completed' ? 'bg-emerald-600 text-white border-emerald-500' :
                  node.status === 'unlocked' ? 'bg-white text-slate-900 border-sky-400 shadow-md' :
                  'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                }`}
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                {node.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{node.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TREE LAYOUT 3: GRAPH NETWORK RADAR VIEW */}
      {treeStyle === 'network' && (
        <div className="p-8 bg-slate-900 text-white border border-purple-900 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h4 className="text-base font-bold font-serif text-purple-300 flex items-center gap-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Network className="w-5 h-5 text-purple-400" />
              Graph Algorithm Dependency Network
            </h4>
            <span className="text-xs font-mono text-slate-400">Interactive Topic Clusters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => node.status !== 'locked' && setSelectedNode(node)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  node.status === 'completed' ? 'bg-purple-950/80 border-purple-500 text-purple-200' :
                  node.status === 'unlocked' ? 'bg-slate-800 border-sky-500 text-white shadow-lg shadow-sky-500/20' :
                  'bg-slate-950 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Node #{node.level}</span>
                  {node.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                </div>
                <h5 className="font-bold text-sm font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{node.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-1">{node.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CODE EDITOR & AI HINT MODAL */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 border border-sky-600/60 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-4 font-mono max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                      Level {selectedNode.level}: {selectedNode.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      selectedNode.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {selectedNode.status === 'completed' ? 'SOLVED' : 'IN PROGRESS'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedNode.category} • Reward: <strong className="text-amber-400">+{selectedNode.xpReward} XP</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs: Editor vs AI Hints */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 font-sans">
              <button
                onClick={() => setModalTab('editor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'editor' ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Code Editor & Scanner</span>
              </button>

              <button
                onClick={() => setModalTab('ai_hints')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  modalTab === 'ai_hints' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-200" />
                <span>AI Hint Agent</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px]">Tutor</span>
              </button>
            </div>

            {/* TAB 1: CODE EDITOR & SCANNER */}
            {modalTab === 'editor' && (
              <div className="space-y-4">
                {/* Problem Instructions Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-sans">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    Topic Challenge Instructions
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNode.instructions}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div><span className="text-slate-500 font-bold">Sample Input:</span> <code className="text-emerald-300">{selectedNode.sampleInput}</code></div>
                    <div><span className="text-slate-500 font-bold">Expected Output:</span> <code className="text-amber-300">{selectedNode.sampleOutput}</code></div>
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-sans">
                  <div className="flex items-center space-x-2">
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

                  <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" /> Complete template stub below!
                  </span>
                </div>

                {/* Interactive Code Editor Box (Starter Skeleton Stubs) */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 focus-within:border-sky-500 transition-colors">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    spellCheck={false}
                    rows={12}
                    placeholder="// Write your code solution here..."
                    className="w-full bg-slate-950 text-emerald-300 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                {/* Evaluation Status Display */}
                {isEvaluating && (
                  <div className="p-4 bg-sky-950/40 border border-sky-800 rounded-2xl flex items-center space-x-3 text-sky-300 text-xs font-mono animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scanning user code against test cases & verifying solution logic...</span>
                  </div>
                )}

                {evalError && (
                  <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-rose-300 text-xs font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Execution Error</span>
                    </div>
                    <p className="text-slate-300">{evalError}</p>
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
                            SOLUTION RIGHT (ACCEPTED)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full font-bold text-[11px] flex items-center gap-1">
                            <X className="w-3.5 h-3.5" />
                            {testSubmission.verdict}
                          </span>
                        )}
                        <span>Test Cases Passed: {testSubmission.passedTestCases} / {testSubmission.totalTestCases}</span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        Runtime: {testSubmission.runtimeMs} ms
                      </span>
                    </div>

                    {testSubmission.verdict === 'ACCEPTED' ? (
                      <p className="text-emerald-300 font-sans font-medium text-xs pt-1">
                        🎉 Solution is RIGHT! Level {selectedNode.level} Solved! <strong>Level {selectedNode.level + 1} is now UNLOCKED!</strong>
                      </p>
                    ) : (
                      <div className="space-y-1 text-slate-300 font-sans text-xs pt-1">
                        <p className="text-rose-300 font-semibold flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-rose-400" />
                          <span>Solution Incorrect. Level {selectedNode.level + 1} remains LOCKED!</span>
                        </p>
                        {testSubmission.testCaseResults && testSubmission.testCaseResults[0] && (
                          <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] space-y-1 border border-slate-800 mt-2">
                            <div><span className="text-slate-500">Your Output:</span> <span className="text-rose-400">{testSubmission.testCaseResults[0].actualOutput || 'None / Syntax Error'}</span></div>
                            <div><span className="text-slate-500">Expected Output:</span> <span className="text-emerald-400">{testSubmission.testCaseResults[0].expectedOutput}</span></div>
                          </div>
                        )}
                        <p className="text-slate-400 text-[11px] mt-1">
                          Tip: Use the <strong>AI Hint Agent</strong> tab above if you need help fixing your logic!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI HINT AGENT */}
            {modalTab === 'ai_hints' && currentMockProblem && (
              <div className="pt-2 font-sans">
                <AIHintPanel
                  problem={currentMockProblem}
                  code={userCode}
                  language={selectedLang}
                />
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 font-sans">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Close Window
              </button>

              {modalTab === 'editor' && (
                <button
                  onClick={handleScanAndValidate}
                  disabled={isEvaluating}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-2 font-mono"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning Code...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Scan Code & Validate Solution</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
