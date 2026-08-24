import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Train,
  Wrench,
  Radio,
  Zap,
  Filter,
  X,
  Check,
  ChevronRight,
  Shield,
  Trash2,
  Edit3,
  Building2,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getWeeklyPlan,
  getMonthlyPlan,
  getBusySlots,
  patchBlock,
  MOCK_SCHEDULED_BLOCKS,
  MOCK_BUSY_SLOTS,
  MOCK_MONTHLY_PLAN
} from '../services/api';
import {
  ScheduledBlock,
  CorridorBusySlot,
  MonthlyPlan,
  Department,
  OfficerDecision,
  MaintenanceTask
} from '../types/schema';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00

export const BlockCalendar: React.FC = () => {
  const { user } = useApp();

  // View state: 'weekly' vs 'monthly'
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState<string>('HWH-BDC');
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>('ALL');

  // Data state
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
  const [busySlots, setBusySlots] = useState<CorridorBusySlot[]>([]);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Block Drawer state
  const [selectedBlock, setSelectedBlock] = useState<ScheduledBlock | null>(null);
  const [retimeInput, setRetimeInput] = useState<string>('01:30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCalendarData() {
      setLoading(true);
      try {
        const [wPlan, mPlan, bSlots] = await Promise.all([
          getWeeklyPlan(selectedWeek),
          getMonthlyPlan(),
          getBusySlots(selectedSection)
        ]);
        setScheduledBlocks(wPlan.scheduled_blocks);
        setMonthlyPlan(mPlan);
        setBusySlots(bSlots);
      } catch (err) {
        console.error('Failed to load block calendar data:', err);
        setScheduledBlocks(MOCK_SCHEDULED_BLOCKS);
        setMonthlyPlan(MOCK_MONTHLY_PLAN);
        setBusySlots(MOCK_BUSY_SLOTS);
      } finally {
        setLoading(false);
      }
    }
    loadCalendarData();
  }, [selectedWeek, selectedSection]);

  if (loading) {
    return <LoadingSpinner message="Loading Block Calendar & Gantt Timeline Grid..." />;
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Convert "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Convert minutes to percentage of 24h day (1440 mins)
  const timeToPercent = (timeStr: string): number => {
    const mins = timeToMinutes(timeStr);
    return Math.min(100, Math.max(0, (mins / 1440) * 100));
  };

  // Officer Action: Approve / Reject / Remove / Retime via API
  const handleOfficerAction = async (action: OfficerDecision['action'], targetTaskId?: string, newStart?: string) => {
    if (!selectedBlock) return;

    const decision: OfficerDecision = {
      action,
      decided_by: user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Railway Officer',
      target_task_id: targetTaskId,
      new_start_time: newStart,
      comment: action === 'approve'
        ? 'Approved as recommended by Pulse AI'
        : action === 'reject'
        ? 'Rejected due to train traffic constraint'
        : action === 'remove_task'
        ? `Task ${targetTaskId} removed by officer`
        : `Window retimed to ${newStart}`
    };

    try {
      const updated = await patchBlock(selectedBlock.block_id, decision);
      setScheduledBlocks(prev => prev.map(b => (b.block_id === updated.block_id ? updated : b)));
      setSelectedBlock(updated);
      showToast(`Block ${updated.block_id} action '${action}' updated successfully!`);
    } catch (err) {
      console.error('Failed to patch block:', err);
      // Fallback local update
      const updatedBlock = { ...selectedBlock };
      if (action === 'approve') updatedBlock.status = 'approved';
      if (action === 'reject') updatedBlock.status = 'rejected';
      if (action === 'remove_task' && targetTaskId) {
        updatedBlock.tasks = updatedBlock.tasks.filter(t => t.task_id !== targetTaskId);
        updatedBlock.status = 'customized';
      }
      if (action === 'retime_task' && newStart) {
        updatedBlock.start_time = newStart;
        updatedBlock.status = 'customized';
      }
      updatedBlock.officer_decision = decision;
      setScheduledBlocks(prev => prev.map(b => (b.block_id === updatedBlock.block_id ? updatedBlock : b)));
      setSelectedBlock(updatedBlock);
      showToast(`Block ${updatedBlock.block_id} updated locally!`);
    }
  };

  // Filter blocks by section & department
  const filteredBlocks = scheduledBlocks.filter(b => {
    if (selectedSection !== 'ALL' && b.section_id !== selectedSection) return false;
    if (selectedDept !== 'ALL' && !b.departments_involved.includes(selectedDept)) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl bg-[#132A1E] text-[#F0C954] border border-[#F0C954] font-mono text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F0C954]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D4A31C] font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Interactive Timetable Matrix</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Corridor Block Calendar
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1">
            Visualizing train traffic busy slots against AI-proposed merged maintenance block windows.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center space-x-1 bg-[#FDF6E7] dark:bg-[#1A241E] p-1.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-[#F0C954] text-[#132A1E] shadow-sm'
                : 'text-[#6B6355] dark:text-[#A8B88A] hover:text-[#16311F]'
            }`}
          >
            Weekly Gantt View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-[#F0C954] text-[#132A1E] shadow-sm'
                : 'text-[#6B6355] dark:text-[#A8B88A] hover:text-[#16311F]'
            }`}
          >
            Monthly Overview
          </button>
        </div>
      </div>

      {/* 2. FILTER CONTROLS TOOLBAR */}
      <div className="panel-card p-5 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Section Filter */}
          <div className="space-y-1">
            <label className="text-[#6B6355] dark:text-[#A8B88A] font-bold uppercase">Corridor Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-bold"
            >
              <option value="HWH-BDC">HWH-BDC (Howrah - Bandel Main Line)</option>
              <option value="HWH-KGP">HWH-KGP (Howrah - Kharagpur Section)</option>
              <option value="BDC-KWAE">BDC-KWAE (Bandel - Katwa Section)</option>
              <option value="SDAH-RHA">SDAH-RHA (Sealdah - Ranaghat Line)</option>
            </select>
          </div>

          {/* Week Filter */}
          <div className="space-y-1">
            <label className="text-[#6B6355] dark:text-[#A8B88A] font-bold uppercase">Planning Week:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-bold"
            >
              <option value={1}>Week 1 (Aug 25 - Aug 31, 2026)</option>
              <option value={2}>Week 2 (Sep 01 - Sep 07, 2026)</option>
              <option value={3}>Week 3 (Sep 08 - Sep 14, 2026)</option>
              <option value={4}>Week 4 (Sep 15 - Sep 21, 2026)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="space-y-1">
            <label className="text-[#6B6355] dark:text-[#A8B88A] font-bold uppercase">Department Filter:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-bold"
            >
              <option value="ALL">All Departments (ENG + SNT + TRD)</option>
              <option value="ENG">Engineering (ENG Only)</option>
              <option value="SNT">Signals & Telecom (SNT Only)</option>
              <option value="TRD">Traction Distribution (TRD Only)</option>
            </select>
          </div>
        </div>

        {/* Legend Ribbon */}
        <div className="pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-700"></span>
              <span className="text-[#6B6355] dark:text-[#A8B88A]">Passenger Train Path</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-700 border border-amber-800"></span>
              <span className="text-[#6B6355] dark:text-[#A8B88A]">Freight Train Path</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
              <span className="text-[#6B6355] dark:text-[#A8B88A]">Single Dept Block</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-3.5 rounded bg-gradient-to-r from-amber-500 via-sky-500 to-purple-500 border border-amber-300"></span>
              <span className="text-[#132A1E] dark:text-[#F0C954] font-bold">Merged Shadow Block (Distinct Stripes)</span>
            </div>
          </div>

          <div className="text-[#6B6355] dark:text-[#A8B88A]">
            Time Axis: <strong>00:00 — 23:59</strong>
          </div>
        </div>
      </div>

      {/* 3. VIEW MODE CONTENT: WEEKLY GANTT vs MONTHLY ROLLUP */}
      {viewMode === 'weekly' ? (
        /* WEEKLY GANTT TIMELINE CHART (SIGNATURE DEMO SCREEN) */
        <div className="panel-card rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-[#132A1E] text-[#FDF6E7] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 text-[#F0C954]" />
              <span>WEEKLY CORRIDOR GANTT TIMELINE — {selectedSection} (WEEK {selectedWeek})</span>
            </div>
            <div className="text-[11px] font-mono text-[#A8B88A]">
              Click any block to open officer decision drawer
            </div>
          </div>

          {/* Gantt Timeline Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] p-4">
              {/* 24-Hour Time Axis Ticks Header */}
              <div className="grid grid-cols-[120px_1fr] gap-2 mb-3 pb-2 border-b border-[#EFE4CF] dark:border-[#2E3D33] text-[10px] font-mono font-bold text-[#6B6355] dark:text-[#A8B88A]">
                <div>DAY / SECTION</div>
                <div className="grid grid-cols-24 gap-0 text-center">
                  {HOURS.map((h) => (
                    <div key={h} className="border-r border-[#EFE4CF]/60 dark:border-[#2E3D33]/60 truncate">
                      {h < 10 ? `0${h}` : h}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Rows */}
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((dayName) => {
                  const dayBlocks = filteredBlocks.filter(b => b.day === dayName);
                  const dayBusy = busySlots.filter(s => s.day === dayName);

                  return (
                    <div
                      key={dayName}
                      className="grid grid-cols-[120px_1fr] gap-2 items-center p-2 rounded-xl bg-[#FDF6E7]/50 dark:bg-[#1A241E] border border-[#EFE4CF] dark:border-[#2E3D33] min-h-[64px]"
                    >
                      {/* Day Label */}
                      <div className="font-mono font-bold text-xs text-[#16311F] dark:text-[#FDF6E7]">
                        <div>{dayName}</div>
                        <div className="text-[9px] text-[#6B6355] dark:text-[#A8B88A]">
                          {dayBlocks.length} Block(s)
                        </div>
                      </div>

                      {/* 24h Timeline Bar for Day */}
                      <div className="relative h-12 bg-[#FFFDF7] dark:bg-[#222E26] rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] overflow-hidden">
                        {/* Hour vertical grid lines */}
                        <div className="absolute inset-0 grid grid-cols-24 pointer-events-none">
                          {HOURS.map((h) => (
                            <div key={h} className="border-r border-[#EFE4CF]/40 dark:border-[#2E3D33]/40 h-full" />
                          ))}
                        </div>

                        {/* Plotted Train Busy Slots */}
                        {dayBusy.map((bSlot, idx) => {
                          const leftPct = timeToPercent(bSlot.start_time);
                          const rightPct = timeToPercent(bSlot.end_time);
                          const widthPct = Math.max(2, rightPct - leftPct);

                          return (
                            <div
                              key={idx}
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                              className={`absolute top-1 bottom-1 rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-white flex items-center justify-between truncate z-10 shadow-sm ${
                                bSlot.train_type === 'passenger'
                                  ? 'bg-indigo-700/80 border border-indigo-500'
                                  : 'bg-amber-800/80 border border-amber-600'
                              }`}
                              title={`Train Busy Slot: ${bSlot.train_id} (${bSlot.start_time} - ${bSlot.end_time})`}
                            >
                              <Train className="w-3 h-3 shrink-0 mr-1 opacity-80" />
                              <span className="truncate">{bSlot.train_id}</span>
                            </div>
                          );
                        })}

                        {/* Plotted Scheduled Blocks */}
                        {dayBlocks.map((block) => {
                          const leftPct = timeToPercent(block.start_time);
                          const rightPct = timeToPercent(block.end_time);
                          const widthPct = Math.max(3, rightPct - leftPct);

                          const isSelected = selectedBlock?.block_id === block.block_id;

                          return (
                            <div
                              key={block.block_id}
                              onClick={() => setSelectedBlock(block)}
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                              className={`absolute top-1 bottom-1 rounded-lg px-2 py-1 text-[10px] font-mono font-bold cursor-pointer transition-all z-20 flex items-center justify-between border-2 shadow-md ${
                                isSelected ? 'ring-4 ring-[#F0C954] scale-[1.02] z-30' : ''
                              } ${
                                block.is_merged
                                  ? 'bg-gradient-to-r from-amber-600 via-sky-600 to-purple-600 text-white border-[#F0C954] animate-pulse'
                                  : block.departments_involved.includes('ENG')
                                  ? 'bg-amber-500 text-slate-900 border-amber-600'
                                  : block.departments_involved.includes('TRD')
                                  ? 'bg-purple-600 text-white border-purple-700'
                                  : 'bg-sky-600 text-white border-sky-700'
                              }`}
                              title={`Block ${block.block_id} (${block.start_time} - ${block.end_time}): Click to customize`}
                            >
                              <div className="flex items-center space-x-1 truncate">
                                {block.is_merged && (
                                  <span className="px-1 bg-[#132A1E] text-[#F0C954] text-[8px] rounded font-extrabold shrink-0">
                                    MERGED
                                  </span>
                                )}
                                <span className="truncate">{block.block_id}</span>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0 ml-1">
                                <span className={`text-[8px] px-1 rounded uppercase font-bold ${
                                  block.status === 'approved' ? 'bg-emerald-700 text-white' :
                                  block.status === 'rejected' ? 'bg-red-700 text-white line-through' :
                                  block.status === 'customized' ? 'bg-purple-800 text-white' :
                                  'bg-[#132A1E] text-amber-300'
                                }`}>
                                  {block.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MONTHLY OVERVIEW ROLLUP */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {monthlyPlan?.weeks.map((w) => (
              <div
                key={w.week_number}
                onClick={() => {
                  setSelectedWeek(w.week_number);
                  setViewMode('weekly');
                }}
                className="kpi-card p-5 rounded-2xl cursor-pointer hover:border-[#132A1E] hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954]">
                    WEEK {w.week_number}
                  </span>
                  <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                    Starts {w.week_start}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-[#16311F] dark:text-white font-mono tabular-nums">
                    {w.scheduled_blocks.length}
                  </span>
                  <span className="text-xs text-[#6B6355] dark:text-[#A8B88A]">Scheduled Blocks</span>
                </div>
                <div className="pt-2 border-t border-[#F0C954]/40 flex items-center justify-between text-[11px] font-mono text-[#132A1E] dark:text-[#F0C954] font-bold">
                  <span>Open Weekly Gantt</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Section Summary Rollup Table */}
          <div className="panel-card p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7]">
              Monthly Section Summary & Backlog Clearance Rate
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#EFE4CF] dark:border-[#2E3D33] text-[#6B6355] dark:text-[#A8B88A] uppercase">
                    <th className="pb-3 font-bold">Section ID</th>
                    <th className="pb-3 font-bold text-center">Blocks Planned</th>
                    <th className="pb-3 font-bold text-center">Backlog Cleared</th>
                    <th className="pb-3 font-bold text-center">Backlog Remaining</th>
                    <th className="pb-3 font-bold text-right">Clearance Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE4CF] dark:divide-[#2E3D33]">
                  {monthlyPlan?.section_summary.map((sec) => {
                    const total = sec.backlog_cleared + sec.backlog_remaining;
                    const pct = total > 0 ? ((sec.backlog_cleared / total) * 100).toFixed(1) : '0';

                    return (
                      <tr key={sec.section_id} className="hover:bg-[#FDF6E7]/80 dark:hover:bg-[#2C3830]">
                        <td className="py-3 font-bold text-[#16311F] dark:text-[#FDF6E7]">{sec.section_id}</td>
                        <td className="py-3 text-center tabular-nums">{sec.blocks_planned}</td>
                        <td className="py-3 text-center tabular-nums text-emerald-600 font-bold">{sec.backlog_cleared}</td>
                        <td className="py-3 text-center tabular-nums text-amber-600 font-bold">{sec.backlog_remaining}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-1 rounded bg-[#132A1E] text-[#F0C954] font-bold">
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLOCK CUSTOMIZATION & OFFICER DECISION DRAWER (SLIDE-OVER) */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBlock(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#FFFDF7] dark:bg-[#222E26] border-l border-[#EFE4CF] dark:border-[#2E3D33] shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 bg-[#132A1E] text-[#FDF6E7] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-[#F0C954] font-mono font-bold">
                    <Shield className="w-4 h-4" />
                    <span>BLOCK AUTHORIZATION DRAWER</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white mt-1">
                    {selectedBlock.block_id} ({selectedBlock.section_id})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="p-2 rounded-lg text-[#A8B88A] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status & Priority Ribbon */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FBEAAE] dark:bg-[#272C1F] border border-[#F0C954]">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
                      Block Priority Score
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-[#16311F] dark:text-white tabular-nums">
                      {selectedBlock.total_priority_score} / 100
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
                      Status
                    </span>
                    <div>
                      <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs uppercase ${
                        selectedBlock.status === 'approved' ? 'bg-emerald-600 text-white' :
                        selectedBlock.status === 'rejected' ? 'bg-red-600 text-white' :
                        selectedBlock.status === 'customized' ? 'bg-purple-600 text-white' :
                        'bg-amber-500 text-slate-900'
                      }`}>
                        {selectedBlock.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-[#16311F] dark:text-[#FDF6E7]">
                    Pulse AI Optimization Reasoning:
                  </label>
                  <div className="p-4 rounded-xl bg-[#FDF6E7] dark:bg-[#1A241E] border border-[#EFE4CF] dark:border-[#2E3D33] text-xs text-[#16311F] dark:text-[#FDF6E7] leading-relaxed">
                    {selectedBlock.reasoning}
                  </div>
                </div>

                {/* Block Timing & Duration */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#FDF6E7] dark:bg-[#1A241E] border border-[#EFE4CF] dark:border-[#2E3D33]">
                    <div className="text-[#6B6355] dark:text-[#A8B88A]">Scheduled Window:</div>
                    <div className="font-bold text-[#16311F] dark:text-white text-sm mt-0.5">
                      {selectedBlock.day}, {selectedBlock.start_time} - {selectedBlock.end_time}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FDF6E7] dark:bg-[#1A241E] border border-[#EFE4CF] dark:border-[#2E3D33]">
                    <div className="text-[#6B6355] dark:text-[#A8B88A]">Departments:</div>
                    <div className="font-bold text-[#16311F] dark:text-white text-sm mt-0.5">
                      {selectedBlock.departments_involved.join(' + ')}
                    </div>
                  </div>
                </div>

                {/* Linked Tasks List with Removal Option */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#16311F] dark:text-[#FDF6E7]">
                    <span>LINKED MAINTENANCE TASKS ({selectedBlock.tasks.length})</span>
                    {selectedBlock.is_customizable && (
                      <span className="text-purple-600 dark:text-purple-400">Customizable Block</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {selectedBlock.tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="p-3 rounded-xl bg-white dark:bg-[#1A241E] border border-[#EFE4CF] dark:border-[#2E3D33] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#16311F] dark:text-[#FDF6E7]">
                            {task.task_id} — {task.defect_type}
                          </div>
                          <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono mt-0.5">
                            Dept: {task.department} | Severity: {task.severity} | Est: {task.estimated_block_minutes} mins
                          </div>
                        </div>

                        {selectedBlock.is_customizable && selectedBlock.tasks.length > 1 && (
                          <button
                            onClick={() => handleOfficerAction('remove_task', task.task_id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors shrink-0 ml-2"
                            title="Remove minor task from block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retime Task Customization Controls */}
                {selectedBlock.is_customizable && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                    <div className="text-xs font-mono font-bold text-purple-900 dark:text-purple-300 flex items-center space-x-1.5">
                      <Edit3 className="w-4 h-4" />
                      <span>RETIME BLOCK START TIME</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="time"
                        value={retimeInput}
                        onChange={(e) => setRetimeInput(e.target.value)}
                        className="p-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#1A241E] text-xs font-mono font-bold text-[#16311F] dark:text-white"
                      />
                      <button
                        onClick={() => handleOfficerAction('retime_task', undefined, retimeInput)}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Apply Retime
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Action Footer */}
              <div className="p-6 border-t border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/50 dark:bg-[#1A241E] flex items-center justify-between gap-4">
                <button
                  onClick={() => handleOfficerAction('reject')}
                  className="px-5 py-3 rounded-xl bg-[#E2574C] hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Proposal</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('approve')}
                  className="px-6 py-3 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Block Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
