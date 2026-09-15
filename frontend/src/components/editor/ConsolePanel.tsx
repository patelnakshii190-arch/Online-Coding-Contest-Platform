import React, { useState } from 'react';
import { Problem } from '../../types/problem';
import { Submission } from '../../types/submission';
import { VerdictBadge } from './VerdictBadge';
import { Terminal, CheckCircle2, Clock, Cpu, FileText, ChevronUp, ChevronDown, AlertTriangle, Sparkles, AlertCircle, Info } from 'lucide-react';

interface ConsolePanelProps {
  problem: Problem;
  lastSubmission: Submission | null;
  isRunning: boolean;
  activeTab: 'testcase' | 'result' | 'diagnostics';
  setActiveTab: (tab: 'testcase' | 'result' | 'diagnostics') => void;
  customInput: string;
  setCustomInput: (val: string) => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  problem,
  lastSubmission,
  isRunning,
  activeTab,
  setActiveTab,
  customInput,
  setCustomInput,
}) => {
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  const loadSampleInput = (idx: number) => {
    if (problem.sampleTestCases[idx]) {
      setCustomInput(problem.sampleTestCases[idx].input);
    }
  };

  const diagnosticsCount = lastSubmission?.diagnostics?.length || 0;

  return (
    <div className="border-t border-amber-200 bg-white flex flex-col h-full overflow-hidden">
      
      {/* Console Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-amber-50/50 border-b border-amber-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'testcase'
                ? 'bg-white text-sky-700 border border-sky-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            <span>Testcases ({problem.sampleTestCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors relative ${
              activeTab === 'result'
                ? 'bg-white text-sky-700 border border-sky-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Test Result</span>
            {lastSubmission && !isRunning && (
              <span
                className={`w-2 h-2 rounded-full ${
                  lastSubmission.verdict === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors relative ${
              activeTab === 'diagnostics'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Potential Issues</span>
            {diagnosticsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                {diagnosticsCount}
              </span>
            )}
          </button>
        </div>

        <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-500 hover:text-slate-800 p-1">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Console Body */}
      {isExpanded && (
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-800 bg-[#fffdf0]">
          
          {/* TAB 1: TEST CASES */}
          {activeTab === 'testcase' && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <div className="flex items-center space-x-2">
                  {problem.sampleTestCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setSelectedTestCaseIdx(idx)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        selectedTestCaseIdx === idx
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-slate-500">Quick Load:</span>
                  {problem.sampleTestCases.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadSampleInput(idx)}
                      className="px-2 py-0.5 bg-amber-100/80 hover:bg-amber-200 text-amber-900 rounded font-mono font-bold transition-colors"
                    >
                      Ex {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Input Parameters</label>
                <div className="p-3 bg-white border border-amber-200 rounded-lg font-mono text-slate-800 whitespace-pre-wrap">
                  {problem.sampleTestCases[selectedTestCaseIdx]?.input}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Expected Output</label>
                <div className="p-3 bg-white border border-amber-200 rounded-lg font-mono text-emerald-700 font-bold whitespace-pre-wrap">
                  {problem.sampleTestCases[selectedTestCaseIdx]?.expectedOutput}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Custom Input (Optional)</label>
                <textarea
                  rows={2}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input string..."
                  className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TEST RESULTS & JUDGE OUTPUT */}
          {activeTab === 'result' && (
            <div className="font-sans">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-700 text-sm font-medium">Running solution against testcases...</p>
                </div>
              ) : lastSubmission ? (
                <div className="space-y-4">
                  {/* Verdict Top Bar */}
                  <div className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg shadow-xs">
                    <VerdictBadge verdict={lastSubmission.verdict} size="md" />

                    <div className="flex items-center space-x-4 text-xs font-mono text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        <span>Runtime: <strong className="text-slate-900">{lastSubmission.runtimeMs} ms</strong></span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Cpu className="w-3.5 h-3.5 text-purple-600" />
                        <span>Memory: <strong className="text-slate-900">{lastSubmission.memoryMB} MB</strong></span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Passed: <strong className="text-slate-900">{lastSubmission.passedTestCases} / {lastSubmission.totalTestCases}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Compile Error Output if any */}
                  {lastSubmission.compileError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                      <p className="font-bold text-rose-800 mb-1">Compilation Output:</p>
                      {lastSubmission.compileError}
                    </div>
                  )}

                  {/* Detailed testcase results */}
                  {lastSubmission.testCaseResults && lastSubmission.testCaseResults.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-500">Detailed Test Results:</p>
                      {lastSubmission.testCaseResults.map((tcRes, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border text-xs space-y-2 bg-white ${
                            tcRes.passed ? 'border-emerald-200' : 'border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">Testcase {i + 1}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tcRes.passed
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {tcRes.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 block">Actual Output:</span>
                              <div className="p-2 bg-amber-50/50 rounded font-mono text-slate-800 mt-0.5 border border-amber-200">
                                {tcRes.actualOutput}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Expected Output:</span>
                              <div className="p-2 bg-amber-50/50 rounded font-mono text-emerald-700 font-bold mt-0.5 border border-amber-200">
                                {tcRes.expectedOutput}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6 text-xs">
                  Run your code or submit to view execution metrics and testcase verdicts.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: STUDENT POTENTIAL ISSUES & DIAGNOSTICS */}
          {activeTab === 'diagnostics' && (
            <div className="font-sans space-y-4">
              <div className="flex items-center space-x-2 border-b border-amber-200 pb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-800">
                  Student Diagnostics & Code Issue Analyzer
                </h4>
              </div>

              {lastSubmission?.diagnostics && lastSubmission.diagnostics.length > 0 ? (
                <div className="space-y-3">
                  {lastSubmission.diagnostics.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border space-y-2 bg-white ${
                        issue.severity === 'error'
                          ? 'border-rose-300 bg-rose-50/30'
                          : issue.severity === 'warning'
                          ? 'border-amber-300 bg-amber-50/30'
                          : 'border-sky-300 bg-sky-50/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {issue.severity === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                        {issue.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {issue.severity === 'info' && <Info className="w-4 h-4 text-sky-600" />}

                        <span className="text-xs font-bold text-slate-900">{issue.title}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{issue.description}</p>

                      {issue.lineSuggestion && (
                        <div className="p-2.5 rounded-lg bg-slate-900 text-amber-300 font-mono text-[11px]">
                          <span className="text-slate-400 block text-[10px] font-sans font-bold">Suggested Fix:</span>
                          {issue.lineSuggestion}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-600 font-medium pt-1">
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">No Syntax or Indexing Issues Detected!</p>
                  <p className="text-[11px] text-slate-500">
                    Your code structure matches baseline safety checks. If test cases fail, check the AI Hints tab for logic advice.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
