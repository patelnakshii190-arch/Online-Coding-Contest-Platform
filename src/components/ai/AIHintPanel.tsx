import React, { useState } from 'react';
import { Sparkles, Lightbulb, Wrench, Search, Send, ChevronRight, CheckCircle2, Lock, Cpu, Bot } from 'lucide-react';
import { Problem } from '../../types/problem';
import { generateAIHint, AIHintResponse } from '../../services/aiHintService';

interface AIHintPanelProps {
  problem: Problem;
  code: string;
  language: string;
}

export const AIHintPanel: React.FC<AIHintPanelProps> = ({ problem, code, language }) => {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | null>(null);
  const [hints, setHints] = useState<Record<number, AIHintResponse>>({});
  const [loadingTier, setLoadingTier] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<AIHintResponse | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const fetchHint = async (tier: 1 | 2 | 3) => {
    if (hints[tier]) {
      setActiveTier(tier);
      return;
    }

    setLoadingTier(tier);
    try {
      const res = await generateAIHint({
        tier,
        problem,
        studentCode: code,
        language,
      });
      setHints((prev) => ({ ...prev, [tier]: res }));
      setActiveTier(tier);
    } catch {
      // Error handling
    } finally {
      setLoadingTier(null);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsAsking(true);
    try {
      const res = await generateAIHint({
        tier: 1,
        problem,
        studentCode: code,
        language,
        customQuestion,
      });
      setCustomAnswer(res);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              AI Coding Tutor & Hint Options <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
            </h3>
            <p className="text-xs text-slate-500">Progressive multi-tier AI assistance without spoiling full solutions.</p>
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tier 1 Button */}
        <button
          onClick={() => fetchHint(1)}
          disabled={loadingTier === 1}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTier === 1
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Level 1
            </span>
            {hints[1] && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
          <p className="text-xs font-bold text-slate-800">Conceptual Approach</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Algorithm pattern & memory trade-offs</p>
        </button>

        {/* Tier 2 Button */}
        <button
          onClick={() => fetchHint(2)}
          disabled={loadingTier === 2}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTier === 2
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/30'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
              <Wrench className="w-4 h-4" /> Level 2
            </span>
            {hints[2] && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
          <p className="text-xs font-bold text-slate-800">Logic & Pseudocode</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Step-by-step algorithm breakdown</p>
        </button>

        {/* Tier 3 Button */}
        <button
          onClick={() => fetchHint(3)}
          disabled={loadingTier === 3}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTier === 3
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/30'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
              <Search className="w-4 h-4" /> Level 3
            </span>
            {hints[3] && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
          <p className="text-xs font-bold text-slate-800">Code Analysis & Fix</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Inspect current code for logic bugs</p>
        </button>
      </div>

      {/* Loading Spinner */}
      {loadingTier && (
        <div className="py-6 text-center text-xs text-slate-500 font-medium flex items-center justify-center space-x-2">
          <Cpu className="w-4 h-4 text-sky-500 animate-spin" />
          <span>AI Tutor is analyzing problem constraints and student code...</span>
        </div>
      )}

      {/* Display Selected Hint Content */}
      {activeTier && hints[activeTier] && !loadingTier && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4 border border-slate-800 shadow-inner animate-fade-in">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            {hints[activeTier].title}
          </h4>

          <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap text-slate-300">
            {hints[activeTier].content}
          </div>

          {hints[activeTier].pseudocode && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
              <span className="text-slate-500 font-sans font-bold block mb-1">Pseudocode:</span>
              <pre>{hints[activeTier].pseudocode}</pre>
            </div>
          )}

          {hints[activeTier].codeFixSuggestion && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto">
              <span className="text-slate-500 font-sans font-bold block mb-1">Suggested Starter Fix:</span>
              <pre>{hints[activeTier].codeFixSuggestion}</pre>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Takeaway: {hints[activeTier].keyTakeaway}</span>
          </div>
        </div>
      )}

      {/* Ask Custom Question Input */}
      <form onSubmit={handleAskQuestion} className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-700 block">Ask AI Tutor a Custom Question:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="e.g., Why do we use a HashMap here? How to handle negative numbers?"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={isAsking || !customQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAsking ? 'Thinking...' : 'Ask AI'}</span>
          </button>
        </div>

        {customAnswer && (
          <div className="bg-sky-50 border border-sky-200 text-sky-900 rounded-xl p-4 text-xs space-y-2">
            <strong className="block font-bold text-sky-950">{customAnswer.title}</strong>
            <p className="whitespace-pre-wrap leading-relaxed">{customAnswer.content}</p>
          </div>
        )}
      </form>
    </div>
  );
};
