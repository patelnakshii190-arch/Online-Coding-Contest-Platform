import React, { useState, useEffect } from 'react';
import { Problem, Difficulty, TestCase } from '../../types/problem';
import { ApiService } from '../../services/api';
import { Plus, Trash2, CheckCircle, Code2, Save, Eye, EyeOff, X, Sparkles, Layers, Clock, HardDrive, FileText, BookOpen } from 'lucide-react';

interface ProblemFormProps {
  problemToEdit?: Problem | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({ problemToEdit, onSuccess, onCancel }) => {
  const isEditMode = !!problemToEdit;

  const [title, setTitle] = useState(problemToEdit?.title || '');
  const [slug, setSlug] = useState(problemToEdit?.slug || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(problemToEdit?.difficulty || 'Easy');
  const [category, setCategory] = useState(problemToEdit?.category || 'Arrays & Hashing');
  const [tags, setTags] = useState(problemToEdit?.tags ? problemToEdit.tags.join(', ') : 'Array, Hash Table');
  const [description, setDescription] = useState(problemToEdit?.description || '');
  const [inputFormat, setInputFormat] = useState(problemToEdit?.inputFormat || 'Single line containing input s.');
  const [outputFormat, setOutputFormat] = useState(problemToEdit?.outputFormat || 'Return expected result.');
  const [constraintsText, setConstraintsText] = useState(problemToEdit?.constraints ? problemToEdit.constraints.join('\n') : '1 <= s.length <= 10^5');
  const [solutionExplanation, setSolutionExplanation] = useState(problemToEdit?.solutionExplanation || '');
  const [timeLimit, setTimeLimit] = useState(problemToEdit?.timeLimitSec || 1.0);
  const [memoryLimit, setMemoryLimit] = useState(problemToEdit?.memoryLimitMB || 256);

  const [sampleCases, setSampleCases] = useState<TestCase[]>(
    problemToEdit?.sampleTestCases && problemToEdit.sampleTestCases.length > 0
      ? problemToEdit.sampleTestCases
      : [{ id: 'tc-1', input: 'sample_input', expectedOutput: 'sample_output', isHidden: false }]
  );

  const [hiddenCases, setHiddenCases] = useState<TestCase[]>(
    problemToEdit?.hiddenTestCases && problemToEdit.hiddenTestCases.length > 0
      ? problemToEdit.hiddenTestCases
      : [{ id: 'htc-1', input: 'hidden_input_case', expectedOutput: 'hidden_output_case', isHidden: true }]
  );

  const [cppTemplate, setCppTemplate] = useState(
    problemToEdit?.starterTemplates?.cpp ||
      `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) cout << s << endl;\n    return 0;\n}`
  );
  const [pythonTemplate, setPythonTemplate] = useState(
    problemToEdit?.starterTemplates?.python ||
      `import sys\n\ndef solution(line: str):\n    return line\n\nif __name__ == "__main__":\n    line = sys.stdin.read().strip()\n    print(solution(line))`
  );
  const [jsTemplate, setJsTemplate] = useState(
    problemToEdit?.starterTemplates?.javascript ||
      `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nconsole.log(input);`
  );
  const [javaTemplate, setJavaTemplate] = useState(
    problemToEdit?.starterTemplates?.java ||
      `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) System.out.println(sc.next());\n    }\n}`
  );

  const [activeTemplateTab, setActiveTemplateTab] = useState<'cpp' | 'python' | 'javascript' | 'java'>('python');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (problemToEdit) {
      setTitle(problemToEdit.title || '');
      setSlug(problemToEdit.slug || '');
      setDifficulty(problemToEdit.difficulty || 'Easy');
      setCategory(problemToEdit.category || 'Arrays & Hashing');
      setTags(problemToEdit.tags ? problemToEdit.tags.join(', ') : '');
      setDescription(problemToEdit.description || '');
      setInputFormat(problemToEdit.inputFormat || '');
      setOutputFormat(problemToEdit.outputFormat || '');
      setConstraintsText(problemToEdit.constraints ? problemToEdit.constraints.join('\n') : '');
      setSolutionExplanation(problemToEdit.solutionExplanation || '');
      setTimeLimit(problemToEdit.timeLimitSec || 1.0);
      setMemoryLimit(problemToEdit.memoryLimitMB || 256);
      if (problemToEdit.sampleTestCases) setSampleCases(problemToEdit.sampleTestCases);
      if (problemToEdit.hiddenTestCases) setHiddenCases(problemToEdit.hiddenTestCases);
    }
  }, [problemToEdit]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditMode) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const addSampleCase = () => {
    setSampleCases([
      ...sampleCases,
      { id: `tc-${sampleCases.length + 1}`, input: '', expectedOutput: '', isHidden: false },
    ]);
  };

