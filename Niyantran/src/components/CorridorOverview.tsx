import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ListOrdered,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Wrench,
  Radio,
  Zap,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTasks, getWeeklyPlan, MOCK_TASKS, MOCK_SCHEDULED_BLOCKS } from '../services/api';
import { MaintenanceTask, ScheduledBlock, Department, WeeklyPlan } from '../types/schema';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

export const CorridorOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [blocks, setBlocks] = useState<ScheduledBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCorridorData() {
      setLoading(true);
      try {
        const [taskList, blockList] = await Promise.all([
          getTasks(),
          getWeeklyPlan(1).then((p: WeeklyPlan) => p.scheduled_blocks)
        ]);
        setTasks(taskList);
        setBlocks(blockList);
      } catch (err) {
        console.error('Failed to fetch corridor overview data:', err);
        setTasks(MOCK_TASKS);
        setBlocks(MOCK_SCHEDULED_BLOCKS);
      } finally {
        setLoading(false);
      }
    }
    loadCorridorData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Corridor Maintenance Dashboard..." />;
  }

  // Compute Department Backlog Breakdown
  const deptStats: Record<Department, { name: string; icon: any; total: number; critical: number; major: number; minor: number; colorClass: string; badgeBg: string }> = {
    ENG: {
      name: 'Engineering (Civil / Track)',
      icon: Wrench,
      total: tasks.filter(t => t.department === 'ENG').length,
      critical: tasks.filter(t => t.department === 'ENG' && t.severity === 'critical').length,
      major: tasks.filter(t => t.department === 'ENG' && t.severity === 'major').length,
      minor: tasks.filter(t => t.department === 'ENG' && t.severity === 'minor').length,
      colorClass: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
    },
    SNT: {
      name: 'Signals & Telecom (S&T)',
      icon: Radio,
      total: tasks.filter(t => t.department === 'SNT').length,
      critical: tasks.filter(t => t.department === 'SNT' && t.severity === 'critical').length,
      major: tasks.filter(t => t.department === 'SNT' && t.severity === 'major').length,
      minor: tasks.filter(t => t.department === 'SNT' && t.severity === 'minor').length,
      colorClass: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-500/15 border-sky-500/40 text-sky-800 dark:text-sky-300'
    },
    TRD: {
      name: 'Traction Distribution (OHE Power)',
      icon: Zap,
      total: tasks.filter(t => t.department === 'TRD').length,
      critical: tasks.filter(t => t.department === 'TRD' && t.severity === 'critical').length,
      major: tasks.filter(t => t.department === 'TRD' && t.severity === 'major').length,
      minor: tasks.filter(t => t.department === 'TRD' && t.severity === 'minor').length,
      colorClass: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/15 border-purple-500/40 text-purple-800 dark:text-purple-300'
    }
  };

  // Metrics based on Week vs Month toggle
  const kpiData = {
    week: {
      availability: '98.4%',
      pendingBlocks: '5 Blocks',
      approvedBlocks: '14 Blocks',
      overdueDefects: '6 Defects',
      avgDowntime: '180 mins'
    },
    month: {
      availability: '97.6%',
      pendingBlocks: '18 Blocks',
      approvedBlocks: '42 Blocks',
      overdueDefects: '14 Defects',
      avgDowntime: '210 mins'
    }
  }[timeframe];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Dashboard Header & Timeframe Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#132A1E] dark:text-[#F0C954] font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Corridor Landing Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Corridor Overview: {user?.corridor || 'HWH-BDC'}
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 font-sans">
            Section Engineer & Traffic Controller decision-support dashboard for unified corridor block planning.
          </p>
        </div>

        {/* Week / Month View Toggle */}
        <div className="flex items-center space-x-1 bg-[#FDF6E7] dark:bg-[#1A241E] p-1.5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              timeframe === 'week'
                ? 'bg-[#F0C954] text-[#132A1E] shadow-sm'
                : 'text-[#6B6355] dark:text-[#A8B88A] hover:text-[#16311F] dark:hover:text-[#FDF6E7]'
            }`}
          >
            Weekly View (7 Days)
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              timeframe === 'month'
                ? 'bg-[#F0C954] text-[#132A1E] shadow-sm'
                : 'text-[#6B6355] dark:text-[#A8B88A] hover:text-[#16311F] dark:hover:text-[#FDF6E7]'
            }`}
          >
            Monthly View (30 Days)
          </button>
        </div>
      </div>

      {/* 2. KPI STAT CARDS GRID (Soft Warm-Gold Tint #FBEAAE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* KPI 1: Asset Availability */}
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Asset Availability
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {kpiData.availability}
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1 font-mono">Corridor Uptime</p>
          </div>
        </div>

        {/* KPI 2: Pending Blocks */}
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Pending Blocks
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {kpiData.pendingBlocks}
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-semibold">Pulse Proposals</p>
          </div>
        </div>

        {/* KPI 3: Approved Blocks */}
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Approved Blocks
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {kpiData.approvedBlocks}
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">Officer Authorized</p>
          </div>
        </div>

        {/* KPI 4: Overdue Defects */}
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Overdue Defects
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E2574C] text-white flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {kpiData.overdueDefects}
            </div>
            <p className="text-[10px] text-[#E2574C] font-mono font-semibold">Backlog Items</p>
          </div>
        </div>

        {/* KPI 5: Avg Downtime */}
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Avg Block Duration
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
              {kpiData.avgDowntime}
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] font-mono">Merged Window Duration</p>
          </div>
        </div>
      </div>

      {/* 3. DEPARTMENT SUMMARY PANEL (Primary Requirement 2) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Multi-Departmental Backlog Status</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Department Summary & Defect Severity Breakdown
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Aggregated backlog metrics for Engineering, Signals & Telecom, and Traction Distribution.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#6B6355] dark:text-[#A8B88A]">
            <span>Total Backlog Tasks:</span>
            <strong className="text-[#132A1E] dark:text-[#F0C954] tabular-nums font-bold">{tasks.length}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['ENG', 'SNT', 'TRD'] as Department[]).map((deptKey) => {
            const dept = deptStats[deptKey];
            const IconComp = dept.icon;

            return (
              <div
                key={deptKey}
                className="p-5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/50 dark:bg-[#1A241E] space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${dept.badgeBg}`}>
                          {deptKey} DEPT
                        </span>
                        <h4 className="text-sm font-bold text-[#16311F] dark:text-[#FDF6E7] font-heading mt-1">
                          {dept.name}
                        </h4>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-[#16311F] dark:text-white tabular-nums">
                      {dept.total}
                    </span>
                  </div>

                  {/* Severity Breakdown Pills */}
                  <div className="space-y-2 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33]">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
                      Defect Severity Breakdown:
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30">
                        <div className="text-sm font-extrabold tabular-nums">{dept.critical}</div>
                        <div className="text-[9px] uppercase">Critical</div>
                      </div>

                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        <div className="text-sm font-extrabold tabular-nums">{dept.major}</div>
                        <div className="text-[9px] uppercase">Major</div>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/30">
                        <div className="text-sm font-extrabold tabular-nums">{dept.minor}</div>
                        <div className="text-[9px] uppercase">Minor</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="pt-2">
                  <div className="w-full bg-[#EFE4CF] dark:bg-[#2E3D33] h-2 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${dept.total > 0 ? (dept.critical / dept.total) * 100 : 0}%` }}
                      className="bg-[#E2574C] h-full"
                      title="Critical"
                    />
                    <div
                      style={{ width: `${dept.total > 0 ? (dept.major / dept.total) * 100 : 0}%` }}
                      className="bg-[#F0C954] h-full"
                      title="Major"
                    />
                    <div
                      style={{ width: `${dept.total > 0 ? (dept.minor / dept.total) * 100 : 0}%` }}
                      className="bg-[#A8B88A] h-full"
                      title="Minor"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CORRIDOR STATUS STRIP (Primary Requirement 3) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Section Kilometer Mapping</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Corridor Active Block Status Strip
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Track chainage section visualization showing active maintenance windows and scheduled train block slots.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>ENG</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              <span>SNT</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>TRD</span>
            </span>
          </div>
        </div>

        {/* Section Kilometer Strip */}
        <div className="p-5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/40 dark:bg-[#1A241E] space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#6B6355] dark:text-[#A8B88A]">
            <span>Km 10.0 (Howrah Jn)</span>
            <span>Km 20.0 (Bandel Jn)</span>
            <span>Km 35.0 (Rishra)</span>
            <span>Km 50.0 (Chinsurah)</span>
          </div>

          {/* Graphical Track representation with Block Windows */}
          <div className="relative h-12 bg-[#132A1E] rounded-xl border border-[#224432] p-1.5 flex items-center">
            {/* Track Line */}
            <div className="absolute inset-x-4 h-1 bg-[#A8B88A]/40 rounded top-1/2 -translate-y-1/2"></div>

            {/* Block 1: HWH-BDC Merged Window */}
            <div
              className="absolute left-[15%] w-[35%] h-8 bg-amber-500/30 border-2 border-amber-500 rounded-lg flex items-center justify-between px-3 text-white text-xs font-mono font-bold backdrop-blur-sm cursor-pointer hover:bg-amber-500/40 transition-colors shadow-md"
              title="BLK-2026-W1-01: Merged ENG + SNT + TRD Shadow Block (01:30 - 04:30)"
            >
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-[11px] truncate">BLK-01: Merged ENG/SNT/TRD (Km 12.4-16.2)</span>
              </div>
              <span className="text-[10px] bg-amber-500 px-1.5 py-0.5 rounded text-slate-900 font-extrabold">
                180 MINS
              </span>
            </div>

            {/* Block 2: HWH-KGP Turnout Renewal */}
            <div
              className="absolute left-[60%] w-[30%] h-8 bg-purple-500/30 border-2 border-purple-500 rounded-lg flex items-center justify-between px-3 text-white text-xs font-mono font-bold backdrop-blur-sm cursor-pointer hover:bg-purple-500/40 transition-colors shadow-md"
              title="BLK-2026-W1-02: Turnout Renewal & OHE Check (00:30 - 04:30)"
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] truncate">BLK-02: Turnout Renewal (Km 45.0-48.5)</span>
              </div>
              <span className="text-[10px] bg-purple-500 px-1.5 py-0.5 rounded text-white font-extrabold">
                240 MINS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK NAV LINKS INTO PRIORITY QUEUE & BLOCK CALENDAR (Primary Requirement 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/app/priority-queue')}
          className="panel-card p-6 rounded-2xl cursor-pointer hover:border-[#F0C954] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#132A1E] text-[#F0C954] flex items-center justify-center shadow-md">
              <ListOrdered className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] group-hover:text-[#D4A31C]">
                Pulse Priority Queue
              </h3>
              <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
                View AI-ranked maintenance backlog & defect priority scores.
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-[#132A1E] dark:text-[#F0C954] group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => navigate('/app/block-calendar')}
          className="panel-card p-6 rounded-2xl cursor-pointer hover:border-[#F0C954] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0C954] text-[#132A1E] flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] group-hover:text-[#D4A31C]">
                Corridor Block Calendar
              </h3>
              <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
                Inspect weekly and monthly merged block schedule windows.
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-[#132A1E] dark:text-[#F0C954] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
