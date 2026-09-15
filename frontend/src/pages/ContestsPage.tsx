import React, { useEffect, useState } from 'react';
import { Contest } from '../types/contest';
import { ApiService } from '../services/api';
import { ContestCard } from '../components/contests/ContestCard';
import { Trophy, Sparkles } from 'lucide-react';

export const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'ENDED'>('ALL');

  useEffect(() => {
    ApiService.getContests().then(setContests);
  }, []);

  const handleRegisterToggle = (contestId: string) => {
    setContests((prev) =>
      prev.map((c) => {
        if (c.id === contestId) {
          const nextRegistered = !c.isRegistered;
          return {
            ...c,
            isRegistered: nextRegistered,
            registeredCount: nextRegistered ? c.registeredCount + 1 : c.registeredCount - 1,
          };
        }
        return c;
      })
    );
  };

  const filteredContests = contests.filter((c) => {
    if (activeTab === 'ALL') return true;
    return c.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-white border border-amber-200/80 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-300 text-sky-800 text-xs font-bold mb-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Competitive Contest Arena</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Trophy className="w-8 h-8 text-amber-500" />
              <span>Coding Contests & Competitions</span>
            </h1>
            <p className="text-sm text-slate-600">
              Participate in timed ICPC & Codeforces style programming contests to gain global rating points on QuantumArena.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-2 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200">
            {(['ALL', 'LIVE', 'UPCOMING', 'ENDED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((c) => (
          <ContestCard key={c.id} contest={c} onRegisterToggle={handleRegisterToggle} />
        ))}
      </div>

    </div>
  );
};
