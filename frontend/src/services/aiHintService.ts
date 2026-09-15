import { Problem } from '../types/problem';
import { analyzeStudentCode } from './studentDiagnostics';

export interface AIHintRequest {
  tier: 1 | 2 | 3;
  problem: Problem;
  studentCode: string;
  language: string;
  customQuestion?: string;
  apiKey?: string;
}

export interface AIHintResponse {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
  pseudocode?: string;
  codeFixSuggestion?: string;
  highlightLines?: number[];
  keyTakeaway: string;
}

export async function generateAIHint({
  tier,
  problem,
  studentCode,
  language,
  customQuestion,
}: AIHintRequest): Promise<AIHintResponse> {
  // Simulate intelligent AI processing latency
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const diagnostics = analyzeStudentCode({ code: studentCode, language, problem });

  // Custom question handler
  if (customQuestion && customQuestion.trim()) {
    return {
      tier,
      title: `AI Tutor Answer: "${customQuestion.trim()}"`,
      content: `Great question! When solving **${problem.title}**, keep in mind:

1. **Core Concept**: ${problem.category} patterns apply directly here.
2. **Constraints**: ${problem.constraints.join(', ')}
3. **Tip for your code**: Check how values are looked up or updated in your current ${language} code. Make sure loop boundary conditions handle edge cases properly!`,
      keyTakeaway: 'Always verify time and space complexity against constraints before finalizing your implementation.',
    };
  }

  // TIER 1: Conceptual Approach
  if (tier === 1) {
    if (problem.slug.includes('two-sum')) {
      return {
        tier: 1,
        title: '💡 Tier 1: Conceptual Approach (Data Structure Strategy)',
        content: `Instead of comparing every pair of numbers with nested loops ($O(N^2)$), think about what value each number *needs* to reach the target:

$$\\text{complement} = \\text{target} - \\text{nums}[i]$$

If you store numbers you've already seen in a **Hash Map** (mapping \`number -> index\`), you can check if the complement exists in $O(1)$ constant time!`,
        keyTakeaway: 'Using a Hash Map trades $O(N)$ extra memory to reduce time complexity from $O(N^2)$ to $O(N)$.',
      };
    }

    if (problem.slug.includes('valid-parentheses')) {
      return {
        tier: 1,
        title: '💡 Tier 1: Conceptual Approach (Last-In, First-Out)',
        content: `Parentheses must close in the reverse order of opening. The last opened bracket must be the first one closed.

This **LIFO (Last-In, First-Out)** property makes a **Stack** data structure the ideal choice!`,
        keyTakeaway: 'Whenever nesting or matching pairs are involved, think of a Stack.',
      };
    }

    return {
      tier: 1,
      title: '💡 Tier 1: Conceptual Approach',
      content: `For **${problem.title}** (category: *${problem.category}*):

Identify the underlying pattern. Can you solve sub-problems or use auxiliary storage (Hash Table, Two Pointers, Sliding Window) to optimize your approach?`,
      keyTakeaway: 'Break down input constraints to choose between $O(N)$, $O(N \\log N)$, or $O(N^2)$.',
    };
  }

  // TIER 2: Logic & Pseudocode
  if (tier === 2) {
    if (problem.slug.includes('two-sum')) {
      return {
        tier: 2,
        title: '🛠️ Tier 2: Step-by-Step Logic & Pseudocode',
        content: `Here is the step-by-step logic for the single-pass Hash Map solution:

1. Initialize an empty Hash Map \`map\` (value -> index).
2. Iterate through array \`nums\` with index \`i\`:
   - Calculate \`complement = target - nums[i]\`.
   - If \`complement\` is in \`map\`:
     - Return \`[map[complement], i]\`.
   - Else:
     - Store \`map[nums[i]] = i\`.
3. Return empty array if no pair found.`,
        pseudocode: `function twoSum(nums, target):
    map = empty HashMap
    for i from 0 to nums.length - 1:
        complement = target - nums[i]
        if complement in map:
            return [map[complement], i]
        map[nums[i]] = i
    return []`,
        keyTakeaway: 'Store previously visited elements into the map *during* iteration to avoid using the same element twice.',
      };
    }

    return {
      tier: 2,
      title: '🛠️ Tier 2: Step-by-Step Logic & Pseudocode',
      content: `Algorithm Steps:
1. Parse and validate input data structures.
2. Initialize pointers / accumulators / hash tables.
3. Process input in a single loop, updating state.
4. Check termination and return formatted output.`,
      pseudocode: `procedure solve(input):
    state = initializeState()
    for item in input:
        if isValid(item):
            updateState(state, item)
    return formatOutput(state)`,
      keyTakeaway: 'Verify loop conditions and early return rules before writing complex nesting.',
    };
  }

  // TIER 3: Specific Code Fix & Line Analysis
  const topDiagnostic = diagnostics.length > 0 ? diagnostics[0] : null;

  let codeFixSuggestion = `// Suggested Code Fix:\n`;
  if (studentCode.includes('twoSum')) {
    codeFixSuggestion += `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
  } else {
    codeFixSuggestion += `// Ensure your function explicitly returns the result
function solution(input) {
  if (!input) return null;
  // process input safely
  return result;
}`;
  }

  return {
    tier: 3,
    title: '🔍 Tier 3: Code Line Analysis & Specific Fix',
    content: topDiagnostic
      ? `### Diagnostic Alert: **${topDiagnostic.title}**\n\n${topDiagnostic.description}\n\n**Line Suggestion**: ${
          topDiagnostic.lineSuggestion || 'Check loop boundaries'
        }`
      : `### Code Analysis\n\nYour code structure was analyzed. Ensure loop counters increment properly and your return type matches output format: \`${problem.outputFormat}\`.`,
    codeFixSuggestion,
    highlightLines: [2, 5, 8],
    keyTakeaway: topDiagnostic ? topDiagnostic.recommendation : 'Review output formatting and boundary conditions.',
  };
}
