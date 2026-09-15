import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export interface RatingHistoryEntry {
  contestId: string;
  contestTitle: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  date: string;
}

interface RatingChartProps {
  history?: RatingHistoryEntry[];
}

export const RatingChart: React.FC<RatingChartProps> = ({ history = [] }) => {
  const defaultHistory: RatingHistoryEntry[] = [
    {
      contestId: 'contest-1',
      contestTitle: 'Beginner Quantum Round #1',
      rank: 145,
      ratingChange: +35,
      newRating: 1535,
      date: '2026-08-01',
    },
    {
      contestId: 'contest-2',
      contestTitle: 'Weekly Speed Coding #12',
      rank: 92,
      ratingChange: +48,
      newRating: 1583,
      date: '2026-08-10',
    },
    {
      contestId: 'contest-3',
      contestTitle: 'Algorithm Championship 2026',
      rank: 48,
      ratingChange: +62,
      newRating: 1645,
      date: '2026-08-22',
    },
    {
      contestId: 'contest-4',
      contestTitle: 'Global ICPC Practice Round',
      rank: 28,
      ratingChange: +55,
      newRating: 1700,
      date: '2026-09-02',
    },
  ];

  const activeHistory = history && history.length > 0 ? history : defaultHistory;

  const chartData = [...activeHistory].reverse().map((h) => ({
    date: h.date,
    rating: h.newRating,
    change: h.ratingChange,
    contest: h.contestTitle,
    rank: h.rank,
  }));

  return (
    <div className="bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 font-serif" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            Contest Rating Progression
          </h3>
          <p className="text-xs text-slate-500">Track your performance and rating changes across rated contests.</p>
        </div>
        <span className="text-xs text-sky-600 font-mono font-bold px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
          Rated Contests: {activeHistory.length}
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fef08a" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#fde047',
                borderRadius: '0.75rem',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(234, 179, 8, 0.15)',
              }}
              formatter={(value: number | string) => [`${value} rating`, 'Rating']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 5 }}
              activeDot={{ r: 8, fill: '#38bdf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
