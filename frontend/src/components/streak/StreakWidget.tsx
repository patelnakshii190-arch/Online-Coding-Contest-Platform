import React from 'react';
import { Flame, Shield, RotateCcw, Calendar, Zap, CheckCircle2, AlertTriangle, Snowflake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StreakWidgetProps {
  onOpenRecoveryModal?: () => void;
  compact?: boolean;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ onOpenRecoveryModal, compact = false }) => {
  const { user, useStreakFreeze } = useAuth();

  if (!user) return null;

  const streak = user.streak || 0;
  const maxStreak = user.maxStreak || streak;
  const freezes = user.streakFreezes ?? 2;
  const isBroken = user.streakStatus === 'broken' || user.streakStatus === 'at_risk';

  const handleUseFreeze = () => {
    const success = useStreakFreeze();
    if (success) {
      alert('Streak Freeze Activated! Your coding streak has been saved.');
    } else {
      alert('No Streak Freeze tokens remaining.');
    }
  };

  // Generate last 7 days activity matrix
  const today = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const activity = user.activityHistory?.find((a) => a.date === dateStr);
    return {
      date: dateStr,
      dayName,
      status: activity?.status || (i === 6 ? (isBroken ? 'missed' : 'completed') : 'completed'),
    };
  });

  if (compact) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/30 text-amber-600 font-semibold text-xs shadow-sm">
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        <span>{streak} Day Streak</span>
        {freezes > 0 && (
          <span className="flex items-center text-sky-500 text-[11px] ml-1 font-normal">
            <Snowflake className="w-3 h-3 mr-0.5" /> {freezes}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-orange-500/30 rounded-2xl p-6 shadow-md relative overflow-hidden">
      {/* Background Flame Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Flame Count & Status */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
            <Flame className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{streak} Day Coding Streak</h3>
              {user.streakStatus === 'recovered' && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-600 font-medium border border-emerald-500/30">
                  Recovered ✨
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Personal Record: <span className="font-semibold text-orange-600">{maxStreak} Days</span>
            </p>
          </div>
        </div>

        {/* Middle: 7-Day Activity Matrix */}
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-orange-200 shadow-inner">
          {past7Days.map((d, i) => {
            let bgClass = 'bg-slate-200 text-slate-400';
            if (d.status === 'completed') bgClass = 'bg-orange-500 text-white shadow-sm';
            if (d.status === 'frozen') bgClass = 'bg-sky-500 text-white shadow-sm';
            if (d.status === 'recovered') bgClass = 'bg-emerald-500 text-white shadow-sm';
            if (d.status === 'missed') bgClass = 'bg-rose-500 text-white shadow-sm animate-pulse';

            return (
              <div key={i} className="flex flex-col items-center space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase">{d.dayName}</span>
                <div
                  title={`${d.date}: ${d.status}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${bgClass}`}
                >
                  {d.status === 'completed' && '✓'}
                  {d.status === 'frozen' && <Snowflake className="w-3.5 h-3.5" />}
                  {d.status === 'recovered' && <Zap className="w-3.5 h-3.5" />}
                  {d.status === 'missed' && '!'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Recovery Actions & Freeze Tokens */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium">
            <Snowflake className="w-4 h-4 text-sky-500" />
            <span>
              <strong className="font-bold text-sky-800">{freezes}</strong> Freeze Token{freezes !== 1 ? 's' : ''}
            </span>
          </div>

          {isBroken ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenRecoveryModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs shadow-md flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recover Streak Challenge</span>
              </button>

              {freezes > 0 && (
                <button
                  onClick={handleUseFreeze}
                  className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md flex items-center space-x-1 transition-all"
                >
                  <Snowflake className="w-4 h-4" />
                  <span>Use Freeze</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenRecoveryModal}
              className="px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium text-xs border border-orange-300 flex items-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>Practice & Boost</span>
            </button>
          )}
        </div>
      </div>

      {isBroken && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-xs text-rose-700 font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>
            Your daily coding streak is at risk! Complete today's <strong>Streak Recovery Challenge</strong> or use a Freeze token to prevent reset.
          </span>
        </div>
      )}
    </div>
  );
};
