import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  X, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  RotateCcw,
  Copy,
  Check,
  Code2,
  Radar,
  Radio,
  Sliders,
  Layers,
  Send,
  Atom
} from 'lucide-react';

interface DiagnosticLog {
  id: string;
  type: 'system' | 'ai' | 'user';
  title?: string;
  content: string;
  timestamp: string;
  metricLabel?: string;
  metricVal?: string;
}

interface CyberNeuralHUDProps {
  isOpen: boolean;
  onClose: () => void;
  currentProblemTitle?: string;
  currentCode?: string;
  currentLanguage?: string;
}

export const CyberNeuralHUD: React.FC<CyberNeuralHUDProps> = ({
  isOpen,
  onClose,
  currentProblemTitle = 'QUANTUM_MODULE_01',
  currentCode = '',
  currentLanguage = 'cpp'
}) => {
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      id: 'hud-1',
      type: 'system',
      title: 'CYBER_NEURAL_LINK :: ESTABLISHED',
      content: `Quantum Core connected to [${currentProblemTitle}] in engine language [${currentLanguage.toUpperCase()}].\n\nNeural telemetry is monitoring memory bounds, execution velocity, and asymptotic complexity in real-time.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      metricLabel: 'NEURAL_LINK_STABILITY',
      metricVal: '99.8%'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'radar' | 'scan'>('telemetry');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const triggerDiagnostic = (actionType: 'hint' | 'scan' | 'radar' | 'deconstruct') => {
    setIsProcessing(true);

    let title = '';
    let content = '';
    let metricLabel = '';
    let metricVal = '';

    setTimeout(() => {
      switch (actionType) {
        case 'hint':
          title = '💡 HOLOGRAPHIC HINT TRACE';
          content = `### 1. Monotonic / State Transition Identification\nObserve structural properties of target constraints for [${currentProblemTitle}].\n\n### 2. Space-Time Optimization\nUsing a Hash Map or Double Pointers reduces lookup iterations from O(N²) down to linear O(N).\n\n### 3. Edge-Guard Protection\nGuard against empty inputs, single element boundaries, or integer overflow.`;
          metricLabel = 'SOLVE_PROBABILITY';
          metricVal = '88.4%';
          break;
        case 'scan':
          title = '🛡️ EDGE-CASE VULNERABILITY SCAN';
          content = `Scanning user source code payload (${currentLanguage.toUpperCase()}):\n\n\`\`\`${currentLanguage}\n${currentCode.slice(0, 180) || '// Standard Template Loaded'}...\n\`\`\`\n\n- **Null Pointer / Index Guard**: Check bounds before accessing \`i + 1\`.\n- **Integer Overflow**: Ensure sums fit within standard numeric limits.\n- **Termination Condition**: Loop exit criteria verified clean.`;
          metricLabel = 'SECURITY_SCORE';
          metricVal = '94 / 100';
          break;
        case 'radar':
          title = '⚡ ASYMPTOTIC COMPLEXITY RADAR';
          content = `- **Estimated Time Bound**: O(N) linear pass\n- **Auxiliary Memory Usage**: O(1) constant or O(N) hash space\n- **CPU Cycle Efficiency**: Peak throughput achieved under 1.0s limit.`;
          metricLabel = 'TIME_COMPLEXITY';
          metricVal = 'O(N)';
          break;
        case 'deconstruct':
          title = '🔬 LOGIC DECONSTRUCTION MATRIX';
          content = `1. **Standard I/O Ingestion**: Parse parameters from stdin.\n2. **Execution Traversal**: Process state transitions line-by-line.\n3. **Verdict Evaluation**: Output formatted response matching testcase specs.`;
          metricLabel = 'LOGIC_COHERENCE';
          metricVal = '100%';
          break;
      }

      const newLog: DiagnosticLog = {
        id: `log-${Date.now()}`,
        type: 'ai',
        title,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        metricLabel,
        metricVal
      };

      setLogs((prev) => [...prev, newLog]);
      setIsProcessing(false);
    }, 700);
  };

  const handleCustomQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userLog: DiagnosticLog = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setLogs((prev) => [...prev, userLog]);
    setInputVal('');
    setIsProcessing(true);

    setTimeout(() => {
      const aiLog: DiagnosticLog = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        title: '🤖 CYBER_NEURAL RESPONSE',
        content: `Analyzing query for [${currentProblemTitle}]...\n\n- Key algorithm recommendation: Maintain clean pointer bounds and leverage standard data structures.\n- Would you like to execute an **Edge-Case Scan** or **Asymptotic Radar** on your active editor code?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        metricLabel: 'RESPONSE_LATENCY',
        metricVal: '14ms'
      };

      setLogs((prev) => [...prev, aiLog]);
      setIsProcessing(false);
    }, 800);
  };

  const copyLog = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] md:w-[500px] bg-[#05070f]/95 backdrop-blur-2xl text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.15)] z-50 flex flex-col border-l border-cyan-500/30 animate-in slide-in-from-right duration-200">
      
      {/* Sci-Fi Cockpit HUD Header */}
      <div className="px-5 py-4 bg-[#070914] border-b border-cyan-500/30 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-mono font-black text-sm text-cyan-300 tracking-wider">CYBER_NEURAL HUD</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                v9.4_QUANTUM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">TARGET: {currentProblemTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cybernetic Status Telemetry Meter */}
      <div className="px-4 py-2 bg-[#090d1f] border-b border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold">CORE_STATUS: ONLINE</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span>CPU: <strong className="text-emerald-400">2.1%</strong></span>
          <span>MEM: <strong className="text-violet-400">42MB</strong></span>
          <span>LANG: <strong className="text-cyan-300">{currentLanguage.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* Futuristic Action Telemetry Controllers */}
      <div className="px-4 py-2.5 bg-[#070914] border-b border-cyan-500/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => triggerDiagnostic('hint')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Holographic Hint</span>
        </button>

        <button
          onClick={() => triggerDiagnostic('scan')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
          <span>Vulnerability Scan</span>
        </button>

        <button
          onClick={() => triggerDiagnostic('radar')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all"
        >
          <Radar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Asymptotic Radar</span>
        </button>

        <button
          onClick={() => triggerDiagnostic('deconstruct')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold whitespace-nowrap transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>Deconstruct Logic</span>
        </button>
      </div>

      {/* Telemetry Output Log Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex flex-col ${log.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold text-cyan-400">
                {log.type === 'user' ? 'USER_OPERATOR' : log.type === 'system' ? 'SYSTEM_CORE' : 'CYBER_NEURAL'}
              </span>
              <span className="text-[9px] text-slate-500">{log.timestamp}</span>
            </div>

            <div
              className={`relative group max-w-[95%] rounded-xl p-4 border leading-relaxed shadow-lg ${
                log.type === 'user'
                  ? 'bg-cyan-950/80 text-cyan-100 border-cyan-500/40 rounded-tr-none'
                  : 'bg-[#090d1f] text-slate-200 border-slate-800 rounded-tl-none'
              }`}
            >
              {log.title && (
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
                  <h4 className="font-bold text-cyan-300 text-xs tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" /> {log.title}
                  </h4>
                  {log.metricLabel && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {log.metricLabel}: {log.metricVal}
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans text-xs">
                {log.content.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h5 key={idx} className="font-mono font-bold text-cyan-300 text-xs mt-2 mb-1">{line.replace('### ', '')}</h5>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={idx} className="ml-2 text-slate-300 my-0.5 font-mono">• {line.replace('- ', '')}</p>;
                  }
                  return <p key={idx} className="my-0.5">{line}</p>;
                })}
              </div>

              <button
                onClick={() => copyLog(log.content, log.id)}
                className="absolute top-2 right-2 p-1 rounded bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-cyan-300"
                title="Copy log payload"
              >
                {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs py-2 px-1 font-mono">
            <div className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-spin">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span>EXECUTING_NEURAL_DIAGNOSTICS...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Command Prompt Input Area */}
      <div className="p-4 bg-[#070914] border-t border-cyan-500/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCustomQuery(inputVal);
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-3 text-cyan-400 font-mono text-xs font-bold">
            &gt;_
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Execute neural telemetry query for ${currentProblemTitle}...`}
            className="w-full pl-9 pr-12 py-3 bg-[#05070f] border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-[inner_0_0_10px_rgba(0,240,255,0.05)]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isProcessing}
            className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" /> Standard Input Context Active
          </span>
          <button
            onClick={() => setLogs([logs[0]])}
            className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Flush Buffer
          </button>
        </div>
      </div>

    </div>
  );
};
