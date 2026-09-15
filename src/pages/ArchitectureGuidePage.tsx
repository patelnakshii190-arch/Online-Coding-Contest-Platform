import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Server, 
  Database, 
  Box, 
  Terminal, 
  Globe, 
  CheckCircle2, 
  FileCode,
  PlusCircle,
  Zap,
  Code2,
  HelpCircle,
  BookOpen,
  Trophy,
  BarChart3
} from 'lucide-react';

export const ArchitectureGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'what-is-this' | 'architecture' | 'functions' | 'how-to-modify'>('what-is-this');
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const architectureSteps = [
    {
      id: 1,
      title: '1. Frontend Client Layer (React 18 + Monaco + Tailwind)',
      icon: Globe,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      summary: 'User interface, Monaco IDE code editor, problem browser, contest timers, and live leaderboard scoreboards.',
      details: [
        'Monaco Code Editor embeds full VS-Code editing experience with multi-language syntax highlighting, auto-completion, line numbers, and formatting.',
        'React State & Context (AuthContext & ThemeContext) handle user authentication tokens, theme preferences, role privileges (user vs admin), and streak counters.',
        'Unified API Service (src/services/api.ts) decouples UI components from networking, allowing seamless switching between local mock mode and live Express/REST backends.'
      ]
    },
    {
      id: 2,
      title: '2. REST API Gateway (Express Node.js)',
      icon: Server,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      summary: 'HTTP REST endpoints for authentication, problem lists, code execution, submission records, and leaderboard stats.',
      details: [
        'POST /api/auth/login & /api/auth/register return JWT authorization keys.',
        'GET /api/problems & GET /api/problems/:slug fetch problem metadata and multi-language starter templates.',
        'POST /api/submissions routes code execution payload to internal judge executor.'
      ]
    },
    {
      id: 3,
      title: '3. Code Execution Judge Sandbox',
      icon: Box,
      color: 'text-[#d97706] bg-amber-50 border-amber-200',
      summary: 'Compiles and executes user code in isolated sandboxes against sample & hidden test cases.',
      details: [
        'Executes Node.js / Python 3 / C++ / Java scripts with standard input piping.',
        'Measures execution time (ms) and memory utilization (MB).',
        'Yields standardized verdicts: ACCEPTED (AC), WRONG_ANSWER (WA), TIME_LIMIT_EXCEEDED (TLE), RUNTIME_ERROR (RE).'
      ]
    },
    {
      id: 4,
      title: '4. MongoDB Atlas Database Persistence Layer',
      icon: Database,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      summary: 'Stores production structured collections for users, problems, testcases, submission logs, and contest scoreboards in MongoDB Atlas.',
      details: [
        'Users Collection: id, username, email, passwordHash, rating, maxRating, streak, solvedCount.',
        'Problems Collection: problemId, title, slug, difficulty, category, constraints, sample test cases, hidden test cases, starter templates.',
        'Submissions Collection: submissionId, userId, problemId, code, language, verdict, runtimeMs, memoryMB.'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[#fffdf0] text-slate-800 min-h-screen font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-white border border-amber-200/80 rounded-3xl shadow-xs text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-100/80 border border-sky-300 text-sky-800 text-xs font-mono font-bold">
          <Cpu className="w-4 h-4 text-sky-500" />
          <span>PLATFORM GUIDE & CODE CUSTOMIZATION MANUAL</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
          How QuantumArena Works & How to Modify Code
        </h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Understand what this platform accomplishes, how every internal function operates, and learn step-by-step how to add new problems, pages, or backend endpoints.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('what-is-this')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'what-is-this'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>1. What This Website Does</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'architecture'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>2. System Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('functions')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'functions'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>3. How Functions Work</span>
          </button>

          <button
            onClick={() => setActiveTab('how-to-modify')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'how-to-modify'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>4. How to Modify Code</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WHAT THIS WEBSITE DOES */}
      {activeTab === 'what-is-this' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-8 bg-white border border-amber-200 rounded-3xl shadow-xs space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <BookOpen className="w-6 h-6 text-sky-500" />
              <span>Overview of QuantumArena</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>QuantumArena</strong> is an Online Coding Contest & Competitive Programming Platform (similar to platforms like <em>LeetCode</em> or <em>Codeforces</em>). It is designed to help software developers, students, and engineers master data structures and algorithms, practice coding interview problems, and compete in timed coding contests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>1. Problem Practice Suite</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Offers algorithmic problems across Easy, Medium, and Hard difficulties with starter code templates in <strong>C++</strong>, <strong>Java</strong>, <strong>Python 3</strong>, and <strong>JavaScript</strong>.
              </p>
            </div>

            <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>2. In-Browser Monaco IDE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Embeds the Monaco code editor (the core editor behind VS Code) allowing users to edit code, run custom test inputs, and receive instant verdict feedback.
              </p>
            </div>

            <div className="p-6 bg-white border border-amber-200 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>3. Timed Contests & Leaderboards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hosts active programming contests with live countdown timers and global leaderboard scoreboards based on total points and submission speed.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SYSTEM ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {architectureSteps.map((step) => {
              const Icon = step.icon;
              const isSelected = selectedStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-400/20'
                      : 'bg-white/70 border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{step.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Deep Dive Card */}
          {architectureSteps
            .filter((s) => s.id === selectedStep)
            .map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="p-8 bg-white border border-amber-200 rounded-3xl shadow-xs space-y-6">
                  <div className="flex items-center space-x-3 border-b border-amber-100 pb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>{step.title}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{step.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Implementation Details:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

        </div>
      )}

      {/* TAB 3: HOW FUNCTIONS WORK */}
      {activeTab === 'functions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm">
                <FileCode className="w-5 h-5" />
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>1. Code Execution & Judging</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a user clicks <strong>Run Code</strong> or <strong>Submit</strong> in Monaco Editor, `ApiService.submitCode()` posts the code snippet, target language, and testcases. The judge simulator evaluates output matching and returns execution time in milliseconds.
              </p>
            </div>

            <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm">
                <Zap className="w-5 h-5" />
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>2. Authentication & User Roles</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                `AuthContext.tsx` handles user sign-in state, JWT persistence in localStorage, and role switching (`user` vs `admin`). Administrators get access to problem creation and global user rating controls.
              </p>
            </div>

            <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-purple-600 font-bold text-sm">
                <Trophy className="w-5 h-5" />
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>3. Contest Timers & Scoreboards</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                `ContestCard.tsx` and `ContestDetailPage.tsx` run continuous interval timers calculating time remaining (`MM:SS`). Scoreboards rank participants based on total solved problem points and speed penalty.
              </p>
            </div>

            <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                <BarChart3 className="w-5 h-5" />
                <span className="font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>4. Dynamic Leaderboard Ranking</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                `LeaderboardPage.tsx` sorts global users dynamically based on rating and solved counts, awarding badges for top rankers.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: HOW TO MODIFY CODE */}
      {activeTab === 'how-to-modify' && (
        <div className="p-8 bg-white border border-amber-200 rounded-3xl shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-amber-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Developer Guide: Modifying & Extending Code</h3>
            <p className="text-xs text-slate-500 mt-1">Step-by-step instructions on adding problems, creating pages, or modifying API endpoints.</p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                <PlusCircle className="w-4 h-4 text-sky-500" />
                <span>How to Add a New Problem</span>
              </h4>
              <p>Open <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-[11px]">frontend/src/data/mockProblems.ts</code> and append a new problem object with title, slug, difficulty, sample testcases, and starter code templates.</p>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                <Globe className="w-4 h-4 text-sky-500" />
                <span>How to Add a New Page</span>
              </h4>
              <p>Create your new React component under <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-[11px]">frontend/src/pages/MyNewPage.tsx</code> and register the route in <code className="px-1.5 py-0.5 bg-white border rounded font-mono text-[11px]">frontend/src/App.tsx</code>.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
