import React from 'react';
import { LeaderboardEntry } from '../../types/contest';
import { Trophy, Medal, Award, Minus } from 'lucide-react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  problemLetters?: string[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  problemLetters = ['A', 'B', 'C', 'D'],
}) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="font-mono text-sm font-bold text-slate-500">#{rank}</span>;
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full bg-white border border-amber-200/90 rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-50/70 border-b border-amber-200 text-xs font-bold text-slate-700 uppercase tracking-wider font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <th className="py-4 px-4 text-center w-16">Rank</th>
              <th className="py-4 px-4">Coder Name & Handle</th>
              <th className="py-4 px-4 text-center">Score</th>
              <th className="py-4 px-4 text-center">Penalty</th>
              {problemLetters.map((letter) => (
                <th key={letter} className="py-4 px-4 text-center w-20">
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 text-xs">
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                className={`hover:bg-amber-50/40 transition-colors ${
                  entry.userId === 'user_1' ? 'bg-sky-50/50 border-l-4 border-l-sky-500' : ''
                }`}
              >
                {/* Rank */}
                <td className="py-3.5 px-4 text-center font-bold">
                  <div className="flex items-center justify-center">{getRankBadge(entry.rank)}</div>
                </td>

                {/* Name & Handle */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 border border-sky-400 text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                      {getInitials(entry.name || entry.username)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                        {entry.name || entry.username}
                      </p>
                      <span className="text-[11px] text-sky-600 font-mono">@{entry.username} • Rating: {entry.rating}</span>
                    </div>
                  </div>
                </td>

                {/* Score */}
                <td className="py-3.5 px-4 text-center text-base font-bold text-emerald-600 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  {entry.totalScore} pts
                </td>

                {/* Penalty */}
                <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                  {entry.totalPenalty}m
                </td>

                {/* Problem Matrix */}
                {problemLetters.map((letter) => {
                  const res = entry.problemResults[letter];
                  if (!res || res.attempts === 0) {
                    return (
                      <td key={letter} className="py-3.5 px-4 text-center text-slate-300">
                        <Minus className="w-4 h-4 mx-auto" />
                      </td>
                    );
                  }

                  if (res.solved) {
                    return (
                      <td key={letter} className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
                          <span className="font-bold text-xs font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>AC</span>
                          <span className="text-[10px] text-emerald-600 font-mono">
                            {res.solvedTimeMinutes}m ({res.attempts})
                          </span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={letter} className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-mono">
                        <span className="font-bold text-xs">-{res.attempts}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
