import React from 'react';
import { Link } from 'react-router-dom';
import { Contest } from '../../types/contest';
import { ContestTimer } from './ContestTimer';
import { Trophy, Calendar, Users, ArrowRight, ShieldCheck, Zap, Clock, Award } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
  onRegisterToggle?: (contestId: string) => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, onRegisterToggle }) => {
  const getStatusBadge = () => {
    switch (contest.status) {
      case 'LIVE':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>LIVE NOW</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span>UPCOMING</span>
          </span>
        );
      case 'ENDED':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span>PAST CONTEST</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-amber-200/90 hover:border-sky-300 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 group">
      
      {/* Header & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {getStatusBadge()}
          {contest.status === 'LIVE' && <ContestTimer endTime={contest.endTime} />}
        </div>

        <h3 
          className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors font-serif"
          style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
        >
          {contest.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {contest.description}
        </p>

        {/* Contest Feature Tags */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center space-x-1">
            <Zap className="w-3 h-3 text-sky-500" />
            <span>{contest.problems ? contest.problems.length : 4} Problems</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{contest.durationMinutes} Mins</span>
          </span>
          {contest.title.includes('Championship') && (
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center space-x-1">
              <Award className="w-3 h-3 text-purple-600" />
              <span>₹5,00,000 Prize Pool</span>
            </span>
          )}
        </div>
      </div>

      {/* Meta Stats */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-100 text-xs font-mono text-slate-600">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>{new Date(contest.startTime).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span>{contest.registeredCount.toLocaleString()} Coders</span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-1">
        {contest.status === 'LIVE' ? (
          <Link
            to={`/contests/${contest.slug}`}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md shadow-rose-500/20 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <Trophy className="w-4 h-4" />
            <span>Enter Contest Arena</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : contest.status === 'UPCOMING' ? (
          <button
            onClick={() => onRegisterToggle && onRegisterToggle(contest.id)}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all font-serif ${
              contest.isRegistered
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20'
            }`}
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            {contest.isRegistered ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Registered ✓</span>
              </>
            ) : (
              <span>Register Now</span>
            )}
          </button>
        ) : (
          <Link
            to={`/contests/${contest.slug}`}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 border border-amber-200 font-serif"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            <span>View Standings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
