import React from 'react';
import { AlertOctagon, Info } from 'lucide-react';

export const ConflictResolutionPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-mono text-red-500 font-bold uppercase tracking-wider mb-1">
          <AlertOctagon className="w-4 h-4" />
          <span>Traffic Conflicts</span>
        </div>
        <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
          Conflict Resolution Hub
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center max-w-2xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Conflict Resolution Placeholder Route
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Stage 0 foundation initialized cleanly. Interactive conflict resolution and shadow window merging will be populated in subsequent stages.
        </p>
        <span className="inline-block text-xs font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
          Route Active: /app/conflict-resolution
        </span>
      </div>
    </div>
  );
};
