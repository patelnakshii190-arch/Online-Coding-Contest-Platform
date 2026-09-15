import { StudentDiagnosticIssue } from '../types/submission';
import { Problem } from '../types/problem';

export interface CodeAnalysisInput {
  code: string;
  language: string;
  problem: Problem;
  actualOutput?: string;
  expectedOutput?: string;
  verdict?: string;
}

export function analyzeStudentCode({
  code,
  language,
  problem,
  actualOutput = '',
  expectedOutput = '',
  verdict = '',
}: CodeAnalysisInput): StudentDiagnosticIssue[] {
  const issues: StudentDiagnosticIssue[] = [];
  const cleanCode = code.trim();

  if (!cleanCode) return [];

  // --- 1. Off-by-One / Indexing Diagnostics ---
  const offByOnePatterns = [
    /for\s*\([^;]+;\s*\w+\s*<=\s*\w+\.length\b/i,
    /for\s*\([^;]+;\s*\w+\s*<=\s*len\([^)]+\)/i,
    /range\s*\(\s*0\s*,\s*len\([^)]+\)\s*\+\s*1\s*\)/i,
    /\[\s*\w+\.length\s*\]/i,
  ];

  for (const pattern of offByOnePatterns) {
    if (pattern.test(cleanCode)) {
      issues.push({
        id: 'diag-off-by-one',
        title: 'Potential Off-By-One Indexing Error',
        type: 'OFF_BY_ONE',
        severity: 'error',
        description:
          'Loop condition uses `<=` with array length or ranges 1 element too far. In 0-indexed arrays, accessing `arr[arr.length]` causes an Out-of-Bounds crash or `undefined` access.',
        lineSuggestion: 'Change `<= arr.length` to `< arr.length` or use `range(len(arr))`.',
        recommendation: 'Check loop boundary conditions. Standard array iteration should stop at `length - 1`.',
      });
      break;
    }
  }

  // --- 2. Infinite Loop / Missing Loop Counter Mutation ---
  const whileWithoutIncrement = /while\s*\(([^)]+)\)\s*\{([^}]*)\}/gs;
  let match;
  while ((match = whileWithoutIncrement.exec(cleanCode)) !== null) {
    const condition = match[1];
    const body = match[2];
    const condVarMatch = condition.match(/\b([a-zA-Z_]\w*)\b/);
    if (condVarMatch && condVarMatch[1]) {
      const varName = condVarMatch[1];
      if (!['true', 'false', '1', '0', 'null'].includes(varName)) {
        const mutatesVar = new RegExp(`\\b${varName}\\s*(\\+\\+|--|\\+=|-=|\\*=|=)`, 'g').test(body);
        if (!mutatesVar && !body.includes('break') && !body.includes('return')) {
          issues.push({
            id: 'diag-infinite-loop',
            title: 'Potential Infinite Loop Detected',
            type: 'INFINITE_LOOP',
            severity: 'error',
            description: `The loop condition relies on \`${varName}\`, but \`${varName}\` is never incremented, decremented, or updated inside the \`while\` body.`,
            lineSuggestion: `Ensure \`${varName}\` is updated inside the loop body (e.g. \`${varName}++\`).`,
            recommendation: 'Add loop termination conditions or ensure your counter variable moves toward the exit condition.',
          });
          break;
        }
      }
    }
  }

  // --- 3. Null / Undefined Dereferencing ---
  if (
    cleanCode.includes('.length') &&
    !cleanCode.includes('if (') &&
    !cleanCode.includes('&&') &&
    !cleanCode.includes('?.')
  ) {
    issues.push({
      id: 'diag-null-pointer',
      title: 'Unchecked Object / Array Dereference',
      type: 'NULL_POINTER',
      severity: 'warning',
      description:
        'Accessing properties like `.length` or indexing `[i]` directly without checking if the array/object is `null` or `undefined` first.',
      lineSuggestion: 'Add optional chaining `arr?.length` or check `if (arr && arr.length)`.',
      recommendation: 'Safeguard edge case inputs where the array or string might be empty or null.',
    });
  }

  // --- 4. Missing Return Statement or Incorrect Return Type ---
  if (language === 'javascript' || language === 'typescript') {
    if (!cleanCode.includes('return') && verdict === 'WRONG_ANSWER') {
      issues.push({
        id: 'diag-missing-return',
        title: 'Missing Return Statement',
        type: 'MISSING_RETURN',
        severity: 'error',
        description: 'Function finished execution without explicitly returning a value, producing `undefined`.',
        lineSuggestion: 'Add a explicit `return` statement with your computed answer.',
        recommendation: `Check problem constraints. ${problem.outputFormat}`,
      });
    }
  }

  // --- 5. Unhandled Edge Cases (Empty Array / Single Element) ---
  if (
    problem.slug.includes('two-sum') ||
    problem.slug.includes('array') ||
    problem.category.toLowerCase().includes('array')
  ) {
    if (!cleanCode.includes('.length === 0') && !cleanCode.includes('len(') && !cleanCode.includes('size() == 0')) {
      issues.push({
        id: 'diag-edge-case',
        title: 'Unhandled Boundary Edge Cases (Empty / 1-Element Input)',
        type: 'EDGE_CASE',
        severity: 'info',
        description:
          'Your solution assumes input arrays have at least 2 elements. Testing against empty arrays `[]` or single-element inputs `[1]` may cause silent failures or out-of-bound errors.',
        lineSuggestion: 'Add early check: `if (nums.length < 2) return [];` at the start of your function.',
        recommendation: 'Always consider boundary cases (0 elements, negative numbers, maximum array size).',
      });
    }
  }

  // --- 6. Time Complexity Bottleneck (TLE Risk) ---
  const nestedLoopCount = (cleanCode.match(/for\s*\(/g) || []).length;
  if (nestedLoopCount >= 2 && verdict === 'TIME_LIMIT_EXCEEDED') {
    issues.push({
      id: 'diag-tle-risk',
      title: 'High Time Complexity Bottleneck ($O(N^2)$ or $O(N^3)$)',
      type: 'TLE_RISK',
      severity: 'error',
      description:
        'Nested loops found. For array sizes $N \\ge 10^4$, an $O(N^2)$ solution requires $10^8$ operations, exceeding the 1-second time limit.',
      lineSuggestion: 'Use a Hash Map or Two Pointers approach to reduce time complexity to $O(N)$ or $O(N \\log N)$.',
      recommendation: 'Optimize your algorithm using a single pass with auxiliary hash table indexing.',
    });
  }

  // Fallback diagnostic if Wrong Answer occurred
  if (issues.length === 0 && verdict === 'WRONG_ANSWER') {
    issues.push({
      id: 'diag-generic-wa',
      title: 'Logic Mismatch on Target Output',
      type: 'SYNTAX_WARNING',
      severity: 'warning',
      description: `Your actual output \`${actualOutput || 'undefined'}\` did not match expected output \`${expectedOutput}\`.`,
      lineSuggestion: 'Trace your code step-by-step with sample input values.',
      recommendation: 'Check variable initializations, zero-indexing, and accumulator reset logic inside loops.',
    });
  }

  return issues;
}
