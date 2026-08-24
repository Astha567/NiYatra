import React from 'react';
import { LayoutDashboard, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OverviewPlaceholder: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6600] font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Corridor Operations Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Corridor Overview: {user?.corridor || 'HWH-BDC'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section Engineer & Traffic Controller decision-support hub.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300">
          <span>Role:</span>
          <strong className="text-[#003366] dark:text-sky-400 uppercase">{user?.role.replace('_', ' ')}</strong>
        </div>
      </div>

      {/* Stage 0 Placeholder Info Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center max-w-2xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-[#003366]/10 text-[#003366] dark:text-sky-400 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Corridor Overview Placeholder Route
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Stage 0 foundation initialized cleanly. The full Corridor Overview containing unified maintenance backlog items, corridor busy slots, and priority scores will be populated in subsequent build stages.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center space-x-2 text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800 font-semibold">
            <span>Route Active: /app/overview</span>
          </span>
        </div>
      </div>
    </div>
  );
};
