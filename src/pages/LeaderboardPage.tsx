import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types/contest';
import { ApiService } from '../services/api';
import { LeaderboardTable } from '../components/contests/LeaderboardTable';
import { Trophy, Search, Sparkles } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContest, setSelectedContest] = useState('Global Rating');

  useEffect(() => {
    ApiService.getLeaderboard().then(setEntries);
  }, []);

  const filteredEntries = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-white border border-amber-200/80 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-300 text-sky-800 text-xs font-bold mb-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Real-Time Coder Rankings</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Trophy className="w-8 h-8 text-amber-500" />
              <span>Global Leaderboard</span>
            </h1>
            <p className="text-sm text-slate-600">
              Track global ratings, solved score totals, and live contest standings of top Indian coders.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200">
            {['Global Rating', 'Weekly Contest 42', 'Starter 110'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedContest(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedContest === tab
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md pt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coders by name or handle..."
            className="w-full pl-10 pr-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          />
        </div>
      </div>

      {/* Leaderboard Table Component */}
      <LeaderboardTable entries={filteredEntries} />

    </div>
  );
};
