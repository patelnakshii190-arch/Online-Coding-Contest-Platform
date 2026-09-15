import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Problem } from '../../types/problem';
import { useTheme } from '../../context/ThemeContext';
import { Play, Send, RotateCcw, Settings, Code, Copy, Check, Maximize2, Minimize2, Wand2 } from 'lucide-react';

interface CodeEditorProps {
  problem: Problem;
  language: string;
  setLanguage: (lang: string) => void;
  code: string;
  setCode: (c: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++ (GCC 12)', monacoLang: 'cpp' },
  { id: 'java', name: 'Java (OpenJDK 17)', monacoLang: 'java' },
  { id: 'python', name: 'Python 3.10', monacoLang: 'python' },
  { id: 'javascript', name: 'Node.js v20', monacoLang: 'javascript' },
  { id: 'go', name: 'Go 1.21', monacoLang: 'go' },
  { id: 'rust', name: 'Rust 1.75', monacoLang: 'rust' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  language,
  setLanguage,
  code,
  setCode,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}) => {
  const { editorTheme, fontSize, setFontSize } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update starter code when language changes
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const starter = (problem.starterTemplates as any)[newLang] || '// Write your solution here';
    setCode(starter);
  };

  const handleResetCode = () => {
    const starter = (problem.starterTemplates as any)[language] || '// Write your solution here';
    setCode(starter);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatCode = () => {
    const lines = code.split('\n').map((line) => line.trimEnd());
    setCode(lines.join('\n'));
    setFormatted(true);
    setTimeout(() => setFormatted(false), 2000);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`flex flex-col h-full bg-white border-l border-amber-200 font-sans ${
      isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
    }`}>
      
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50/60 border-b border-amber-200">
        
        {/* Language Selector & Auto-save status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-mono">
            <Code className="w-4 h-4 text-sky-500" />
            <span>Lang:</span>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white border border-amber-300 text-xs font-semibold text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 shadow-xs"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <span className="hidden md:inline-flex items-center space-x-1 text-[11px] text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Saved</span>
          </span>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            title="Format Code Indentation"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-100/80 rounded-lg transition-colors"
          >
            <Wand2 className={`w-4 h-4 ${formatted ? 'text-sky-500' : ''}`} />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-100/80 rounded-lg transition-colors text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset code to starter template"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-100/80 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-100/80 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-amber-100/80 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                <p className="font-semibold text-slate-900 mb-2">Editor Options</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-600 mb-1">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Run Code Button */}
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 text-slate-800 border border-amber-300 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Instance */}
      <div className="flex-1 w-full min-h-[350px]">
        <Editor
          height="100%"
          language={currentLangObj.monacoLang}
          theme={editorTheme}
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: fontSize,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
