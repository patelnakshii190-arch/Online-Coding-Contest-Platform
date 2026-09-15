import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProblemForm } from '../components/admin/ProblemForm';
import { Problem } from '../types/problem';
import { Contest } from '../types/contest';
import { Submission } from '../types/submission';
import { ApiService } from '../services/api';
import { 
  Shield, 
  Plus, 
  List, 
  Edit3, 
  Trash2, 
  Search, 
  AlertTriangle, 
  Code2, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle,
  Clock,
  HardDrive,
  Trophy,
  BookOpen,
  X,
  FileCode,
  User as UserIcon,
  Activity,
  Database,
  LayoutDashboard,
  Lock,
  ChevronRight,
  UserPlus,
  Sparkles
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'create_challenge' | 'contests' | 'submissions'>('overview');
  
  // Data States
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null);
  const [viewingExplanation, setViewingExplanation] = useState<Problem | null>(null);
  const [inspectingSubmission, setInspectingSubmission] = useState<Submission | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // New Contest Modal Form State
  const [showCreateContestModal, setShowCreateContestModal] = useState(false);
  const [contestTitle, setContestTitle] = useState('');
  const [contestSlug, setContestSlug] = useState('');
  const [contestDesc, setContestDesc] = useState('');
  const [contestStatus, setContestStatus] = useState<'UPCOMING' | 'LIVE' | 'ENDED'>('UPCOMING');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [probData, contestData, subData] = await Promise.all([
        ApiService.getAdminProblems().catch(() => []),
        ApiService.getContests().catch(() => []),
        ApiService.getAllSubmissions().catch(() => [])
      ]);
      setProblems(probData);
      setContests(contestData);
      setSubmissions(subData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  // Access Denied Guard Screen
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white border border-rose-200 rounded-3xl shadow-xl space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
          Admin Access Restricted
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal is restricted exclusively to authorized platform administrators. Please sign in with administrator credentials from the Admin Department to access the control panel.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 font-serif"
        >
          Return to Platform Home
        </a>
      </div>
    );
  }

  const handleDeleteProblem = async (prob: Problem) => {
    try {
      const targetId = prob.problemId || prob.id || prob.slug;
      await ApiService.deleteProblem(targetId);
      setActionSuccess(`Problem "${prob.title}" deleted from database.`);
      setDeletingProblem(null);
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete problem.');
    }
  };

  const handleDeleteContest = async (contestId: string) => {
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    try {
      await ApiService.deleteContest(contestId);
      setActionSuccess('Contest deleted successfully.');
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete contest.');
    }
  };

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slugVal = contestSlug || contestTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await ApiService.createContest({
        title: contestTitle,
        slug: slugVal,
        description: contestDesc,
        status: contestStatus,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        registeredCount: 0,
        problems: [],
        rules: ['5 minute penalty per wrong submission', 'ICPC standard scoring']
      });
      setActionSuccess(`Contest "${contestTitle}" created successfully!`);
      setShowCreateContestModal(false);
      setContestTitle('');
      setContestSlug('');
      setContestDesc('');
      fetchAdminData();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to create contest.');
    }
  };



  const startEditProblem = (prob: Problem) => {
    setEditingProblem(prob);
    setActiveTab('create_challenge');
  };

  const filteredProblems = problems.filter((p) => {
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffdf0] text-slate-800 font-sans pb-16">
      
      {/* Enterprise Admin Header Banner */}
      <div className="bg-purple-950 text-white border-b border-purple-900 px-6 py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 border border-purple-400 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  QuantumArena Admin Control Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-mono font-bold">
                  Admin Department
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Logged in Administrator: <strong className="text-white font-mono">{user.name || user.username}</strong> (<span className="text-purple-300">{user.email}</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setEditingProblem(null);
                setActiveTab('create_challenge');
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition-all font-serif"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Code Challenge</span>
            </button>

            <button
              onClick={() => setShowCreateContestModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all font-serif"
              style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              <Trophy className="w-4 h-4" />
              <span>Create Contest</span>
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Main Admin Dashboard Workspace Layout (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-2">
            <p className="px-3 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              Admin Controls
            </p>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Console Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setEditingProblem(null);
                  setActiveTab('challenges');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'challenges'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Code2 className="w-4 h-4" />
                  <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Code Challenges ({problems.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setEditingProblem(null);
                  setActiveTab('create_challenge');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'create_challenge'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Plus className="w-4 h-4" />
                  <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    {editingProblem ? 'Edit Challenge' : 'Add Code Challenge'}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('contests')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'contests'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Contests ({contests.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('submissions')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'submissions'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileCode className="w-4 h-4 text-sky-500" />
                  <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Participant Code ({submissions.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

            </nav>
          </div>

          {/* Logged in Admin Card */}
          <div className="p-5 bg-white border border-amber-200/90 rounded-3xl space-y-3 shadow-xs font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin Identity</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="border-b border-amber-100 pb-1.5">
                <span className="text-slate-400 block text-[10px]">FULL NAME:</span>
                <span className="font-bold text-slate-900 text-xs">{user.name || user.username}</span>
              </div>
              <div className="border-b border-amber-100 pb-1.5">
                <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS:</span>
                <span className="font-bold text-purple-700">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SYSTEM ROLE:</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200 text-[10px] font-bold">
                  ADMINISTRATOR
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Tab 1: Overview Dashboard Telemetry */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-sky-600">
                    <Code2 className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">DATABASE</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono">{problems.length}</p>
                  <p className="text-xs text-slate-500 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Code Challenges</p>
                </div>

                <div className="p-5 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-amber-600">
                    <Trophy className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">CONTESTS</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono">{contests.length}</p>
                  <p className="text-xs text-slate-500 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Live & Scheduled</p>
                </div>

                <div className="p-5 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-purple-600">
                    <FileCode className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">AUDIT</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono">{submissions.length}</p>
                  <p className="text-xs text-slate-500 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Submitted Code Tests</p>
                </div>

                <div className="p-5 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-600">
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">AUTHENTICATED</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 font-sans truncate">{user.name || user.username}</p>
                  <p className="text-xs text-slate-500 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Admin Department</p>
                </div>
              </div>

              {/* Quick Controls */}
              <div className="p-8 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center space-x-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Admin Console Quick Controls</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Welcome <strong>{user.name || user.username}</strong>! Use the left navigation controls to perform real-time code challenge additions, edit code logic editorials, remove outdated challenges, and inspect participant contest code submissions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <button
                    onClick={() => {
                      setEditingProblem(null);
                      setActiveTab('create_challenge');
                    }}
                    className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-left space-y-1.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-purple-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Add Code Challenge</p>
                    <p className="text-[11px] text-purple-700">Publish problem, starter code, test cases, and solution explanation.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left space-y-1.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-amber-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Edit & Remove Code</p>
                    <p className="text-[11px] text-amber-700">Modify existing challenges and manage hidden testcases.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="p-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-2xl text-left space-y-1.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-sky-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Inspect Participant Code</p>
                    <p className="text-[11px] text-sky-700">Review real-time participant contest submissions.</p>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Code Challenges Table */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              
              <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search code challenge title or slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <span className="text-xs font-bold text-slate-500 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Difficulty:</span>
                  {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        difficultyFilter === diff
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-xs">
                {loading ? (
                  <div className="p-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-mono">Fetching database challenges from MongoDB Atlas...</p>
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Code2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No code challenges found</p>
                    <button
                      onClick={() => {
                        setEditingProblem(null);
                        setActiveTab('create_challenge');
                      }}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold font-serif"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Code Challenge</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-amber-50/60 border-b border-amber-200 text-slate-900 font-bold uppercase tracking-wider font-mono text-[11px]">
                        <tr>
                          <th className="px-6 py-3.5">ID / Challenge Title</th>
                          <th className="px-4 py-3.5">Difficulty</th>
                          <th className="px-4 py-3.5">Category & Tags</th>
                          <th className="px-4 py-3.5">Test Suite</th>
                          <th className="px-4 py-3.5">Solution Editorial</th>
                          <th className="px-6 py-3.5 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {filteredProblems.map((prob) => (
                          <tr key={prob.id || prob.slug} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 text-sm font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                                {prob.title}
                              </div>
                              <div className="text-[11px] font-mono text-purple-700 mt-0.5">
                                ID: {prob.problemId || prob.id} • /{prob.slug}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                                prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {prob.difficulty}
                              </span>
                            </td>

                            <td className="px-4 py-4 space-y-1">
                              <div className="font-semibold text-slate-800">{prob.category}</div>
                              <div className="flex flex-wrap gap-1">
                                {prob.tags?.map((t, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-amber-100/60 text-[10px] font-mono text-slate-600 border border-amber-200">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-4 py-4 space-y-1">
                              <div className="flex items-center space-x-1.5 text-xs text-sky-700 font-mono">
                                <Eye className="w-3.5 h-3.5 text-sky-500" />
                                <span>Sample: {prob.sampleTestCases?.length || 0}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-xs text-purple-700 font-mono">
                                <EyeOff className="w-3.5 h-3.5 text-purple-500" />
                                <span>Hidden: {prob.hiddenTestCases?.length || 0}</span>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              {prob.solutionExplanation ? (
                                <button
                                  onClick={() => setViewingExplanation(prob)}
                                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                                  <span>View Explanation</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono italic">No Explanation Yet</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => startEditProblem(prob)}
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white border border-sky-200 rounded-xl text-xs font-bold transition-all"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Code</span>
                                </button>

                                <button
                                  onClick={() => setDeletingProblem(prob)}
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl text-xs font-bold transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Create / Edit Code Challenge Form */}
          {activeTab === 'create_challenge' && (
            <ProblemForm
              problemToEdit={editingProblem}
              onSuccess={() => {
                setEditingProblem(null);
                setActiveTab('challenges');
                fetchAdminData();
              }}
              onCancel={() => {
                setEditingProblem(null);
                setActiveTab('challenges');
              }}
            />
          )}

          {/* Tab 4: Contests Management */}
          {activeTab === 'contests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-white border border-amber-200 rounded-3xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    Contest Operations & Schedule
                  </h3>
                  <p className="text-xs text-slate-500">Create, edit, or delete timed competitive programming contests.</p>
                </div>
                <button
                  onClick={() => setShowCreateContestModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Contest</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contests.map((c) => (
                  <div key={c.id} className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border font-mono ${
                          c.status === 'LIVE' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {c.status}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">ID: {c.contestId || c.id} • /{c.slug}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteContest(c.contestId || c.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600">{c.description}</p>

                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs font-mono flex items-center justify-between">
                      <span>Registered Coders: {c.registeredCount || 0}</span>
                      <span>Problems: {c.problems?.length || 4}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Access Participant Contest Code Submissions */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                  Participant Contest Code Inspector & Submissions Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect source code submitted by competitors, judge execution verdicts, runtimes, and memory usage.
                </p>
              </div>

              <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-xs">
                {submissions.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500 font-mono">
                    No contest submissions recorded yet. Submissions will appear here in real-time.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-amber-50/60 border-b border-amber-200 text-slate-900 font-bold uppercase tracking-wider font-mono text-[11px]">
                        <tr>
                          <th className="px-6 py-3.5">Submission ID / User</th>
                          <th className="px-4 py-3.5">Challenge</th>
                          <th className="px-4 py-3.5">Language</th>
                          <th className="px-4 py-3.5">Verdict</th>
                          <th className="px-4 py-3.5">Runtime / Memory</th>
                          <th className="px-6 py-3.5 text-right">Source Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 font-mono text-xs">
                        {submissions.map((sub) => (
                          <tr key={sub.id || sub.submissionId} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 font-sans">{sub.username || sub.userName || 'Coder'}</div>
                              <div className="text-[11px] text-purple-700">{sub.submissionId || sub.id}</div>
                            </td>

                            <td className="px-4 py-4 font-sans font-bold text-slate-800">
                              {sub.problemTitle || sub.problemId}
                            </td>

                            <td className="px-4 py-4 uppercase font-bold text-sky-700">
                              {sub.language}
                            </td>

                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                sub.verdict === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {sub.verdict}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {sub.runtimeMs}ms • {sub.memoryMB}MB
                            </td>

                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setInspectingSubmission(sub)}
                                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1"
                              >
                                <FileCode className="w-3.5 h-3.5" />
                                <span>Inspect Code</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}



        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-amber-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 font-serif">Remove Code Challenge</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{deletingProblem.title}"</strong> from MongoDB Atlas? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingProblem(null)}
                className="px-4 py-2 rounded-xl bg-amber-50 text-slate-700 text-xs font-bold border border-amber-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProblem(deletingProblem)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Remove Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Explanation / Editorial Modal */}
      {viewingExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-purple-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 font-sans max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center space-x-2 text-purple-700">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Solution Explanation: {viewingExplanation.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingExplanation(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-amber-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
              {viewingExplanation.solutionExplanation || 'No solution explanation added yet.'}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setViewingExplanation(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Code Modal */}
      {inspectingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 border border-purple-700 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 font-mono max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  <span>Submitted Contest Code ({inspectingSubmission.language.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Coder: <strong>{inspectingSubmission.username || inspectingSubmission.userName}</strong> • Problem: <strong>{inspectingSubmission.problemTitle}</strong>
                </p>
              </div>
              <button
                onClick={() => setInspectingSubmission(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-300 font-sans">
              <span>Verdict: <strong className={inspectingSubmission.verdict === 'ACCEPTED' ? 'text-emerald-400' : 'text-rose-400'}>{inspectingSubmission.verdict}</strong></span>
              <span>Runtime: {inspectingSubmission.runtimeMs}ms</span>
              <span>Memory: {inspectingSubmission.memoryMB}MB</span>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-emerald-400 leading-relaxed overflow-x-auto">
              {inspectingSubmission.code}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectingSubmission(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold font-sans"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contest Modal */}
      {showCreateContestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleCreateContest} className="bg-white border border-amber-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Create New Contest</h3>
              <button type="button" onClick={() => setShowCreateContestModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contest Title</label>
              <input
                type="text"
                required
                value={contestTitle}
                onChange={(e) => setContestTitle(e.target.value)}
                placeholder="e.g. Weekly Quantum Championship #12"
                className="w-full px-3 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={contestDesc}
                onChange={(e) => setContestDesc(e.target.value)}
                placeholder="Timed 2-hour competitive programming round..."
                className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={contestStatus}
                onChange={(e) => setContestStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="LIVE">LIVE NOW</option>
                <option value="ENDED">ENDED</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowCreateContestModal(false)} className="px-4 py-2 bg-amber-50 text-slate-700 text-xs font-bold rounded-xl border border-amber-200">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md">
                Publish Contest
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
