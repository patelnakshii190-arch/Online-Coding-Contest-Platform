import React, { useState, useEffect } from 'react';
import { Problem } from '../../types/problem';
import { Submission } from '../../types/submission';
import { ApiService } from '../../services/api';
import { VerdictBadge } from '../editor/VerdictBadge';
import { BookOpen, History, MessageSquare, Clock, Cpu } from 'lucide-react';

interface ProblemStatementProps {
  problem: Problem;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'editorial'>('description');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      ApiService.getSubmissionsForProblem(problem.id).then(setSubmissions);
    }
  }, [activeTab, problem.id]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Pane Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50/50 border-b border-amber-200">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'description'
                ? 'bg-white text-sky-700 border border-sky-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Description</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'submissions'
                ? 'bg-white text-sky-700 border border-sky-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-sky-500" />
            <span>Submissions</span>
          </button>

          <button
            onClick={() => setActiveTab('editorial')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'editorial'
                ? 'bg-white text-sky-700 border border-sky-200 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
            <span>Editorial & Solutions</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{problem.timeLimitSec}s</span>
          </span>
          <span className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>{problem.memoryLimitMB}MB</span>
          </span>
        </div>
      </div>

      {/* Pane Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-800 bg-[#fffdf0]">
        
        {/* TAB 1: DESCRIPTION */}
        {activeTab === 'description' && (
          <div className="space-y-6">
            
            {/* Title & Difficulty */}
            <div className="p-4 bg-white border border-amber-200/80 rounded-2xl shadow-xs">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-xl font-extrabold text-slate-900">{problem.title}</h1>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded border ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : problem.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                <span>Category: <strong className="text-slate-800">{problem.category}</strong></span>
                <span>•</span>
                <span>Acceptance: <strong className="text-slate-800">{problem.acceptanceRate}%</strong></span>
              </div>
            </div>

            {/* Markdown Description */}
            <div className="p-4 bg-white border border-amber-200/80 rounded-2xl shadow-xs text-sm text-slate-700 space-y-3 leading-relaxed">
              <p className="whitespace-pre-wrap">{problem.description}</p>
            </div>

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-amber-200/80 rounded-xl space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Input Format</h4>
                <p className="text-xs text-slate-800 font-mono">{problem.inputFormat}</p>
              </div>
              <div className="p-4 bg-white border border-amber-200/80 rounded-xl space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Format</h4>
                <p className="text-xs text-slate-800 font-mono">{problem.outputFormat}</p>
              </div>
            </div>

            {/* Sample Test Cases */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sample Examples</h3>
              {problem.sampleTestCases.map((tc, idx) => (
                <div key={tc.id} className="p-4 bg-white border border-amber-200/80 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-sky-600 font-mono">Example {idx + 1}:</span>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Input:</span>
                    <pre className="p-2.5 bg-amber-50/60 rounded-lg text-xs font-mono text-slate-800 border border-amber-200">
                      {tc.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Output:</span>
                    <pre className="p-2.5 bg-amber-50/60 rounded-lg text-xs font-mono text-emerald-700 font-bold border border-amber-200">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="p-4 bg-white border border-amber-200/80 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Constraints</h3>
              <ul className="list-disc list-inside text-xs font-mono text-slate-700 space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* TAB 2: SUBMISSIONS HISTORY */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Past Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No past submissions for this problem yet. Submit your code to trace your attempts!
              </p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 bg-white border border-amber-200/80 rounded-xl flex items-center justify-between shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <VerdictBadge verdict={sub.verdict} size="sm" />
                        <span className="text-xs font-mono text-slate-600 uppercase font-bold">
                          {sub.language}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono text-slate-700">
                      <p>Time: <strong className="text-sky-600">{sub.runtimeMs} ms</strong></p>
                      <p>Memory: <strong className="text-purple-600">{sub.memoryMB} MB</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EDITORIAL */}
        {activeTab === 'editorial' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-sky-700 flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Optimal Approach & Complexity Analysis</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                To achieve optimal performance, we can maintain a Hash Map storing key-value pairs of number to index. As we iterate over the elements, we compute the required complement. If the complement exists in the map, we have found our pair in <strong>O(N) time</strong> and <strong>O(N) space</strong>.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