  const removeSampleCase = (index: number) => {
    setSampleCases(sampleCases.filter((_, i) => i !== index));
  };

  const addHiddenCase = () => {
    setHiddenCases([
      ...hiddenCases,
      { id: `htc-${hiddenCases.length + 1}`, input: '', expectedOutput: '', isHidden: true },
    ]);
  };

  const removeHiddenCase = (index: number) => {
    setHiddenCases(hiddenCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const constraintsArr = constraintsText
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean);

      const payload: Partial<Problem> = {
        title,
        slug,
        difficulty,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        description,
        inputFormat,
        outputFormat,
        constraints: constraintsArr.length > 0 ? constraintsArr : ['1 <= N <= 10^5'],
        solutionExplanation,
        sampleTestCases: sampleCases.map((c, i) => ({ ...c, id: c.id || `tc-${i + 1}`, isHidden: false })),
        hiddenTestCases: hiddenCases.map((c, i) => ({ ...c, id: c.id || `htc-${i + 1}`, isHidden: true })),
        timeLimitSec: Number(timeLimit),
        memoryLimitMB: Number(memoryLimit),
        starterTemplates: {
          cpp: cppTemplate,
          python: pythonTemplate,
          javascript: jsTemplate,
          java: javaTemplate,
        },
      };

      if (isEditMode && problemToEdit) {
        const idToUpdate = problemToEdit.problemId || problemToEdit.id || problemToEdit.slug;
        await ApiService.updateProblem(idToUpdate, payload);
        setSuccessMsg('Problem successfully updated in MongoDB Atlas!');
      } else {
        await ApiService.createProblem(payload);
        setSuccessMsg('New problem successfully published to MongoDB Atlas!');
      }

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Operation failed on MongoDB backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white border border-amber-200/90 rounded-3xl shadow-xs space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>{isEditMode ? `Edit Challenge: ${problemToEdit.title}` : 'Add New Code Challenge'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure code problem statements, solution explanations, test cases (sample & hidden), and starter code templates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-slate-700 rounded-xl font-bold text-xs border border-amber-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/20 transition-all font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : isEditMode ? 'Save Changes' : 'Publish Challenge'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Problem Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Longest Substring Without Repeating"
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Slug (URL identifier)</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. longest-substring-without-repeating"
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Category, Tags, Limits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Category</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Two Pointers / Dynamic Programming"
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Tags (Comma Separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Array, Two Pointers, String"
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>Time Limit (Seconds)</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10.0"
            required
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            <HardDrive className="w-3.5 h-3.5 text-purple-500" />
            <span>Memory Limit (MB)</span>
          </label>
          <input
            type="number"
            min="16"
            max="2048"
            required
            value={memoryLimit}
            onChange={(e) => setMemoryLimit(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Problem Statement Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 font-serif flex items-center gap-1" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
          <FileText className="w-3.5 h-3.5 text-sky-500" />
          <span>Problem Statement / Description (Markdown)</span>
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the challenge statement, logic requirements, objective, and example behavior..."
          className="w-full p-4 bg-amber-50/30 border border-amber-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
        />
      </div>

      {/* Code Solution Explanation / Editorial */}
      <div className="p-6 bg-purple-50/30 border border-purple-200 rounded-3xl space-y-2">
        <label className="block text-xs font-bold text-purple-900 font-serif flex items-center gap-1.5" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>Code Solution & Logic Explanation (Editorial for Admins & Coders)</span>
        </label>
        <p className="text-[11px] text-purple-700">
          Explain the optimal approach, time/space complexity (e.g. O(N)), algorithm logic, and solution explanation code.
        </p>
        <textarea
          rows={4}
          value={solutionExplanation}
          onChange={(e) => setSolutionExplanation(e.target.value)}
          placeholder="Explain the solution logic here: 'We use Sliding Window algorithm with a Hash Map to track unique character indices in O(N) time and O(min(N, M)) space...'"
          className="w-full p-4 bg-white border border-purple-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-500 leading-relaxed"
        />
      </div>

      {/* Input / Output Formats & Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Input Format</label>
          <textarea
            rows={3}
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            placeholder="Single string line s."
            className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Output Format</label>
          <textarea
            rows={3}
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            placeholder="Return integer result."
            className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>Constraints (1 per line)</label>
          <textarea
            rows={3}
            value={constraintsText}
            onChange={(e) => setConstraintsText(e.target.value)}
            placeholder="1 <= s.length <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
            className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Sample Test Cases Manager */}
      <div className="p-6 bg-amber-50/30 border border-amber-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              Sample Test Cases (Visible to Users)
            </h4>
          </div>
          <button
            type="button"
            onClick={addSampleCase}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sample Case</span>
          </button>
        </div>

        <div className="space-y-3">
          {sampleCases.map((tc, idx) => (
            <div key={idx} className="p-4 bg-white border border-amber-200 rounded-2xl space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sky-700 font-mono">Sample Case #{idx + 1}</span>
                {sampleCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSampleCase(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 font-mono">Input Standard Stream</label>
                  <textarea
                    rows={2}
                    placeholder="Input data string..."
                    value={tc.input}
                    onChange={(e) => {
                      const copy = [...sampleCases];
                      copy[idx].input = e.target.value;
                      setSampleCases(copy);
                    }}
                    className="w-full p-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 font-mono">Expected Output</label>
                  <textarea
                    rows={2}
                    placeholder="Expected output string..."
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const copy = [...sampleCases];
                      copy[idx].expectedOutput = e.target.value;
                      setSampleCases(copy);
                    }}
                    className="w-full p-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs font-mono text-emerald-700 font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Test Cases Manager */}
      <div className="p-6 bg-purple-50/40 border border-purple-200 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-purple-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              Hidden Test Cases (Masked Evaluation Suite)
            </h4>
          </div>
          <button
            type="button"
            onClick={addHiddenCase}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hidden Case</span>
          </button>
        </div>

        <div className="space-y-3">
          {hiddenCases.map((tc, idx) => (
            <div key={idx} className="p-4 bg-white border border-purple-200 rounded-2xl space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-purple-700 font-mono">Hidden Case #{idx + 1} (Evaluated on Submit)</span>
                {hiddenCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHiddenCase(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 font-mono">Hidden Input Data</label>
                  <textarea
                    rows={2}
                    placeholder="Hidden edge-case input..."
                    value={tc.input}
                    onChange={(e) => {
                      const copy = [...hiddenCases];
                      copy[idx].input = e.target.value;
                      setHiddenCases(copy);
                    }}
                    className="w-full p-2.5 bg-purple-50/30 border border-purple-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 font-mono">Expected Hidden Output</label>
                  <textarea
                    rows={2}
                    placeholder="Expected hidden output..."
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const copy = [...hiddenCases];
                      copy[idx].expectedOutput = e.target.value;
                      setHiddenCases(copy);
                    }}
                    className="w-full p-2.5 bg-purple-50/30 border border-purple-200 rounded-xl text-xs font-mono text-purple-700 font-bold focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Starter Templates */}
      <div className="p-6 bg-white border border-amber-200 rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Starter Code Templates</span>
          </h4>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTemplateTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTemplateTab === 'python' ? 'bg-purple-600 text-white shadow-xs' : 'bg-amber-50 text-slate-600 hover:bg-amber-100'
              }`}
            >
              Python 3
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateTab('cpp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTemplateTab === 'cpp' ? 'bg-purple-600 text-white shadow-xs' : 'bg-amber-50 text-slate-600 hover:bg-amber-100'
              }`}
            >
              C++
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateTab('javascript')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTemplateTab === 'javascript' ? 'bg-purple-600 text-white shadow-xs' : 'bg-amber-50 text-slate-600 hover:bg-amber-100'
              }`}
            >
              JavaScript
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateTab('java')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTemplateTab === 'java' ? 'bg-purple-600 text-white shadow-xs' : 'bg-amber-50 text-slate-600 hover:bg-amber-100'
              }`}
            >
              Java
            </button>
          </div>
        </div>

        {activeTemplateTab === 'python' && (
          <textarea
            rows={6}
            value={pythonTemplate}
            onChange={(e) => setPythonTemplate(e.target.value)}
            className="w-full p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        )}
        {activeTemplateTab === 'cpp' && (
          <textarea
            rows={6}
            value={cppTemplate}
            onChange={(e) => setCppTemplate(e.target.value)}
            className="w-full p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        )}
        {activeTemplateTab === 'javascript' && (
          <textarea
            rows={6}
            value={jsTemplate}
            onChange={(e) => setJsTemplate(e.target.value)}
            className="w-full p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        )}
        {activeTemplateTab === 'java' && (
          <textarea
            rows={6}
            value={javaTemplate}
            onChange={(e) => setJavaTemplate(e.target.value)}
            className="w-full p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
          />
        )}
      </div>
    </form>
  );
};
