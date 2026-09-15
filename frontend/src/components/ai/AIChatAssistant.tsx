import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Lightbulb, 
  Bug, 
  Zap, 
  BookOpen, 
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  BrainCircuit
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentProblemTitle?: string;
  currentCode?: string;
  currentLanguage?: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isOpen,
  onClose,
  currentProblemTitle = 'Coding Problem',
  currentCode = '',
  currentLanguage = 'javascript'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am **CodeArena AI**, your personal ChatGPT coding mentor. 🚀\n\nI can help you analyze algorithm complexity, find sneaky bugs in your ${currentLanguage} code, explain problem constraints, or provide step-by-step hints for **${currentProblemTitle}**. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate ChatGPT intelligent dynamic response generation
    setTimeout(() => {
      let aiReply = '';
      const query = userText.toLowerCase();

      if (query.includes('hint') || query.includes('approach')) {
        aiReply = `### 💡 Progressive Hint for ${currentProblemTitle}\n\n1. **Identify the Core Structure**: Look for overlapping subproblems or monotonic properties in the inputs.\n2. **Optimal Data Structure**: Try using a Hash Map or Two Pointers to reduce loop checks from O(N²) to O(N).\n3. **Edge Cases**: Always handle empty inputs, single element arrays, or boundary bounds explicitly!`;
      } else if (query.includes('bug') || query.includes('debug') || query.includes('error')) {
        if (currentCode.trim()) {
          aiReply = `### 🔍 Code Analysis & Potential Bug Check\n\nExamining your current **${currentLanguage}** snippet:\n\n\`\`\`${currentLanguage}\n${currentCode.slice(0, 200)}...\n\`\`\`\n\n**Observed Checks:**\n- Ensure array indexing does not overflow when \`i + 1\` is accessed.\n- Check whether null or undefined boundary guards are placed before accessing object keys.\n- Verify return value matching the required return signature.`;
        } else {
          aiReply = `### 🔍 Debugger Ready\n\nPlease paste or write your code in the editor on the left so I can perform a full dry-run analysis for bugs and edge cases!`;
        }
      } else if (query.includes('optimize') || query.includes('complexity') || query.includes('time') || query.includes('space')) {
        aiReply = `### ⚡ Complexity Analysis & Optimization Tips\n\n- **Target Time Complexity**: O(N) or O(N log N)\n- **Target Auxiliary Space**: O(1) or O(N)\n\n**Optimization Strategy:**\n- Replace nested iteration with a frequency map / hash set.\n- Use pre-computed prefix arrays or dynamic programming state tables to avoid recalculation.`;
      } else if (query.includes('explain') || query.includes('how it works')) {
        aiReply = `### 📖 Step-by-Step Problem Breakdown\n\nFor **${currentProblemTitle}**:\n1. **Input Parsing**: Receive and cast input parameters from standard input.\n2. **Algorithm Execution**: Process elements linearly or logarithmically based on state transitions.\n3. **Output Formatting**: Format indices or return boolean/numeric values as requested by standard verdict specs.`;
      } else {
        aiReply = `Great question! When solving **${currentProblemTitle}** in **${currentLanguage}**, key considerations include:\n\n- Maintaining clean memory bounds\n- Handling edge cases (e.g. zeros, empty arrays, duplicate values)\n- Leveraging standard library algorithms for efficiency.\n\nWould you like a step-by-step hint or an optimization breakdown for your current code?`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'hint':
        handleSend(`Can you give me a hint for ${currentProblemTitle}?`);
        break;
      case 'bug':
        handleSend(`Please check my ${currentLanguage} code for potential bugs or logic flaws.`);
        break;
      case 'optimize':
        handleSend(`How can I optimize the time and space complexity of my solution?`);
        break;
      case 'explain':
        handleSend(`Explain the step-by-step logic required to solve ${currentProblemTitle}.`);
        break;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] md:w-[460px] bg-slate-900 text-slate-100 shadow-2xl z-50 flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200">
      
      {/* ChatGPT Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white tracking-wide">ChatGPT Mentor</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GPT-4o
              </span>
            </div>
            <p className="text-xs text-slate-400">Context: {currentProblemTitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick AI Action Buttons */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleQuickAction('hint')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Get Hint</span>
        </button>

        <button
          onClick={() => handleQuickAction('bug')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-rose-300 border border-rose-500/20 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Find Bugs</span>
        </button>

        <button
          onClick={() => handleQuickAction('optimize')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600/30 text-sky-300 border border-sky-500/20 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Optimize</span>
        </button>

        <button
          onClick={() => handleQuickAction('explain')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explain Logic</span>
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-400">
                {msg.sender === 'user' ? 'You' : 'CodeArena AI'}
              </span>
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>

            <div
              className={`relative group max-w-[92%] rounded-2xl px-4 py-3 shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
              }`}
            >
              {/* Render formatted text content */}
              <div className="whitespace-pre-wrap">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={idx} className="font-bold text-emerald-400 text-sm mt-1 mb-2">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                    return <p key={idx} className="ml-2 font-medium text-slate-200 my-0.5">{line}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={idx} className="ml-3 text-slate-300 my-0.5">• {line.replace('- ', '')}</p>;
                  }
                  return <p key={idx} className="my-1">{line}</p>;
                })}
              </div>

              {/* Copy button */}
              <button
                onClick={() => copyToClipboard(msg.text, msg.id)}
                className="absolute top-2 right-2 p-1 rounded bg-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                title="Copy response"
              >
                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2 px-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <span>CodeArena AI is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask ChatGPT about ${currentProblemTitle}...`}
            className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-emerald-400" /> Standard Input context active
          </span>
          <button
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear Chat
          </button>
        </div>
      </div>

    </div>
  );
};
