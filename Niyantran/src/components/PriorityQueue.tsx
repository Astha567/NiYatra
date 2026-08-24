import React, { useState, useEffect } from 'react';
import {
  ListOrdered,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Flag,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Wrench,
  Radio,
  Zap,
  ArrowUpDown,
  Check,
  X,
  Info,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTasks, MOCK_TASKS } from '../services/api';
import { MaintenanceTask, Department, Severity } from '../types/schema';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

export const PriorityQueue: React.FC = () => {
  const { user } = useApp();

  const [taskList, setTaskList] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search State
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority_desc' | 'overdue_desc' | 'criticality_desc'>('priority_desc');

  // Expanded Row Tracking (Set of task_ids)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Flag Modal State
  const [flaggingTaskId, setFlaggingTaskId] = useState<string | null>(null);
  const [flagComment, setFlagComment] = useState<string>('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  useEffect(() => {
    async function loadTasksData() {
      setLoading(true);
      try {
        const fetchedTasks = await getTasks();
        // Initialize default status if not present
        const initialized = fetchedTasks.map(t => ({
          ...t,
          queue_status: t.queue_status || ('pending' as const)
        }));
        setTaskList(initialized);
      } catch (err) {
        console.error('Failed to load priority queue tasks:', err);
        setTaskList(MOCK_TASKS.map(t => ({ ...t, queue_status: 'pending' })));
      } finally {
        setLoading(false);
      }
    }
    loadTasksData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Algorithmic Priority Backlog Tasks..." />;
  }

  // Show Toast Auto-dismiss
  const showToast = (text: string, type: 'success' | 'warning') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle Row Expansion
  const toggleRowExpand = (taskId: string) => {
    const next = new Set(expandedRows);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    setExpandedRows(next);
  };

  // Action: Approve recommended slot -> send to scheduler
  const handleApproveSendToScheduler = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskList(prev =>
      prev.map(t => {
        if (t.task_id === taskId) {
          return {
            ...t,
            queue_status: 'sent_to_scheduler',
            action_by: user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Railway Officer'
          };
        }
        return t;
      })
    );
    showToast(`Task ${taskId} approved & sent to block scheduler!`, 'success');
  };

  // Action: Open Flag Modal
  const openFlagModal = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlaggingTaskId(taskId);
    setFlagComment('');
  };

  // Action: Confirm Flag for manual review
  const confirmFlagTask = () => {
    if (!flaggingTaskId) return;
    const commentText = flagComment.trim() || 'Flagged by officer for manual window re-alignment.';
    setTaskList(prev =>
      prev.map(t => {
        if (t.task_id === flaggingTaskId) {
          return {
            ...t,
            queue_status: 'flagged_for_review',
            queue_note: commentText,
            action_by: user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Railway Officer'
          };
        }
        return t;
      })
    );
    showToast(`Task ${flaggingTaskId} flagged for officer review.`, 'warning');
    setFlaggingTaskId(null);
  };

  // Filtering & Sorting Logic
  const filteredTasks = taskList.filter(t => {
    if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
    if (selectedSection !== 'ALL' && t.section_id !== selectedSection) return false;
    if (selectedSeverity !== 'ALL' && t.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = t.task_id.toLowerCase().includes(q);
      const matchesDefect = t.defect_type.toLowerCase().includes(q);
      const matchesSlot = t.recommended_block_slot.toLowerCase().includes(q);
      if (!matchesId && !matchesDefect && !matchesSlot) return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority_desc') return b.priority_score - a.priority_score;
    if (sortBy === 'overdue_desc') return b.overdue_days - a.overdue_days;
    if (sortBy === 'criticality_desc') return b.criticality_score - a.criticality_score;
    return 0;
  });

  // Summary Metrics
  const totalTasks = taskList.length;
  const criticalCount = taskList.filter(t => t.severity === 'critical').length;
  const sentCount = taskList.filter(t => t.queue_status === 'sent_to_scheduler').length;
  const flaggedCount = taskList.filter(t => t.queue_status === 'flagged_for_review').length;
  const avgOverdue = (taskList.reduce((acc, t) => acc + t.overdue_days, 0) / (totalTasks || 1)).toFixed(1);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center space-x-3 transition-all transform slide-in-from-top-2 ${
          toastMessage.type === 'success'
            ? 'bg-[#132A1E] text-[#FDF6E7] border-[#F0C954]'
            : 'bg-[#E2574C] text-white border-red-400'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#F0C954]" />
          ) : (
            <Flag className="w-5 h-5 text-white" />
          )}
          <span className="text-xs font-bold font-mono">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D4A31C] font-bold uppercase tracking-wider mb-1">
            <ListOrdered className="w-4 h-4" />
            <span>Algorithmic Backlog Prioritization</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Pulse Priority Queue
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1">
            Unified departmental backlog tasks aggregated from TMS (Civil), SMMS (Signals), and TDMS (Electrical Traction).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#FBEAAE] dark:bg-[#2A3423] text-[#16311F] dark:text-[#FDF6E7] px-4 py-2 rounded-xl text-xs font-mono border border-[#F0C954]">
          <Shield className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954]" />
          <div>
            <span className="block font-bold">DECISION SUPPORT QUEUE</span>
            <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">{user?.corridor || 'HWH-BDC'}</span>
          </div>
        </div>
      </div>

      {/* 2. Queue Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Total Backlog Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {totalTasks}
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1 font-mono">Across ENG / SNT / TRD</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Critical Defects
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E2574C] text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {criticalCount}
            </div>
            <p className="text-[10px] text-[#E2574C] font-mono font-semibold">Priority Score &gt; 90</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Sent to Scheduler
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {sentCount}
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">Approved for Window</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Flagged for Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {flaggedCount}
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-semibold">Officer Action Needed</p>
          </div>
        </div>
      </div>

      {/* 3. FILTER, SORT & SEARCH CONTROLS TOOLBAR */}
      <div className="panel-card p-5 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Department Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-mono font-bold text-[#6B6355] dark:text-[#A8B88A] mr-1 uppercase">
              Department:
            </span>
            {(['ALL', 'ENG', 'SNT', 'TRD'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  selectedDept === dept
                    ? 'bg-[#132A1E] text-[#F0C954] border-[#132A1E] shadow-sm'
                    : 'bg-[#FDF6E7] dark:bg-[#1A241E] text-[#6B6355] dark:text-[#A8B88A] border-[#EFE4CF] dark:border-[#2E3D33] hover:text-[#16311F]'
                }`}
              >
                {dept === 'ALL' ? 'All Depts' : dept}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6B6355] dark:text-[#A8B88A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Asset ID, defect, or slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-xs text-[#16311F] dark:text-[#FDF6E7] focus:ring-2 focus:ring-[#F0C954] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] text-xs">
          {/* Section Filter */}
          <div className="flex items-center space-x-2">
            <label className="font-mono text-[#6B6355] dark:text-[#A8B88A] shrink-0">Section:</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-mono"
            >
              <option value="ALL">All Sections</option>
              <option value="HWH-BDC">HWH-BDC (Howrah - Bandel)</option>
              <option value="HWH-KGP">HWH-KGP (Howrah - Kharagpur)</option>
              <option value="BDC-KWAE">BDC-KWAE (Bandel - Katwa)</option>
              <option value="SDAH-RHA">SDAH-RHA (Sealdah - Ranaghat)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center space-x-2">
            <label className="font-mono text-[#6B6355] dark:text-[#A8B88A] shrink-0">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="major">Major Only</option>
              <option value="minor">Minor Only</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center space-x-2">
            <label className="font-mono text-[#6B6355] dark:text-[#A8B88A] shrink-0">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-[#16311F] dark:text-[#FDF6E7] outline-none font-mono font-bold"
            >
              <option value="priority_desc">Composite Priority (High → Low)</option>
              <option value="overdue_desc">Urgency Overdue Days (High → Low)</option>
              <option value="criticality_desc">Criticality Score (High → Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. MAIN PRIORITY QUEUE DATA TABLE */}
      <div className="panel-card rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-[#132A1E] text-[#FDF6E7] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold">
            <Layers className="w-4 h-4 text-[#F0C954]" />
            <span>AI-SCORED TASK BACKLOG ({sortedTasks.length} ITEMS)</span>
          </div>

          <div className="text-[11px] font-mono text-[#A8B88A]">
            Click any row to expand sub-score breakdown
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] text-[#6B6355] dark:text-[#A8B88A] font-mono uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Asset ID</th>
                <th className="py-3 px-3 font-bold text-center">Dept</th>
                <th className="py-3 px-4 font-bold">Defect Description</th>
                <th className="py-3 px-3 font-bold text-center">Criticality</th>
                <th className="py-3 px-3 font-bold text-center">Urgency</th>
                <th className="py-3 px-3 font-bold text-center">Impact</th>
                <th className="py-3 px-4 font-bold text-center">Priority Score</th>
                <th className="py-3 px-4 font-bold">Recommended Slot</th>
                <th className="py-3 px-4 font-bold text-right">Actions & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE4CF] dark:divide-[#2E3D33]">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 dark:text-slate-400 font-mono">
                    No backlog tasks found matching current filters.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => {
                  const isExpanded = expandedRows.has(task.task_id);

                  return (
                    <React.Fragment key={task.task_id}>
                      <tr
                        onClick={() => toggleRowExpand(task.task_id)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded
                            ? 'bg-[#FBEAAE]/40 dark:bg-[#272C1F]'
                            : 'hover:bg-[#FDF6E7]/80 dark:hover:bg-[#2C3830]'
                        }`}
                      >
                        {/* 1. Asset ID */}
                        <td className="py-4 px-4 font-mono font-bold text-[#16311F] dark:text-white">
                          <div className="flex items-center space-x-2">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#D4A31C]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="underline decoration-dotted">{task.task_id}</span>
                          </div>
                        </td>

                        {/* 2. Department */}
                        <td className="py-4 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                              task.department === 'ENG'
                                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                                : task.department === 'TRD'
                                ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40'
                                : 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-500/40'
                            }`}
                          >
                            {task.department}
                          </span>
                        </td>

                        {/* 3. Defect Description */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#16311F] dark:text-[#FDF6E7]">
                            {task.defect_type}
                          </div>
                          <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono mt-0.5">
                            Section: {task.section_id} (Km {task.chainage_start_km} - {task.chainage_end_km})
                          </div>
                        </td>

                        {/* 4. Criticality Score */}
                        <td className="py-4 px-3 text-center font-mono tabular-nums font-bold">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {task.criticality_score}
                          </span>
                        </td>

                        {/* 5. Urgency (overdue_days) */}
                        <td className="py-4 px-3 text-center font-mono">
                          <div className="flex flex-col items-center">
                            <span className={`font-bold tabular-nums text-xs ${
                              task.overdue_days > 10 ? 'text-[#E2574C]' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              +{task.overdue_days} Days
                            </span>
                            <span className="text-[9px] text-[#6B6355] dark:text-[#A8B88A]">Overdue</span>
                          </div>
                        </td>

                        {/* 6. Network Impact Score */}
                        <td className="py-4 px-3 text-center font-mono tabular-nums font-bold">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {task.network_impact_score}
                          </span>
                        </td>

                        {/* 7. Composite Priority Score (priority_score) */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#132A1E] text-[#F0C954] font-mono font-extrabold text-sm shadow-sm">
                            <span className="tabular-nums">{task.priority_score}</span>
                            <span className="text-[10px] text-[#A8B88A]">/100</span>
                          </div>
                        </td>

                        {/* 8. Recommended Block Slot */}
                        <td className="py-4 px-4 font-mono text-xs">
                          <div className="font-bold text-[#132A1E] dark:text-[#F0C954]">
                            {task.recommended_block_slot}
                          </div>
                          <div className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">
                            Est. {task.estimated_block_minutes} mins
                          </div>
                        </td>

                        {/* 9. Actions & Status */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex flex-col items-end space-y-1.5" onClick={(e) => e.stopPropagation()}>
                            {task.queue_status === 'sent_to_scheduler' ? (
                              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[11px] inline-flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Sent to Scheduler</span>
                              </span>
                            ) : task.queue_status === 'flagged_for_review' ? (
                              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-mono font-bold text-[11px] inline-flex items-center space-x-1">
                                <Flag className="w-3.5 h-3.5 text-amber-600" />
                                <span>Flagged for Officer</span>
                              </span>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => handleApproveSendToScheduler(task.task_id, e)}
                                  className="px-3 py-1.5 rounded-lg bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
                                  title="Approve recommended slot -> send to scheduler"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">Approve Slot</span>
                                </button>

                                <button
                                  onClick={(e) => openFlagModal(task.task_id, e)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#132A1E] hover:bg-[#1E4028] text-[#FDF6E7] font-bold text-xs shadow-sm transition-all flex items-center space-x-1 cursor-pointer border border-[#224432]"
                                  title="Flag for manual review"
                                >
                                  <Flag className="w-3.5 h-3.5 text-[#F0C954]" />
                                  <span className="hidden xl:inline">Flag</span>
                                </button>
                              </div>
                            )}

                            {task.action_by && (
                              <span className="text-[9px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                                By {task.action_by}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* 5. EXPANDED ROW DETAIL: SCORE BREAKDOWN & PARAMETERS */}
                      {isExpanded && (
                        <tr className="bg-[#FFFDF7] dark:bg-[#1E2922] border-b-2 border-[#F0C954]">
                          <td colSpan={9} className="p-6">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
                                <div className="flex items-center space-x-2 font-mono font-bold text-xs text-[#132A1E] dark:text-[#F0C954]">
                                  <Info className="w-4 h-4 text-[#D4A31C]" />
                                  <span>PULSE AI PRIORITY SCORE BREAKDOWN FOR {task.task_id}</span>
                                </div>

                                <div className="flex items-center space-x-4 text-xs font-mono">
                                  <span>Chainage: <strong>Km {task.chainage_start_km} - {task.chainage_end_km}</strong></span>
                                  <span>Block Type: <strong className="uppercase">{task.block_type.replace('_', ' ')}</strong></span>
                                  <span>Asset Criticality: <strong className="uppercase">{task.asset_criticality}</strong></span>
                                </div>
                              </div>

                              {/* Individual Sub-Scores Meters */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Sub-Score 1: Criticality */}
                                <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
                                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                                    <span className="text-[#6B6355] dark:text-[#A8B88A]">Criticality Score</span>
                                    <span className="text-[#16311F] dark:text-white tabular-nums text-sm">{task.criticality_score}/100</span>
                                  </div>
                                  <div className="w-full bg-[#EFE4CF] dark:bg-[#2E3D33] h-2.5 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${task.criticality_score}%` }}
                                      className="bg-[#132A1E] dark:bg-[#F0C954] h-full"
                                    />
                                  </div>
                                  <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">
                                    Defect severity ({task.severity}) & track asset failure vulnerability.
                                  </p>
                                </div>

                                {/* Sub-Score 2: Urgency */}
                                <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
                                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                                    <span className="text-[#6B6355] dark:text-[#A8B88A]">Urgency Score</span>
                                    <span className="text-[#16311F] dark:text-white tabular-nums text-sm">{task.urgency_score}/100</span>
                                  </div>
                                  <div className="w-full bg-[#EFE4CF] dark:bg-[#2E3D33] h-2.5 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${task.urgency_score}%` }}
                                      className="bg-[#E2574C] h-full"
                                    />
                                  </div>
                                  <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">
                                    Overdue days (+{task.overdue_days} days) beyond mandatory maintenance window.
                                  </p>
                                </div>

                                {/* Sub-Score 3: Network Impact */}
                                <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
                                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                                    <span className="text-[#6B6355] dark:text-[#A8B88A]">Network Impact Score</span>
                                    <span className="text-[#16311F] dark:text-white tabular-nums text-sm">{task.network_impact_score}/100</span>
                                  </div>
                                  <div className="w-full bg-[#EFE4CF] dark:bg-[#2E3D33] h-2.5 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${task.network_impact_score}%` }}
                                      className="bg-[#D4A31C] h-full"
                                    />
                                  </div>
                                  <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">
                                    Train disruption impact on mainline passenger/freight corridors.
                                  </p>
                                </div>
                              </div>

                              {/* Reasoning & Notes */}
                              {task.queue_note && (
                                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                                  <Flag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold font-mono">OFFICER REVIEW NOTE:</span>
                                    <p className="text-[11px] mt-0.5">{task.queue_note}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. FLAG TASK FOR MANUAL REVIEW MODAL */}
      {flaggingTaskId && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[#FFFDF7] dark:bg-[#222E26] border border-[#EFE4CF] dark:border-[#2E3D33] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7]">
                  Flag Task {flaggingTaskId} for Officer Review
                </h3>
              </div>
              <button
                onClick={() => setFlaggingTaskId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Flagging this task alerts the Traffic Controller and Sr. DEN for manual slot adjustment during block window assembly.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-[#16311F] dark:text-[#FDF6E7] uppercase">
                Officer Comment / Flag Reason:
              </label>
              <textarea
                rows={3}
                placeholder="Specify reason for manual review (e.g. track possession crew conflict, heavy freight train corridor rush...)"
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7] dark:bg-[#1A241E] text-xs text-[#16311F] dark:text-[#FDF6E7] focus:ring-2 focus:ring-[#F0C954] outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setFlaggingTaskId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B6355] dark:text-[#A8B88A] hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmFlagTask}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Confirm Flag Action</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
