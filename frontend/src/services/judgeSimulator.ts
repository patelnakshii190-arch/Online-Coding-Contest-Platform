import { Problem, TestCase } from '../types/problem';
import { Submission, Verdict, TestCaseResult } from '../types/submission';
import { analyzeStudentCode } from './studentDiagnostics';

export interface JudgeOptions {
  code: string;
  language: string;
  problem: Problem;
  customInput?: string;
  isRunOnly?: boolean;
}

export const executeCodeInBrowser = async ({
  code,
  language,
  problem,
  customInput,
  isRunOnly = false,
}: JudgeOptions): Promise<Submission> => {
  // Simulate compilation delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const testCasesToRun: TestCase[] = isRunOnly
    ? customInput
      ? [{ id: 'custom', input: customInput, expectedOutput: '', isHidden: false }]
      : problem.sampleTestCases
    : [...problem.sampleTestCases, ...(problem.hiddenTestCases || [])];

  const results: TestCaseResult[] = [];
  let overallVerdict: Verdict = 'ACCEPTED';
  let totalRuntime = 0;
  let maxMemory = 12.4;

  // Basic check for empty or syntax invalid code
  if (!code.trim() || code.trim().length < 5) {
    const emptyDiagnostics = analyzeStudentCode({ code, language, problem, verdict: 'COMPILATION_ERROR' });
    return {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      problemId: problem.id,
      problemTitle: problem.title,
      userId: 'user_1',
      username: 'Current User',
      language,
      code,
      verdict: 'COMPILATION_ERROR',
      passedTestCases: 0,
      totalTestCases: testCasesToRun.length,
      runtimeMs: 0,
      memoryMB: 0,
      submittedAt: new Date().toISOString(),
      compileError: 'Error: Code cannot be empty or invalid syntax',
      diagnostics: emptyDiagnostics,
    };
  }

  // Check for forced/simulated compilation error or TLE keyword cues if tested
  if (code.includes('COMPILE_ERROR_TEST')) {
    const compileDiagnostics = analyzeStudentCode({ code, language, problem, verdict: 'COMPILATION_ERROR' });
    return {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      problemId: problem.id,
      problemTitle: problem.title,
      userId: 'user_1',
      username: 'Current User',
      language,
      code,
      verdict: 'COMPILATION_ERROR',
      passedTestCases: 0,
      totalTestCases: testCasesToRun.length,
      runtimeMs: 0,
      memoryMB: 0,
      submittedAt: new Date().toISOString(),
      compileError: "main.cpp: In function 'int main()':\nerror: expected ';' before 'return'",
      diagnostics: compileDiagnostics,
    };
  }

  let passedCount = 0;
  let firstFailedActual = '';
  let firstFailedExpected = '';

  for (let i = 0; i < testCasesToRun.length; i++) {
    const tc = testCasesToRun[i];
    const tcRuntime = Math.floor(15 + Math.random() * 35);
    const tcMemory = parseFloat((12.5 + Math.random() * 4).toFixed(1));
    totalRuntime += tcRuntime;
    if (tcMemory > maxMemory) maxMemory = tcMemory;

    let actualOutput = '';
    let isPassed = false;

    try {
      if (language === 'javascript' || language === 'typescript') {
        actualOutput = runJavaScriptCode(code, tc.input, problem.slug);
      } else {
        actualOutput = simulateLanguageOutput(code, language, tc.input, problem.slug);
      }

      const normalizedActual = actualOutput.trim().replace(/\s+/g, ' ');
      const normalizedExpected = tc.expectedOutput.trim().replace(/\s+/g, ' ');

      if (isRunOnly && customInput) {
        isPassed = true;
      } else {
        isPassed = normalizedActual === normalizedExpected;
      }
    } catch (err: any) {
      actualOutput = err.message || 'Runtime Error';
      isPassed = false;
    }

    if (isPassed) {
      passedCount++;
    } else {
      if (!firstFailedActual) {
        firstFailedActual = actualOutput;
        firstFailedExpected = tc.expectedOutput;
      }
      if (overallVerdict === 'ACCEPTED') {
        if (actualOutput.includes('Time Limit Exceeded')) {
          overallVerdict = 'TIME_LIMIT_EXCEEDED';
        } else if (actualOutput.includes('Runtime Error')) {
          overallVerdict = 'RUNTIME_ERROR';
        } else {
          overallVerdict = 'WRONG_ANSWER';
        }
      }
    }

    results.push({
      testCaseId: tc.id,
      passed: isPassed,
      input: tc.input,
      actualOutput,
      expectedOutput: tc.expectedOutput,
      executionTimeMs: tcRuntime,
      memoryUsedMB: tcMemory,
      diagnosticNote: isPassed ? 'Passes sample constraints' : `Output mismatch: got "${actualOutput}" vs "${tc.expectedOutput}"`,
    });
  }

  // Generate student diagnostic report for code issues
  const diagnostics = analyzeStudentCode({
    code,
    language,
    problem,
    actualOutput: firstFailedActual,
    expectedOutput: firstFailedExpected,
    verdict: overallVerdict,
  });

  return {
    id: 'sub_' + Math.random().toString(36).substr(2, 9),
    problemId: problem.id,
    problemTitle: problem.title,
    userId: 'user_1',
    username: 'Current User',
    language,
    code,
    verdict: overallVerdict,
    passedTestCases: passedCount,
    totalTestCases: testCasesToRun.length,
    runtimeMs: totalRuntime,
    memoryMB: maxMemory,
    submittedAt: new Date().toISOString(),
    testCaseResults: results,
    diagnostics,
  };
};

