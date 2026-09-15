export type Verdict = 
  | 'ACCEPTED' 
  | 'WRONG_ANSWER' 
  | 'TIME_LIMIT_EXCEEDED' 
  | 'MEMORY_LIMIT_EXCEEDED' 
  | 'COMPILATION_ERROR' 
  | 'RUNTIME_ERROR' 
  | 'PENDING';

export interface StudentDiagnosticIssue {
  id: string;
  title: string;
  type: 'OFF_BY_ONE' | 'INFINITE_LOOP' | 'NULL_POINTER' | 'TYPE_MISMATCH' | 'MISSING_RETURN' | 'EDGE_CASE' | 'TLE_RISK' | 'SYNTAX_WARNING';
  severity: 'error' | 'warning' | 'info';
  description: string;
  lineSuggestion?: string;
  recommendation: string;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  actualOutput: string;
  expectedOutput: string;
  executionTimeMs: number;
  memoryUsedMB: number;
  errorLog?: string;
  diagnosticNote?: string;
}

export interface Submission {
  id: string;
  submissionId?: string;
  problemId: string;
  problemTitle: string;
  userId: string;
  username: string;
  userName?: string;
  language: string;
  code: string;
  verdict: Verdict;
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs: number;
  memoryMB: number;
  submittedAt: string;
  testCaseResults?: TestCaseResult[];
  compileError?: string;
  diagnostics?: StudentDiagnosticIssue[];
}
