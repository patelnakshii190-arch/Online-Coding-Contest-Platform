import React, { useState } from 'react';
import { X, Flame, CheckCircle2, RotateCcw, Zap, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StreakRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakRecoveryModal: React.FC<StreakRecoveryModalProps> = ({ isOpen, onClose }) => {
  const { user, completeStreakRecovery } = useAuth();
  const [userCode, setUserCode] = useState(`function fixBug(arr) {
  // BUG: Returns arr.length + 1 instead of arr.length
  // Fix the line below to return correct array length!
  return arr.length + 1;
}`);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleTestSolution = () => {
    setErrorMsg('');
    const clean = userCode.replace(/\s+/g, '');
    if (clean.includes('returnarr.length;') || clean.includes('returnarr.length')) {
      setIsCompleted(true);
      completeStreakRecovery();
    } else {
      setErrorMsg('Incorrect output! The function should return `arr.length`. Change `arr.length + 1` to `arr.length`.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-200 relative overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <RotateCcw className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Streak Recovery Challenge</h3>
                <p className="text-xs text-slate-500">Fix this 1-line diagnostic bug to instantly recover your streak!</p>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" /> Challenge Objective:
              </span>
              <p>
                The diagnostic function below has an <strong>off-by-one bug</strong>. It returns `arr.length + 1` instead of `arr.length`. Fix the return statement so it returns the exact length of the input array.
              </p>
            </div>

            {/* Mini Code Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Solution Editor (JavaScript):</label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs p-3 rounded-xl bg-slate-900 text-amber-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleTestSolution}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Verify & Recover Streak</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-5 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/30">
              <Flame className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Streak Successfully Recovered!</h3>
              <p className="text-sm text-slate-600">
                You've solved the recovery challenge! Your coding streak is now set to{' '}
                <strong className="text-orange-600 font-bold">{user.streak} Days 🔥</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-800 font-semibold inline-flex items-center space-x-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span>+100 Streak Bonus XP Awarded!</span>
            </div>

            <div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg hover:bg-slate-800 transition-colors"
              >
                Awesome! Continue Coding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
