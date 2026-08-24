import React from 'react';
import { Building2, Info, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DivisionOverviewPlaceholder: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#C9A227] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>DRM Executive Suite</span>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Division Overview: {user?.division || 'Howrah Division'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Divisional Railway Manager high-level backlog clearance & corridor health portal.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#C9A227]/15 text-[#C9A227] px-3 py-1.5 rounded-lg text-xs font-mono border border-[#C9A227]/30">
          <Award className="w-4 h-4" />
          <strong className="uppercase">DRM Tier Executive Access</strong>
        </div>
      </div>

      {/* Stage 0 Placeholder Info Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-[#C9A227]/40 text-center max-w-2xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-[#C9A227]/15 text-[#C9A227] flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Division Overview Placeholder Route
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Stage 0 foundation initialized cleanly. The DRM Division Overview containing macro corridor metrics, monthly planning approvals, and backlog clearance tracking will be populated in subsequent build stages.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center space-x-2 text-xs font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-800 font-semibold">
            <span>Route Active: /app/division-overview</span>
          </span>
        </div>
      </div>
    </div>
  );
};
