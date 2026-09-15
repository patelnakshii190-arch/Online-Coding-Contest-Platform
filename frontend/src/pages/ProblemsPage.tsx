import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Problem, Difficulty } from '../types/problem';
import { ApiService } from '../services/api';
import { ProblemCard } from '../components/problems/ProblemCard';
import { ProblemFilter } from '../components/problems/ProblemFilter';
import { Code2, Flame, Calendar, ArrowRight, CheckCircle2, Award, Layers, SlidersHorizontal } from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'acceptance' | 'title'>('default');

  useEffect(() => {
    ApiService.getProblems().then(setProblems);
  }, []);

  const dailyProblem = problems[0];
  const availableTags = Array.from(new Set(problems.flatMap((p) => p.tags)));

  const filteredProblems = problems
    .filter((p) => {
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
      if (selectedTag !== 'All' && !p.tags.includes(selectedTag)) return false;
      if (
        searchQuery &&
        !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.slug.includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'acceptance') return b.acceptanceRate - a.acceptanceRate;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedTag('All');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* PROBLEM OF THE DAY FEATURE BANNER */}
      {dailyProblem && (
        <div className="p-6 bg-gradient-to-r from-amber-100/70 via-sky-50 to-white border border-amber-200 rounded-3xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-sky-500 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-xs font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Problem of the Day</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
                <span>Daily Challenge</span>
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              {dailyProblem.title}
            </h2>
            <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
              {dailyProblem.description}
            </p>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-right font-mono text-xs hidden sm:block">
              <span className="text-slate-500 block">Difficulty:</span>
              <span className="font-extrabold text-[#00b8a3]">{dailyProblem.difficulty}</span>
            </div>

            <Link
              to={`/problems/${dailyProblem.slug}`}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center space-x-2 font-serif"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              <span>Solve Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* PROFESSIONAL STUDY PLAN CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Top Interview 150', count: '150 Core Problems', icon: Award, color: 'bg-sky-50 text-sky-700 border-sky-200' },
          { name: 'DSA Essentials', count: 'Complete Roadmap', icon: Layers, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { name: 'SQL & Database', count: '50 Queries', icon: Code2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { name: 'Dynamic Programming', count: '40 Patterns', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ].map((plan, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${plan.color} flex items-center space-x-3 shadow-xs cursor-pointer hover:scale-102 transition-transform`}>
            <plan.icon className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{plan.name}</p>
              <p className="text-[10px] font-mono text-slate-500">{plan.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK DIFFICULTY TABS & SORT BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-amber-200/80 rounded-2xl shadow-xs">
        
        {/* Difficulty Quick Tabs */}
        <div className="flex items-center space-x-2">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDifficulty === diff
                  ? diff === 'Easy'
                    ? 'bg-[#00b8a3] text-white shadow-xs'
                    : diff === 'Medium'
                    ? 'bg-[#ffc01e] text-slate-900 shadow-xs'
                    : diff === 'Hard'
                    ? 'bg-[#ff375f] text-white shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : 'bg-amber-50/70 text-slate-700 border border-amber-200 hover:bg-amber-100/80'
              }`}
            >
              <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{diff}</span>
            </button>
          ))}
        </div>

        {/* Sorting Options */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-amber-50/50 border border-amber-200 text-xs text-slate-900 font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-500 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <option value="default">Default Order</option>
            <option value="acceptance">Highest Acceptance Rate</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Filter Toolbar */}
      <ProblemFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        availableTags={availableTags}
        onReset={handleReset}
      />

      {/* Problem Cards List */}
      <div className="space-y-3">
        {filteredProblems.map((prob, idx) => (
          <ProblemCard key={prob.id} problem={prob} index={idx} />
        ))}
      </div>

    </div>
  );
};
