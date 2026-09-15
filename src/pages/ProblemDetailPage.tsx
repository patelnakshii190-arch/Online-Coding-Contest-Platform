import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Problem } from '../types/problem';
import { Submission } from '../types/submission';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProblemStatement } from '../components/problems/ProblemStatement';
import { CodeEditor } from '../components/editor/CodeEditor';
import { ConsolePanel } from '../components/editor/ConsolePanel';
import { AIHintPanel } from '../components/ai/AIHintPanel';
import { ArrowLeft, Loader2, Terminal, Bot, FileText, Sparkles } from 'lucide-react';

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { recordSolveActivity } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  // Left Pane Active Tab
  const [leftTab, setLeftTab] = useState<'statement' | 'ai_hints'>('statement');

  // Editor states
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result' | 'diagnostics'>('testcase');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      ApiService.getProblemBySlug(slug).then((prob) => {
        if (prob) {
          setProblem(prob);
          const initialCode = (prob.starterTemplates as any)[language] || '';
          setCode(initialCode);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3 bg-[#fffdf0] text-slate-800 font-sans">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Loading IDE Workspace...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white border border-amber-200 rounded-2xl space-y-4 text-slate-800 font-sans">
        <h2 className="text-lg font-bold text-slate-900">Problem Not Found</h2>
        <p className="text-xs text-slate-500">The problem slug requested does not exist.</p>
        <Link to="/problems" className="inline-block px-4 py-2 bg-sky-500 text-white rounded-lg text-xs font-bold">
          Return to Problems
        </Link>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await ApiService.runCodeSample(problem, code, language, customInput);
      setLastSubmission(result);
      if (result.diagnostics && result.diagnostics.length > 0 && result.verdict !== 'ACCEPTED') {
        setConsoleTab('diagnostics');
      } else {
        setConsoleTab('result');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const result = await ApiService.submitCode(problem, code, language);
      setLastSubmission(result);
      if (result.verdict === 'ACCEPTED') {
        setProblem({ ...problem, solvedStatus: 'solved' });
        recordSolveActivity();
        setConsoleTab('result');
      } else if (result.diagnostics && result.diagnostics.length > 0) {
        setConsoleTab('diagnostics');
      } else {
        setConsoleTab('result');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.01rem)] overflow-hidden bg-[#fffdf0] text-slate-800 font-sans">
      
      {/* Top IDE Workspace Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-amber-200 text-xs">
        <Link
          to="/problems"
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-sky-500" />
          <span>Back to Problems</span>
        </Link>

        <div className="flex items-center space-x-3 font-mono">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
            <Terminal className="w-3.5 h-3.5 text-sky-500" /> {problem.title}
          </span>
          <span className="text-slate-300">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Time Limit: {problem.timeLimitSec}s
        </div>
      </div>

      {/* Main Split Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
        
        {/* Left Pane: Problem Statement / AI Tutor Hints (5 columns) */}
        <div className="lg:col-span-5 h-full flex flex-col overflow-hidden border-r border-amber-200/80 bg-white">
          {/* Left Pane Tab Header */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50/60 border-b border-amber-200">
            <button
              onClick={() => setLeftTab('statement')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                leftTab === 'statement'
                  ? 'bg-white text-sky-700 shadow-xs border border-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>Problem Description</span>
            </button>

            <button
              onClick={() => setLeftTab('ai_hints')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                leftTab === 'ai_hints'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Hints & Tutor</span>
              <Sparkles className="w-3 h-3 text-amber-300 fill-current" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {leftTab === 'statement' ? (
              <ProblemStatement problem={problem} />
            ) : (
              <AIHintPanel problem={problem} code={code} language={language} />
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor + Console Panel (7 columns) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white">
          
          {/* Top: Monaco Code Editor */}
          <div className="flex-1 overflow-hidden min-h-[300px]">
            <CodeEditor
              problem={problem}
              language={language}
              setLanguage={setLanguage}
              code={code}
              setCode={setCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Bottom: Console Panel */}
          <div className="h-64 min-h-[160px] border-t border-amber-200 bg-white">
            <ConsolePanel
              problem={problem}
              lastSubmission={lastSubmission}
              isRunning={isRunning || isSubmitting}
              activeTab={consoleTab}
              setActiveTab={setConsoleTab}
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
