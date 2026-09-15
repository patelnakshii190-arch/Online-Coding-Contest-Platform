import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Contest, LeaderboardEntry } from '../types/contest';
import { ApiService } from '../services/api';
import { ContestTimer } from '../components/contests/ContestTimer';
import { LeaderboardTable } from '../components/contests/LeaderboardTable';
import { Trophy, ArrowLeft, BarChart3, Code2, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const ContestDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'leaderboard'>('problems');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      ApiService.getContestBySlug(slug).then((data) => {
        setContest(data);
        if (data) {
          ApiService.getLeaderboard().then(setLeaderboard);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3 bg-[#fffdf0]">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Loading Contest Arena...</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white border border-amber-200 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Contest Not Found</h2>
        <Link to="/contests" className="inline-block px-5 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 font-serif">
          Return to Contests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* Contest Top Navigation & Timer */}
      <div className="p-8 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          
          <div className="space-y-2">
            <Link
              to="/contests"
              className="inline-flex items-center space-x-1.5 text-xs text-sky-600 hover:text-sky-700 font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Contests</span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Trophy className="w-7 h-7 text-amber-500" />
              <span>{contest.title}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {contest.status === 'LIVE' && <ContestTimer endTime={contest.endTime} />}
            <span className="flex items-center space-x-1 px-3 py-1 bg-sky-100 border border-sky-300 text-sky-800 text-xs font-mono font-bold rounded-xl shadow-xs">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Duration: {contest.durationMinutes}m</span>
            </span>
          </div>

        </div>

        {/* Tab Switchers */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'problems'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Contest Problems ({contest.problems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Live Standings & Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      {activeTab === 'problems' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contest.problems.map((cp) => (
              <div
                key={cp.id}
                className="p-5 bg-white border border-amber-200 hover:border-sky-300 rounded-2xl flex items-center justify-between transition-all shadow-xs hover:shadow-md group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-black text-xl text-sky-600 group-hover:scale-105 transition-transform">
                    {cp.letter}
                  </div>
                  <div>
                    <h3 
                      className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors font-serif"
                      style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                    >
                      {cp.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-xs font-mono text-slate-500">
                      <span>Points: <strong className="text-emerald-600">{cp.points}</strong></span>
                      <span>•</span>
                      <span>Difficulty: {cp.difficulty}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/problems/${cp.problemId}`}
                  className="px-4 py-2 bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white border border-sky-200 hover:border-sky-500 rounded-xl text-xs font-bold transition-all shadow-xs font-serif"
                  style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                >
                  Solve Problem {cp.letter}
                </Link>
              </div>
            ))}
          </div>

          {/* Rules Card */}
          <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Contest Rules & Regulations</h4>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 font-sans">
              {contest.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <LeaderboardTable entries={leaderboard} problemLetters={contest.problems.map((p) => p.letter)} />
        </div>
      )}

    </div>
  );
};
