import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  GitBranch,
  Shield,
  Layers,
  Wrench,
  Radio,
  Zap,
  ArrowRight,
  Clock,
  Sliders,
  AlertTriangle,
  Send,
  UserCheck,
  Check,
  X,
  Train,
  Building2,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getConflicts, MOCK_CONFLICTS } from '../services/api';
import { Conflict, MaintenanceTask, Department } from '../types/schema';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

export const ConflictResolution: React.FC = () => {
  const { user } = useApp();

  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedConflictIndex, setSelectedConflictIndex] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Manual Override State
  const [manualOverrideActive, setManualOverrideActive] = useState<boolean>(false);
  const [overrideStartTime, setOverrideStartTime] = useState<string>('01:30');
  const [overrideDuration, setOverrideDuration] = useState<number>(180);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadConflictsData() {
      setLoading(true);
      try {
        const fetched = await getConflicts();
        setConflicts(fetched);
      } catch (err) {
        console.error('Failed to load conflicts data:', err);
        setConflicts(MOCK_CONFLICTS);
      } finally {
        setLoading(false);
      }
    }
    loadConflictsData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Conflict Resolution Matrix..." />;
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredConflicts = conflicts.filter(c => {
    if (selectedSection !== 'ALL' && c.section_id !== selectedSection) return false;
    return true;
  });

  const activeConflict = filteredConflicts[selectedConflictIndex] || filteredConflicts[0] || conflicts[0];

  // Action 1: Accept AI-Suggested Resolution
  const handleAcceptAIResolution = () => {
    if (!activeConflict) return;
    setConflicts(prev =>
      prev.map((c, idx) =>
        c.section_id === activeConflict.section_id && c.day === activeConflict.day
          ? { ...c, resolution: 'merged', reasoning: `Officer ${user?.name || 'Officer'} accepted Pulse AI shadow window merge.` }
          : c
      )
    );
    showToast(`Conflict on ${activeConflict.section_id} (${activeConflict.day}) resolved via AI Shadow Window Merge!`);
  };

  // Action 2: Escalate to DRM
  const handleEscalateToDRM = () => {
    if (!activeConflict) return;
    setConflicts(prev =>
      prev.map((c, idx) =>
        c.section_id === activeConflict.section_id && c.day === activeConflict.day
          ? { ...c, resolution: 'pending', reasoning: `Escalated to DRM ${user?.division || 'Division'} for executive priority determination.` }
          : c
      )
    );
    showToast(`Conflict escalated to Divisional Railway Manager (DRM).`);
  };

  // Action 3: Confirm Manual Override
  const handleConfirmManualOverride = () => {
    if (!activeConflict) return;
    setConflicts(prev =>
      prev.map((c, idx) =>
        c.section_id === activeConflict.section_id && c.day === activeConflict.day
          ? {
              ...c,
              resolution: 'merged',
              reasoning: `Manual override by ${user?.name || 'Officer'}: Rescheduled window to start at ${overrideStartTime} (${overrideDuration} mins).`
            }
          : c
      )
    );
    setManualOverrideActive(false);
    showToast(`Manual override applied: Window rescheduled to ${overrideStartTime}.`);
  };

  // Summary Metrics
  const totalConflicts = conflicts.length;
  const pendingCount = conflicts.filter(c => c.resolution === 'pending').length;
  const mergedCount = conflicts.filter(c => c.resolution === 'merged').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl bg-[#132A1E] text-[#F0C954] border border-[#F0C954] font-mono text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F0C954]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#E2574C] font-bold uppercase tracking-wider mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span>Inter-Departmental Overlap Resolution</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Conflict Resolution Hub
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1">
            Reconciling overlapping block requests from Engineering, Signals & Telecom, and Traction Distribution.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#FBEAAE] dark:bg-[#2A3423] text-[#16311F] dark:text-[#FDF6E7] px-4 py-2 rounded-xl text-xs font-mono border border-[#F0C954]">
          <Shield className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954]" />
          <div>
            <span className="block font-bold">DECISION SUPPORT HUB</span>
            <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">{user?.corridor || 'HWH-BDC'}</span>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Total Departmental Overlaps
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {totalConflicts}
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1 font-mono">Multi-Department Overlaps</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Pending Officer Resolution
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E2574C] text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {pendingCount}
            </div>
            <p className="text-[10px] text-[#E2574C] font-mono font-semibold">Requires Approval / Override</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              AI Merged Shadow Windows
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {mergedCount}
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">Coordinated Blocks</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONFLICT WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Conflict Selection List */}
        <div className="space-y-4">
          <div className="panel-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
              <span className="text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase">
                Active Conflict Queue
              </span>
              <span className="text-[10px] font-mono text-[#6B6355] dark:text-[#A8B88A]">
                {filteredConflicts.length} Conflicts
              </span>
            </div>

            {/* Section Filter Dropdown */}
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setSelectedConflictIndex(0);
              }}
              className="w-full p-2.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-xs font-mono font-bold text-[#16311F] dark:text-[#FDF6E7] outline-none"
            >
              <option value="ALL">All Sections</option>
              <option value="HWH-BDC">HWH-BDC (Howrah - Bandel)</option>
              <option value="HWH-KGP">HWH-KGP (Howrah - Kharagpur)</option>
              <option value="BDC-KWAE">BDC-KWAE (Bandel - Katwa)</option>
              <option value="SDAH-RHA">SDAH-RHA (Sealdah - Ranaghat)</option>
            </select>

            {/* Conflict Items List */}
            <div className="space-y-3">
              {filteredConflicts.map((conflict, idx) => {
                const isSelected = activeConflict && activeConflict.section_id === conflict.section_id && activeConflict.day === conflict.day;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedConflictIndex(idx);
                      setManualOverrideActive(false);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#132A1E] dark:border-[#F0C954] bg-[#FBEAAE]/50 dark:bg-[#272C1F] shadow-md ring-2 ring-[#F0C954]'
                        : 'border-[#EFE4CF] dark:border-[#2E3D33] bg-white dark:bg-[#1A241E] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-mono text-[#16311F] dark:text-[#FDF6E7]">
                        {conflict.section_id} ({conflict.day})
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        conflict.resolution === 'merged'
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40'
                          : 'bg-[#E2574C]/20 text-[#E2574C] border border-[#E2574C]/40'
                      }`}>
                        {conflict.resolution}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] line-clamp-2">
                      {conflict.reasoning}
                    </div>

                    <div className="flex items-center space-x-1.5 pt-1">
                      {conflict.overlapping_tasks.map((task) => (
                        <span
                          key={task.task_id}
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            task.department === 'ENG' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300' :
                            task.department === 'TRD' ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300' :
                            'bg-sky-500/20 text-sky-800 dark:text-sky-300'
                          }`}
                        >
                          {task.department}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Span 2): Side-by-Side Comparison & Officer Actions */}
        <div className="lg:col-span-2 space-y-6">
          {activeConflict ? (
            <>
              {/* Conflict Context Header */}
              <div className="panel-card p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#E2574C] uppercase">
                      Active Overlap Comparison Matrix
                    </span>
                    <h3 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
                      {activeConflict.section_id} — {activeConflict.day} (Week {activeConflict.week_number})
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                    activeConflict.resolution === 'merged'
                      ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                  }`}>
                    Status: {activeConflict.resolution.replace('_', ' ')}
                  </span>
                </div>

                {/* SIDE-BY-SIDE REQUEST COMPARISON CARDS (Primary Requirement) */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
                    Side-by-Side Conflicting Departmental Requests ({activeConflict.overlapping_tasks.length}):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeConflict.overlapping_tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="p-5 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/50 dark:bg-[#1A241E] space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          {/* Department & Priority Score Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border ${
                              task.department === 'ENG' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40' :
                              task.department === 'TRD' ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40' :
                              'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-500/40'
                            }`}>
                              {task.department} DEPT
                            </span>

                            <div className="px-2.5 py-1 rounded-lg bg-[#132A1E] text-[#F0C954] font-mono font-extrabold text-xs shadow-sm">
                              Score: {task.priority_score}/100
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-[#16311F] dark:text-[#FDF6E7] font-heading">
                            {task.task_id}
                          </h4>
                          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 leading-relaxed">
                            {task.defect_type}
                          </p>

                          <div className="space-y-1 mt-3 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] text-[11px] font-mono text-[#6B6355] dark:text-[#A8B88A]">
                            <div>Chainage: <strong>Km {task.chainage_start_km} - {task.chainage_end_km}</strong></div>
                            <div>Severity: <strong className="uppercase">{task.severity}</strong></div>
                            <div>Overdue: <strong className="text-[#E2574C]">+{task.overdue_days} Days</strong></div>
                            <div>Est Duration: <strong>{task.estimated_block_minutes} mins</strong></div>
                          </div>
                        </div>

                        <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 italic">
                          Recommended: {task.recommended_block_slot}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pulse AI Proposed Resolution */}
                <div className="p-4 rounded-2xl bg-[#FBEAAE] dark:bg-[#272C1F] border border-[#F0C954] space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954]">
                    <Shield className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954]" />
                    <span>PULSE AI OPTIMAL SHADOW WINDOW PROPOSAL:</span>
                  </div>
                  <p className="text-xs text-[#16311F] dark:text-[#FDF6E7] leading-relaxed">
                    {activeConflict.reasoning}
                  </p>
                </div>

                {/* 3-Way Officer Actions Toolbar */}
                <div className="pt-4 border-t border-[#EFE4CF] dark:border-[#2E3D33] flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={handleAcceptAIResolution}
                    className="px-5 py-3 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept AI Shadow Window Merge</span>
                  </button>

                  <button
                    onClick={() => setManualOverrideActive(!manualOverrideActive)}
                    className="px-5 py-3 rounded-xl bg-[#132A1E] hover:bg-[#1E4028] text-[#FDF6E7] font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer border border-[#224432]"
                  >
                    <Sliders className="w-4 h-4 text-[#F0C954]" />
                    <span>{manualOverrideActive ? 'Close Manual Override' : 'Manual Override & Reschedule'}</span>
                  </button>

                  <button
                    onClick={handleEscalateToDRM}
                    className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center space-x-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#D4A31C]" />
                    <span>Escalate to DRM</span>
                  </button>
                </div>
              </div>

              {/* MANUAL OVERRIDE & DOWNSTREAM IMPACT ANALYSIS PANEL */}
              {manualOverrideActive && (
                <div className="panel-card p-6 rounded-2xl space-y-6 border-2 border-[#F0C954] animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954]">
                      <Sliders className="w-4 h-4" />
                      <span>MANUAL TIME OVERRIDE & DOWNSTREAM IMPACT ANALYSIS</span>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded font-bold">
                      OFFICER CONTROLS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Time Picker Controls */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-bold text-[#16311F] dark:text-[#FDF6E7] uppercase">
                        1. Override Block Start Time:
                      </label>
                      <input
                        type="time"
                        value={overrideStartTime}
                        onChange={(e) => setOverrideStartTime(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-sm font-mono font-bold text-[#16311F] dark:text-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-bold text-[#16311F] dark:text-[#FDF6E7] uppercase">
                        2. Override Block Duration (Minutes):
                      </label>
                      <input
                        type="number"
                        value={overrideDuration}
                        onChange={(e) => setOverrideDuration(Number(e.target.value))}
                        step={15}
                        className="w-full p-3 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-sm font-mono font-bold text-[#16311F] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* DOWNSTREAM IMPACT ANALYSIS (Primary Requirement 4) */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-xs">
                    <div className="flex items-center space-x-2 font-mono font-bold text-amber-900 dark:text-amber-300">
                      <Train className="w-4 h-4 text-amber-600" />
                      <span>DOWNSTREAM TRAIN TIMETABLE & SECTION IMPACT ANALYSIS:</span>
                    </div>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A241E] border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 dark:text-white">Train 12339 (Coalfield Express):</strong> Minimal impact (+5 min speed restriction).
                        </div>
                        <span className="text-emerald-600 font-bold">ACCEPTABLE</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A241E] border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 dark:text-white">Freight BOXN-772:</strong> Regulated at Bandel loop line from 02:15 to 03:00.
                        </div>
                        <span className="text-amber-600 font-bold">SLIGHT DELAY</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A241E] border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 dark:text-white">Downstream Task TASK-SNT-308:</strong> Co-located, window extended by {overrideDuration} mins.
                        </div>
                        <span className="text-emerald-600 font-bold">CO-ORDINATED</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setManualOverrideActive(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B6355] dark:text-[#A8B88A]"
                    >
                      Cancel Override
                    </button>
                    <button
                      onClick={handleConfirmManualOverride}
                      className="px-6 py-2.5 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Manual Override & Update Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="panel-card p-12 text-center text-slate-500 dark:text-slate-400 font-mono">
              No conflict selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
