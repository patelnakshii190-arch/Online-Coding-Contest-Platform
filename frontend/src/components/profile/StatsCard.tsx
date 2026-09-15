import React from 'react';
import { User } from '../../types/user';
import { Target, Flame, CheckCircle, Award } from 'lucide-react';

interface StatsCardProps {
  user: User;
}

export const StatsCard: React.FC<StatsCardProps> = ({ user }) => {
  const solved = user?.solvedCount || { easy: 0, medium: 0, hard: 0, total: 0 };
  const easyRatio = Math.min(100, (solved.easy / 100) * 100);
  const mediumRatio = Math.min(100, (solved.medium / 80) * 100);
  const hardRatio = Math.min(100, (solved.hard / 40) * 100);
  
  // Total ratio out of 220 total problems
  const totalMax = 220;
  const totalPercentage = Math.round((solved.total / totalMax) * 100);
  const strokeDashoffset = 283 - (283 * totalPercentage) / 100;

  return (
    <div className="bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Target className="w-5 h-5 text-sky-500" />
          <span>LeetCode Solved Breakdown</span>
        </h3>
        <span className="text-xs font-mono font-bold text-slate-500">
          Rank: <strong className="text-sky-600">{user.rank}</strong>
        </span>
      </div>

      {/* Main LeetCode Style Circular Progress Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        
        {/* Left: Circular Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-amber-50/40 border border-amber-200 rounded-2xl relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-amber-100/80"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-sky-500 transition-all duration-1000 ease-out"
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{solved.total}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Solved</span>
            <span className="text-[10px] text-sky-600 font-mono font-bold">/ {totalMax}</span>
          </div>
        </div>

        {/* Right: Difficulty Progress Bars (LeetCode colors) */}
        <div className="sm:col-span-7 space-y-4">
          
          {/* Easy Bar (LeetCode Teal Green: #00b8a3) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#00b8a3] font-extrabold">Easy</span>
              <span className="text-slate-700 font-mono font-bold">{solved.easy} <span className="text-slate-400">/ 100</span></span>
            </div>
            <div className="w-full bg-amber-50/80 h-2.5 rounded-full overflow-hidden border border-amber-200">
              <div
                className="bg-[#00b8a3] h-full rounded-full transition-all duration-500"
                style={{ width: `${easyRatio}%` }}
              />
            </div>
          </div>

          {/* Medium Bar (LeetCode Yellow/Amber: #ffc01e) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#d97706] font-extrabold">Medium</span>
              <span className="text-slate-700 font-mono font-bold">{solved.medium} <span className="text-slate-400">/ 80</span></span>
            </div>
            <div className="w-full bg-amber-50/80 h-2.5 rounded-full overflow-hidden border border-amber-200">
              <div
                className="bg-[#ffc01e] h-full rounded-full transition-all duration-500"
                style={{ width: `${mediumRatio}%` }}
              />
            </div>
          </div>

          {/* Hard Bar (LeetCode Red: #ff375f) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#ff375f] font-extrabold">Hard</span>
              <span className="text-slate-700 font-mono font-bold">{solved.hard} <span className="text-slate-400">/ 40</span></span>
            </div>
            <div className="w-full bg-amber-50/80 h-2.5 rounded-full overflow-hidden border border-amber-200">
              <div
                className="bg-[#ff375f] h-full rounded-full transition-all duration-500"
                style={{ width: `${hardRatio}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