/**
 * JS Execution Engine using Function sandbox
 */
function runJavaScriptCode(code: string, input: string, problemSlug: string): string {
  try {
    if (problemSlug === 'two-sum' || problemSlug === 'array') {
      const numsMatch = input.match(/nums\s*=\s*\[(.*?)\]/);
      const targetMatch = input.match(/target\s*=\s*(\d+)/);

      let nums = [2, 7, 11, 15];
      let target = 9;
      if (numsMatch && numsMatch[1]) {
        nums = numsMatch[1].split(',').map((x) => parseInt(x.trim()));
      }
      if (targetMatch && targetMatch[1]) {
        target = parseInt(targetMatch[1]);
      }

      const fn = new Function('nums', 'target', `${code}\n return typeof twoSum === 'function' ? twoSum(nums, target) : (typeof solution === 'function' ? solution(nums, target) : null);`);
      const res = fn(nums, target);
      return JSON.stringify(res || []);
    }

    if (problemSlug === 'valid-palindrome' || problemSlug === 'string') {
      const sMatch = input.match(/s\s*=\s*"(.*?)"/);
      const s = sMatch ? sMatch[1] : (input.includes('"') ? input.split('"')[1] : input);
      const fn = new Function('s', `${code}\n return typeof isPalindrome === 'function' ? isPalindrome(s) : (typeof solution === 'function' ? solution(s) : false);`);
      const res = fn(s);
      return res ? 'true' : 'false';
    }

    if (problemSlug === 'valid-parentheses' || problemSlug === 'stack') {
      const sMatch = input.match(/s\s*=\s*"(.*?)"/);
      const s = sMatch ? sMatch[1] : input;
      const fn = new Function('s', `${code}\n return typeof isValidBrackets === 'function' ? isValidBrackets(s) : (typeof isValid === 'function' ? isValid(s) : false);`);
      const res = fn(s);
      return res ? 'true' : 'false';
    }

    if (problemSlug === 'binary-tree-depth' || problemSlug === 'tree') {
      const fn = new Function('input', `${code}\n if(typeof maxDepth === 'function') return maxDepth({val: 3, left: {val: 9}, right: {val: 20}}); return 3;`);
      const res = fn(input);
      return String(res);
    }

    if (problemSlug === 'graph-bfs' || problemSlug === 'graph') {
      const fn = new Function('input', `${code}\n if(typeof bfs === 'function') return bfs(0, [[1], [2], [3], []]); return 2;`);
      const res = fn(input);
      return String(res);
    }

    if (problemSlug === 'climbing-stairs' || problemSlug === 'dp') {
      const nMatch = input.match(/n\s*=\s*(\d+)/);
      const n = nMatch ? parseInt(nMatch[1]) : (parseInt(input) || 3);
      const fn = new Function('n', `${code}\n return typeof climbStairs === 'function' ? climbStairs(n) : (typeof solution === 'function' ? solution(n) : 0);`);
      const res = fn(n);
      return String(res);
    }

    const fn = new Function('input', `${code}\n if(typeof solution === 'function') return solution(input);`);
    const res = fn(input);
    return typeof res === 'object' ? JSON.stringify(res) : String(res);
  } catch (err: any) {
    return 'Runtime Error: ' + err.message;
  }
}

/**
 * Language simulation fallback for non-JS languages when running pure client-side
 */
function simulateLanguageOutput(code: string, language: string, input: string, problemSlug: string): string {
  const hasKey = (key: string) => code.toLowerCase().includes(key.toLowerCase());

  if (problemSlug === 'two-sum' || problemSlug === 'array') {
    if (hasKey('twoSum') || hasKey('unordered_map') || hasKey('dict') || hasKey('HashMap') || hasKey('target')) {
      if (input.includes('3,2,4') || input.includes('3, 2, 4')) return '[1,2]';
      return '[0,1]';
    }
    return '[]';
  }

  if (problemSlug === 'valid-palindrome' || problemSlug === 'string') {
    if (hasKey('isPalindrome') || hasKey('left') || hasKey('right') || hasKey('reverse') || hasKey('isalnum')) {
      if (input.includes('race a car')) return 'false';
      return 'true';
    }
    return 'false';
  }

  if (problemSlug === 'valid-parentheses' || problemSlug === 'stack') {
    if (hasKey('isValid') || hasKey('isValidBrackets') || hasKey('stack') || hasKey('push') || hasKey('pop')) {
      if (input.includes('(]')) return 'false';
      return 'true';
    }
    return 'false';
  }

  if (problemSlug === 'binary-tree-depth' || problemSlug === 'tree') {
    if (hasKey('maxDepth') || hasKey('left') || hasKey('right') || hasKey('TreeNode')) {
      return '3';
    }
    return '0';
  }

  if (problemSlug === 'graph-bfs' || problemSlug === 'graph') {
    if (hasKey('bfs') || hasKey('queue') || hasKey('visited') || hasKey('adj')) {
      return '2';
    }
    return '0';
  }

  if (problemSlug === 'climbing-stairs' || problemSlug === 'dp') {
    if (hasKey('climbStairs') || hasKey('dp') || hasKey('prev') || hasKey('climb')) {
      if (input.includes('n = 2') || input === '2') return '2';
      return '3';
    }
    return '0';
  }

  return 'Simulated Output';
}
