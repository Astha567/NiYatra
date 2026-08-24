import React from 'react';
import { BarChart3, Info } from 'lucide-react';

export const ReportsPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-500 font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Reports</span>
        </div>
        <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
          Reports & Performance Analytics
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center max-w-2xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Reports & Analytics Placeholder Route
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Stage 0 foundation initialized cleanly. Departmental efficiency charts and backlog clearance metrics will be populated in subsequent stages.
        </p>
        <span className="inline-block text-xs font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
          Route Active: /app/reports
        </span>
      </div>
    </div>
  );
};
