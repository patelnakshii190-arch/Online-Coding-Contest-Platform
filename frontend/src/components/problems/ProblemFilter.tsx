import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Difficulty } from '../../types/problem';

interface ProblemFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDifficulty: Difficulty | 'All';
  setSelectedDifficulty: (d: Difficulty | 'All') => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  availableTags: string[];
  onReset: () => void;
}

export const ProblemFilter: React.FC<ProblemFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedTag,
  setSelectedTag,
  availableTags,
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title, key or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Difficulty Pill Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDifficulty === diff
                  ? diff === 'Easy'
                    ? 'bg-emerald-600 text-white'
                    : diff === 'Medium'
                    ? 'bg-amber-600 text-white'
                    : diff === 'Hard'
                    ? 'bg-rose-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Tags & Reset Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Tags:</span>
        </span>

        <button
          onClick={() => setSelectedTag('All')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
            selectedTag === 'All'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Topics
        </button>

        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedTag === tag
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
          >
            {tag}
          </button>
        ))}

        {(selectedDifficulty !== 'All' || selectedTag !== 'All' || searchQuery !== '') && (
          <button
            onClick={onReset}
            className="ml-auto text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-2.5 py-1 bg-rose-50 rounded-lg border border-rose-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
