export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface StarterTemplates {
  cpp: string;
  java: string;
  python: string;
  javascript: string;
  go?: string;
  rust?: string;
}

export interface Problem {
  id: string;
  problemId?: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  acceptanceRate: number;
  likes: number;
  dislikes: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleTestCases: TestCase[];
  hiddenTestCases?: TestCase[];
  solutionExplanation?: string;
  timeLimitSec: number;
  memoryLimitMB: number;
  starterTemplates: StarterTemplates;
  solvedStatus?: 'solved' | 'attempted' | 'unsolved';
}
