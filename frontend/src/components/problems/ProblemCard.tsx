import React from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../../types/problem';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  index?: number;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, index }) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300';
      case 'Medium':
        return 'text-amber-800 bg-amber-50 border-amber-300';
      case 'Hard':
        return 'text-rose-700 bg-rose-50 border-rose-300';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  // Derive problem number display
  const problemNumber = index !== undefined ? (index < 9 ? `#0${index + 1}` : `#${index + 1}`) : `#${problem.id.replace('prob-', '')}`;

  return (
    <div className="group relative p-5 bg-white hover:bg-amber-50/40 border border-amber-200/90 hover:border-sky-300 rounded-2xl transition-all shadow-xs hover:shadow-md">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Section: Rank Badge, Status & Title Info */}
        <div className="flex items-start md:items-center space-x-4 min-w-0 flex-1">
          
          {/* Custom Index Rank Box */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 group-hover:border-sky-300 text-slate-700 group-hover:text-sky-600 font-mono font-extrabold text-xs flex flex-col items-center justify-center transition-colors">
            <span>{problemNumber}</span>
          </div>

          {/* Solved Status Indicator */}
          <div className="flex-shrink-0 pt-1 md:pt-0">
            {problem.solvedStatus === 'solved' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" />
            )}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <Link
              to={`/problems/${problem.slug}`}
              className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate block font-serif"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              {problem.title}
            </Link>

            <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-xs">
              <span className="font-semibold text-slate-600 font-mono">{problem.category}</span>
              <span className="text-slate-300">•</span>
              {problem.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] bg-slate-100/80 text-slate-600 rounded-md font-mono border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Acceptance Meter, Difficulty Badge & CTA */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-amber-100">
          
          {/* Visual Acceptance Rate Meter */}
          <div className="flex flex-col items-start md:items-end text-xs font-mono space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Acceptance:</span>
              <strong className="text-slate-900 font-bold">{problem.acceptanceRate}%</strong>
            </div>
            {/* Visual mini progress bar */}
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(10, problem.acceptanceRate))}%` }}
              />
            </div>
          </div>

          {/* Difficulty Badge */}
          <span
            className={`px-3 py-1 text-xs font-bold rounded-lg border font-mono ${getDifficultyBadge(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>

          {/* Custom CTA Action Button */}
          <Link
            to={`/problems/${problem.slug}`}
            className="px-4 py-2 bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white border border-sky-200 hover:border-sky-500 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center space-x-1.5 group/btn font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>Solve Challenge</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

        </div>

      </div>

    </div>
  );
};
