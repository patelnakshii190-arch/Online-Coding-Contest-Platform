import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Problem } from '../types/problem';
import { Contest, LeaderboardEntry } from '../types/contest';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { ProblemCard } from '../components/problems/ProblemCard';
import { ContestCard } from '../components/contests/ContestCard';
import { Hero3DCanvas } from '../components/common/Hero3DCanvas';
import { Card3D } from '../components/common/Card3D';
import { mockLeaderboard } from '../data/mockLeaderboard';
import { 
  Code2, 
  Trophy, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Cpu,
  Zap,
  Users,
  CheckCircle2,
  Activity,
  Shield,
  Lock,
  Flame,
  BarChart3,
  Award,
  Brain,
  Clock,
  Star,
  CheckCircle,
  Layers
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProblems, setFeaturedProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dailyProblem, setDailyProblem] = useState<Problem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin'>('login');

  useEffect(() => {
    ApiService.getProblems().then((probs) => {
      setFeaturedProblems(probs.slice(0, 4));
      if (probs.length > 0) {
        setDailyProblem(probs[0]);
      }
    });
    ApiService.getContests().then((cList) => setContests(cList));
    ApiService.getLeaderboard().then((lb) => setLeaderboard(lb.slice(0, 5))).catch(() => setLeaderboard(mockLeaderboard.slice(0, 5)));
  }, []);

  const openAuth = (tab: 'login' | 'register' | 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-16 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* HERO BANNER SECTION WITH 3D CANVAS & BLURRED STUDENT PHOTO */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-amber-200/80">
        {/* Interactive 3D WebGL / Canvas Algorithm Particle Mesh */}
        <Hero3DCanvas />

        {/* High-Resolution Professional Coding Students Background Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[5px] scale-105 opacity-30 transition-all duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')` }}
        />
        
        {/* Soft Multi-Color Gradient Overlay for Crisp Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-sky-50/70 to-[#fffdf0]/95" />
        
        {/* Ambient Glowing Light Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-400/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="max-w-5xl mx-auto relative z-10 px-4">
          <Card3D intensity={8}>
            <div className="p-8 md:p-12 rounded-3xl bg-white/85 backdrop-blur-lg border border-white/90 shadow-3d-lg border-glow-3d text-center space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-300/80 text-sky-800 text-xs font-bold shadow-xs font-mono animate-bounce">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Next-Gen 3D Competitive Programming Engine</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                Master Algorithms.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600">
                  Compete in Real-Time 3D Contests.
                </span>
              </h1>

              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Practice multi-language coding challenges, participate in timed ICPC/LeetCode style contests, execute code instantly with isolated judges, and climb global leaderboards.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  to="/problems"
                  className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-500/35 hover:shadow-sky-500/50 hover:scale-105 flex items-center space-x-2 group font-serif"
                  style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                >
                  <span>Start Solving Problems</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contests"
                  className="px-8 py-3.5 bg-white/90 hover:bg-amber-50 text-slate-800 border border-amber-300 font-bold text-sm rounded-xl transition-all shadow-xs hover:scale-105 flex items-center space-x-2 font-serif"
                  style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Explore Contests</span>
                </Link>
              </div>

            </div>
          </Card3D>
        </div>
      </section>

      {/* PLATFORM STATS TICKER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/90 backdrop-blur-sm border border-amber-200/90 rounded-2xl shadow-xs">
          <div className="text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">1,200+</span>
            <p className="text-xs text-slate-500 font-semibold uppercase">Coding Challenges</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-sky-600 font-mono">45,000+</span>
            <p className="text-xs text-slate-500 font-semibold uppercase">Active Competitors</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 font-mono">1.2M+</span>
            <p className="text-xs text-slate-500 font-semibold uppercase">Submissions Judged</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-600 font-mono">&lt; 50ms</span>
            <p className="text-xs text-slate-500 font-semibold uppercase">Judge Execution Latency</p>
          </div>
        </div>
      </section>

      {/* EXTRA 1: PROBLEM OF THE DAY HIGHLIGHT BANNER WITH BLURRED STUDENT BACKDROP */}
      {dailyProblem && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-amber-600/90 via-amber-700/90 to-orange-700/90 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/80">
            {/* Background student photo with blur */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm scale-105 opacity-25"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop')` }}
            />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-extrabold font-mono flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-200 fill-amber-300" />
                  PROBLEM OF THE DAY
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-100 text-[10px] font-bold font-mono">
                  +50 STREAK XP BONUS
                </span>
              </div>

              <h3 className="text-2xl font-bold font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                {dailyProblem.title}
              </h3>
              <p className="text-xs text-amber-100 max-w-2xl leading-relaxed line-clamp-2">
                {dailyProblem.description}
              </p>

              <div className="flex items-center space-x-4 text-xs font-mono pt-1 text-amber-100">
                <span>Difficulty: <strong className="text-white">{dailyProblem.difficulty}</strong></span>
                <span>•</span>
                <span>Category: <strong className="text-white">{dailyProblem.category}</strong></span>
                <span>•</span>
                <span>Time Limit: <strong className="text-white">{dailyProblem.timeLimitSec || 1.0}s</strong></span>
              </div>
            </div>

            <Link
              to={`/problems/${dailyProblem.slug}`}
              className="relative z-10 px-6 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl shadow-lg transition-all whitespace-nowrap flex items-center space-x-2 font-serif"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              <span>Solve Today's Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* FEATURED CONTESTS (CHAMPIONSHIPS) SECTION */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Active & Upcoming Contests</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Join timed programming competitions to test your speed and boost your global rating.
            </p>
          </div>

          <Link
            to="/contests"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>View All Contests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contests.map((c) => (
            <Card3D key={c.id} intensity={10}>
              <ContestCard contest={c} />
            </Card3D>
          ))}
        </div>
      </section>

      {/* POPULAR PRACTICE PROBLEMS (TESTS & CHALLENGES) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Code2 className="w-6 h-6 text-sky-500" />
              <span>Popular Algorithmic Problems</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Hand-crafted data structures and algorithm problems with multi-language starter templates and AI hints.
            </p>
          </div>

          <Link
            to="/problems"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>Explore All Problems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredProblems.map((prob) => (
            <Card3D key={prob.id} intensity={8}>
              <ProblemCard problem={prob} />
            </Card3D>
          ))}
        </div>
      </section>

      {/* EXTRA 2: TOP PERFORMERS & GLOBAL LEADERBOARD SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <span>Top Global Competitors</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Rankings of top algorithm master competitors across global contests.
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>Full Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-amber-200 rounded-3xl overflow-hidden shadow-3d-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-amber-50/60 border-b border-amber-200 text-slate-900 font-bold uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Global Rank</th>
                  <th className="px-6 py-3.5">Competitor Name</th>
                  <th className="px-4 py-3.5">Rating Points</th>
                  <th className="px-4 py-3.5">Total Contest Score</th>
                  <th className="px-6 py-3.5 text-right">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 font-sans">
                {leaderboard.map((entry) => (
                  <tr key={entry.userId || entry.rank} className="hover:bg-amber-50/60 transition-all hover:scale-[1.005]">
                    <td className="px-6 py-4 font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        entry.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-md animate-pulse' :
                        entry.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        entry.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-amber-50 text-slate-600 border border-amber-200'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 font-serif text-sm" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                        {entry.name}
                      </div>
                      <div className="text-[11px] font-mono text-sky-600">@{entry.username}</div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-purple-700">
                      {entry.rating} pts
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-emerald-700">
                      {entry.totalScore} pts
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Grandmaster</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EXTRA 3: PLATFORM CAPABILITIES & FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold font-mono">
            ENGINE CAPABILITIES
          </span>
          <h2 className="text-3xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Built for High-Performance Competitive Coding
          </h2>
          <p className="text-xs text-slate-600">
            Everything you need to practice, compete, and improve your problem-solving skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <Card3D intensity={12}>
            <div className="p-6 bg-white/90 backdrop-blur-md border border-amber-200 rounded-3xl space-y-3 shadow-3d-lg hover:border-sky-400 transition-all h-full">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shadow-md">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                Multi-Language Judge Sandbox
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compile and run C++, Java, Python, and JavaScript code against hidden test cases with execution time limits and memory caps.
              </p>
            </div>
          </Card3D>

          <Card3D intensity={12}>
            <div className="p-6 bg-white/90 backdrop-blur-md border border-amber-200 rounded-3xl space-y-3 shadow-3d-lg hover:border-amber-400 transition-all h-full">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                ICPC Contest Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Participate in timed rounds with automatic penalty calculation, live scoreboards, and anti-cheat tracking.
              </p>
            </div>
          </Card3D>

          <Card3D intensity={12}>
            <div className="p-6 bg-white/90 backdrop-blur-md border border-amber-200 rounded-3xl space-y-3 shadow-3d-lg hover:border-purple-400 transition-all h-full">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                AI Assistant & Hints
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get step-by-step algorithmic hints and code debugging guidance without revealing complete solution spoilers.
              </p>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ADMIN PORTAL ACCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 border border-purple-800/60 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold font-mono border border-purple-500/30 flex items-center gap-1.5 w-fit">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              ADMINISTRATOR CONTROL CENTER
            </span>
            <h3 className="text-2xl font-bold font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              Platform Administration & Content Management
            </h3>
            <p className="text-xs text-purple-200/80 max-w-xl leading-relaxed">
              Restricted to authorized platform administrators. Access problem creation tools, contest management, security logs, and user submission audits.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'admin' ? (
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow-lg shadow-purple-600/30 font-serif"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                <Shield className="w-4 h-4" />
                <span>Open Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuth('admin')}
                className="px-6 py-3 bg-purple-900/90 hover:bg-purple-800 text-purple-100 border border-purple-600 rounded-xl font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow-md font-serif"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                <Lock className="w-4 h-4 text-purple-300" />
                <span>Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 border border-sky-700/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-bold font-mono border border-sky-400/30">
              SYSTEM ARCHITECTURE
            </span>
            <h3 className="text-2xl font-bold font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Curious How Full-Stack Contest Platforms Work?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Explore our step-by-step architecture guide explaining REST APIs, WebSocket live leaderboards, Express backend services, Docker sandbox security, and database models!
            </p>
          </div>

          <Link
            to="/architecture"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow-lg shadow-sky-500/25 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <Cpu className="w-4 h-4" />
            <span>Read Architecture Breakdown</span>
          </Link>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};

