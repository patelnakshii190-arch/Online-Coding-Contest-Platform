import React from 'react';
import { Verdict } from '../../types/submission';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Cpu, Loader2 } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (verdict) {
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          label: 'Accepted',
        };
      case 'WRONG_ANSWER':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: XCircle,
          label: 'Wrong Answer',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: Clock,
          label: 'Time Limit Exceeded',
        };
      case 'MEMORY_LIMIT_EXCEEDED':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          icon: Cpu,
          label: 'Memory Limit Exceeded',
        };
      case 'COMPILATION_ERROR':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          icon: AlertTriangle,
          label: 'Compilation Error',
        };
      case 'RUNTIME_ERROR':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: AlertTriangle,
          label: 'Runtime Error',
        };
      case 'PENDING':
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: Loader2,
          label: 'Evaluating Code...',
          spin: true,
        };
    }
  };

  const config = getBadgeStyle();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs space-x-1',
    md: 'px-3 py-1 text-sm space-x-1.5',
    lg: 'px-4 py-2 text-base font-bold space-x-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold border ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`w-4 h-4 ${config.spin ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
