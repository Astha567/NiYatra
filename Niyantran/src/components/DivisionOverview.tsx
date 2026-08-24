import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  GitBranch,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  Truck,
  Users,
  Activity,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCorridorMetrics, getCrossCorridorResources, MOCK_CORRIDOR_METRICS, MOCK_CROSS_CORRIDOR_RESOURCES } from '../services/api';
import { CorridorMetrics, CrossCorridorResource } from '../types/schema';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

export const DivisionOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useApp();

  const [corridors, setCorridors] = useState<CorridorMetrics[]>([]);
  const [resources, setResources] = useState<CrossCorridorResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cMetrics, rContention] = await Promise.all([
          getCorridorMetrics(),
          getCrossCorridorResources()
        ]);
        setCorridors(cMetrics);
        setResources(rContention);
      } catch (err) {
        console.error('Failed to load division overview data:', err);
        setCorridors(MOCK_CORRIDOR_METRICS);
        setResources(MOCK_CROSS_CORRIDOR_RESOURCES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading DRM Division Overview & Corridor Matrix..." />;
  }

  const handleDrillDown = (corridorId: string, corridorName: string) => {
    // Update active corridor in user session context and navigate to Corridor Overview
    if (user) {
      login(user.role, user.division, corridorName, user.name, user.title);
    }
    navigate('/app/overview');
  };

  // Division Aggregates
  const totalCorridors = corridors.length;
  const avgAvailability = corridors.length > 0
    ? (corridors.reduce((acc, curr) => acc + curr.asset_availability_pct, 0) / corridors.length).toFixed(1)
    : '98.1';
  const totalOverdue = corridors.reduce((acc, curr) => acc + curr.overdue_defects_count, 0);
  const totalPendingBlocks = corridors.reduce((acc, curr) => acc + curr.pending_blocks_count, 0);
  const totalCritical = corridors.reduce((acc, curr) => acc + curr.critical_defects_count, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D4A31C] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Divisional Railway Manager (DRM) Macro Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Division Overview: {user?.division || 'Howrah Division'}
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 font-sans">
            Cross-corridor performance comparison, shared crew resource contention & monthly backlog clearance tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#FBEAAE] dark:bg-[#2A3423] text-[#16311F] dark:text-[#FDF6E7] px-4 py-2 rounded-xl text-xs font-mono border border-[#F0C954]">
          <Award className="w-4 h-4 text-[#D4A31C]" />
          <div>
            <span className="block font-bold">DRM EXECUTIVE LEVEL</span>
            <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A]">{user?.division || 'Howrah Division'}</span>
          </div>
        </div>
      </div>

      {/* 2. Macro Division KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Division Asset Availability */}
        <div className="kpi-card p-6 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Avg Asset Availability
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                {avgAvailability}%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +0.6%
              </span>
            </div>
            <p className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Across {totalCorridors} division corridors</p>
          </div>
        </div>

        {/* KPI 2: Total Overdue Defects */}
        <div className="kpi-card p-6 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Overdue Defects
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E2574C]/15 text-[#E2574C] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                {totalOverdue}
              </span>
              <span className="text-xs font-bold text-[#E2574C] font-mono">
                {totalCritical} Critical
              </span>
            </div>
            <p className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Requiring priority block windows</p>
          </div>
        </div>

        {/* KPI 3: Pending Block Requests */}
        <div className="kpi-card p-6 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Pending Block Requests
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                {totalPendingBlocks}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Awaiting Officer Review</span>
            </div>
            <p className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Pulse AI proposed windows</p>
          </div>
        </div>

        {/* KPI 4: Inter-Corridor Contention */}
        <div className="kpi-card p-6 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Shared Crew Contention
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D4A31C]/20 text-[#D4A31C] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                {resources.length}
              </span>
              <span className="text-xs font-bold text-[#D4A31C] font-mono">Inter-Corridor</span>
            </div>
            <p className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Shared tower wagon & tamping machinery</p>
          </div>
        </div>
      </div>

      {/* 3. CORRIDOR COMPARISON GRID (Primary Screen Requirement 1) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase tracking-wider">
              <GitBranch className="w-4 h-4" />
              <span>Corridor Performance Matrix</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Division Corridor Comparison Grid
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Side-by-side asset availability, backlog count, downtime trends, and instant drill-down.
            </p>
          </div>

          <div className="text-xs font-mono text-[#6B6355] dark:text-[#A8B88A] bg-[#FDF6E7] dark:bg-[#1A241E] px-3 py-1.5 rounded-lg border border-[#EFE4CF] dark:border-[#2E3D33]">
            {corridors.length} Division Corridors Monitored
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE4CF] dark:border-[#2E3D33] text-[#6B6355] dark:text-[#A8B88A] font-mono uppercase text-[11px]">
                <th className="pb-3 font-bold pl-2">Corridor / Section</th>
                <th className="pb-3 font-bold text-center">Asset Availability</th>
                <th className="pb-3 font-bold text-center">Overdue Defects</th>
                <th className="pb-3 font-bold text-center">Pending / Approved Blocks</th>
                <th className="pb-3 font-bold text-center">Downtime Trend</th>
                <th className="pb-3 font-bold text-right pr-2">Action / Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE4CF] dark:divide-[#2E3D33]">
              {corridors.map((c) => (
                <tr
                  key={c.corridor_id}
                  className="hover:bg-[#FDF6E7]/80 dark:hover:bg-[#2C3830] transition-colors group"
                >
                  {/* Corridor name */}
                  <td className="py-4 pl-2">
                    <div className="font-bold text-[#16311F] dark:text-[#FDF6E7] text-sm group-hover:text-[#D4A31C]">
                      {c.corridor_name}
                    </div>
                    <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono flex items-center space-x-2 mt-0.5">
                      <span>{c.division}</span>
                      <span>•</span>
                      <span>{c.active_sections} Track Sections</span>
                    </div>
                  </td>

                  {/* Availability % */}
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#132A1E]/10 dark:bg-white/10 text-[#16311F] dark:text-[#FDF6E7] font-mono font-bold text-sm">
                      <span className="tabular-nums">{c.asset_availability_pct}%</span>
                    </div>
                  </td>

                  {/* Overdue defects */}
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-[#16311F] dark:text-white tabular-nums">
                        {c.overdue_defects_count}
                      </span>
                      {c.critical_defects_count > 0 && (
                        <span className="text-[10px] bg-[#E2574C] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                          {c.critical_defects_count} Critical
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pending / Approved */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold">
                        {c.pending_blocks_count} Pending
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                        {c.approved_blocks_count} Approved
                      </span>
                    </div>
                  </td>

                  {/* Downtime Trend */}
                  <td className="py-4 text-center">
                    <div className={`inline-flex items-center space-x-1 text-xs font-mono font-bold ${
                      c.downtime_trend_pct < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#E2574C]'
                    }`}>
                      {c.downtime_trend_pct < 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4" />
                          <span>{c.downtime_trend_pct}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          <span>+{c.downtime_trend_pct}%</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Drill-down button */}
                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={() => handleDrillDown(c.corridor_id, c.corridor_name)}
                      className="px-4 py-2 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Drill-Down Overview</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CROSS-CORRIDOR RESOURCE CONTENTION VIEW (Primary Screen Requirement 2) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#E2574C] uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Inter-Corridor Conflict Layer</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Cross-Corridor Shared Resource Contention
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Surfacing shared maintenance machinery, tower wagons, and specialized crews contested across adjacent corridors.
            </p>
          </div>

          <span className="text-xs font-mono bg-[#E2574C]/10 text-[#E2574C] px-3 py-1.5 rounded-lg border border-[#E2574C]/30 font-bold self-start sm:self-auto">
            {resources.length} Inter-Corridor Conflicts Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div
              key={res.resource_id}
              className="p-5 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/50 dark:bg-[#1A241E] space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#132A1E] text-[#F0C954] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#16311F] dark:text-[#FDF6E7] font-heading">
                      {res.resource_name}
                    </h4>
                    <p className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                      Home Corridor: <strong>{res.home_corridor}</strong>
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border ${
                  res.contention_status === 'conflict_flagged'
                    ? 'bg-[#E2574C]/15 text-[#E2574C] border-[#E2574C]/30'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                }`}>
                  {res.contention_status.replace('_', ' ')}
                </span>
              </div>

              {/* Contending Corridors & Requested Slots */}
              <div className="space-y-2 pt-2 border-t border-[#EFE4CF] dark:border-[#2E3D33]">
                <div className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
                  Conflicting Corridor Requests:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {res.requested_slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white dark:bg-[#222E26] border border-[#EFE4CF] dark:border-[#2E3D33] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#132A1E] dark:text-[#F0C954] font-mono">{slot.corridor}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                          slot.department === 'ENG' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                          slot.department === 'TRD' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' :
                          'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                        }`}>
                          {slot.department}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                        {slot.day}, {slot.start_time} - {slot.end_time}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Task: {slot.task_id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pulse AI Resolution Proposal */}
              <div className="p-3 rounded-lg bg-[#FBEAAE]/60 dark:bg-[#272C1F] border border-[#F0C954]/60 text-xs text-[#16311F] dark:text-[#FDF6E7] flex items-start space-x-2">
                <Shield className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#132A1E] dark:text-[#F0C954] block mb-0.5 font-mono">PULSE RE-SCHEDULING PROPOSAL:</span>
                  <p className="text-[11px] leading-relaxed">{res.resolution_notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
