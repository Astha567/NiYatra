import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  Radio,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

import { LoadingSpinner, EmptyState } from './LoadingSpinner';

// Mock Analytics Data for Charts
const DOWNTIME_TREND_DATA = [
  { week: 'Week 1', downtimeHours: 42, plannedHours: 48, backlogCleared: 28 },
  { week: 'Week 2', downtimeHours: 38, plannedHours: 45, backlogCleared: 32 },
  { week: 'Week 3', downtimeHours: 35, plannedHours: 42, backlogCleared: 36 },
  { week: 'Week 4', downtimeHours: 31, plannedHours: 40, backlogCleared: 42 },
  { week: 'Week 5', downtimeHours: 29, plannedHours: 38, backlogCleared: 45 },
  { week: 'Week 6', downtimeHours: 26, plannedHours: 36, backlogCleared: 48 },
];

const SLA_COMPLIANCE_DATA = [
  { department: 'ENG (Civil/Track)', compliancePct: 92.4, target: 90, raised: 48, resolved: 44, pending: 4 },
  { department: 'SNT (Signals & Telecom)', compliancePct: 96.8, target: 90, raised: 32, resolved: 31, pending: 1 },
  { department: 'TRD (OHE Electrical)', compliancePct: 94.2, target: 90, raised: 38, resolved: 36, pending: 2 },
];

const DEPT_COMPARISON_MATRIX = [
  {
    department: 'ENG (Engineering)',
    code: 'ENG',
    defectsRaised: 48,
    defectsResolved: 44,
    pendingBacklog: 4,
    avgResolutionDays: 3.2,
    slaCompliancePct: 92.4
  },
  {
    department: 'SNT (Signals & Telecom)',
    code: 'SNT',
    defectsRaised: 32,
    defectsResolved: 31,
    pendingBacklog: 1,
    avgResolutionDays: 1.8,
    slaCompliancePct: 96.8
  },
  {
    department: 'TRD (Traction Distribution)',
    code: 'TRD',
    defectsRaised: 38,
    defectsResolved: 36,
    pendingBacklog: 2,
    avgResolutionDays: 2.4,
    slaCompliancePct: 94.2
  }
];

export const Reports: React.FC = () => {
  const { user } = useApp();

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Functional Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Department', 'Defects Raised', 'Defects Resolved', 'Pending Backlog', 'Avg Resolution Days', 'SLA Compliance Pct'];
    const rows = DEPT_COMPARISON_MATRIX.map(row => [
      row.department,
      row.defectsRaised,
      row.defectsResolved,
      row.pendingBacklog,
      row.avgResolutionDays,
      `${row.slaCompliancePct}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `niyatra_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics CSV report exported successfully!');
  };

  // Functional Export PDF / Print Handler
  const handleExportPDF = () => {
    window.print();
    showToast('Print / PDF dialog opened.');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl bg-[#132A1E] text-[#F0C954] border border-[#F0C954] font-mono text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F0C954]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF7] dark:bg-[#222E26] p-6 rounded-2xl border border-[#EFE4CF] dark:border-[#2E3D33] shadow-sm print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D4A31C] font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Corridor Efficiency & Performance Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">
            Reports & Analytics Hub
          </h1>
          <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1">
            Downtime trends, departmental SLA compliance %, block utilization efficiency, and export suite.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#132A1E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-[#132A1E] hover:bg-[#1E4028] text-[#FDF6E7] font-bold text-xs shadow-sm transition-all flex items-center space-x-2 cursor-pointer border border-[#224432]"
          >
            <Printer className="w-4 h-4 text-[#F0C954]" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Metric Anchors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Downtime Reduction
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                -14.2%
              </span>
              <span className="text-xs text-emerald-600 font-bold font-mono">Over 6 Weeks</span>
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Pulse Shadow Merging Gain</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Division SLA Compliance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                94.6%
              </span>
              <span className="text-xs text-emerald-600 font-bold font-mono">+4.6% Above Target</span>
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Across ENG, SNT, TRD</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Block Utilization Efficiency
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D4A31C]/20 text-[#D4A31C] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                91.2%
              </span>
              <span className="text-xs text-[#D4A31C] font-mono font-bold">Planned vs Executed</span>
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1">1,350 / 1,480 Block Mins</p>
          </div>
        </div>

        <div className="kpi-card p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#6B6355] dark:text-[#A8B88A]">
              Backlog Clearance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#132A1E] text-[#F0C954] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#16311F] dark:text-white tabular-nums font-mono">
                88.4%
              </span>
              <span className="text-xs text-emerald-600 font-bold font-mono">111 / 118 Defects</span>
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] mt-1">Monthly Backlog Resolution</p>
          </div>
        </div>
      </div>

      {/* 3. DOWNTIME TREND & SLA COMPLIANCE CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Downtime Trend Line Chart (Requirement 1) */}
        <div className="panel-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase">
                Corridor Downtime Trend
              </span>
              <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
                Weekly Maintenance Downtime Hours
              </h3>
            </div>

            <span className="text-xs font-mono bg-[#132A1E] text-[#F0C954] px-2.5 py-1 rounded-lg font-bold">
              6-Week Trend
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DOWNTIME_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE4CF" opacity={0.5} />
                <XAxis dataKey="week" stroke="#6B6355" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#6B6355" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#132A1E', borderColor: '#F0C954', color: '#FDF6E7', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="downtimeHours" name="Actual Downtime (Hrs)" stroke="#132A1E" strokeWidth={3} activeDot={{ r: 8, fill: '#F0C954' }} />
                <Line type="monotone" dataKey="plannedHours" name="Planned Hours" stroke="#D4A31C" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance % Bar Chart (Requirement 2) */}
        <div className="panel-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase">
                Department Compliance
              </span>
              <h3 className="text-lg font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
                SLA Compliance % by Department
              </h3>
            </div>

            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-bold">
              Target: 90%
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SLA_COMPLIANCE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE4CF" opacity={0.5} />
                <XAxis dataKey="department" stroke="#6B6355" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[0, 100]} stroke="#6B6355" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#132A1E', borderColor: '#F0C954', color: '#FDF6E7', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Bar dataKey="compliancePct" name="SLA Compliance %" fill="#132A1E" radius={[8, 8, 0, 0]}>
                  {SLA_COMPLIANCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : index === 1 ? '#0EA5E9' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BLOCK UTILIZATION EFFICIENCY PANEL (Requirement 3) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Corridor Block Utilization</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Block Utilization Efficiency (Planned vs. Actual Executed)
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Measuring actual track possession time consumed vs officer approved block window limits.
            </p>
          </div>

          <div className="text-xs font-mono bg-[#FBEAAE] text-[#132A1E] px-3 py-1.5 rounded-xl font-bold border border-[#F0C954]">
            Efficiency Rate: 91.2%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
            <div className="text-xs font-mono text-[#6B6355] dark:text-[#A8B88A]">Approved Planned Block Time</div>
            <div className="text-2xl font-extrabold font-mono text-[#16311F] dark:text-white tabular-nums">
              1,480 Mins
            </div>
            <p className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] font-mono">Officer Approved Windows</p>
          </div>

          <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
            <div className="text-xs font-mono text-[#6B6355] dark:text-[#A8B88A]">Actual Track Possession Time</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              1,350 Mins
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">130 Mins Track Time Saved</p>
          </div>

          <div className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] space-y-2">
            <div className="text-xs font-mono text-[#6B6355] dark:text-[#A8B88A]">Shadow Block Window Density</div>
            <div className="text-2xl font-extrabold font-mono text-[#D4A31C] tabular-nums">
              2.4 Tasks/Block
            </div>
            <p className="text-[10px] text-[#D4A31C] font-mono font-bold">Multi-Dept Pulse Merges</p>
          </div>
        </div>
      </div>

      {/* 5. DEPARTMENT COMPARISON TABLE (Requirement 4) */}
      <div className="panel-card p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4CF] dark:border-[#2E3D33] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#132A1E] dark:text-[#F0C954] uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Multi-Department Comparative Matrix</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-[#16311F] dark:text-[#FDF6E7] mt-0.5">
              Department Comparison Table (Defects Raised vs. Resolved vs. Pending)
            </h2>
            <p className="text-xs text-[#6B6355] dark:text-[#A8B88A]">
              Comparative breakdown of maintenance backlog resolution efficiency across Engineering, S&T, and TRD.
            </p>
          </div>

          <span className="text-xs font-mono bg-[#132A1E] text-[#F0C954] px-3 py-1.5 rounded-xl font-bold">
            Division Audit Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#EFE4CF] dark:border-[#2E3D33] text-[#6B6355] dark:text-[#A8B88A] uppercase">
                <th className="pb-3 font-bold">Department</th>
                <th className="pb-3 font-bold text-center">Defects Raised</th>
                <th className="pb-3 font-bold text-center">Defects Resolved</th>
                <th className="pb-3 font-bold text-center">Pending Backlog</th>
                <th className="pb-3 font-bold text-center">Avg Resolution Time</th>
                <th className="pb-3 font-bold text-right">SLA Compliance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE4CF] dark:divide-[#2E3D33]">
              {DEPT_COMPARISON_MATRIX.map((row) => (
                <tr key={row.code} className="hover:bg-[#FDF6E7]/80 dark:hover:bg-[#2C3830]">
                  <td className="py-4 font-bold text-[#16311F] dark:text-[#FDF6E7]">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.code === 'ENG' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300' :
                        row.code === 'SNT' ? 'bg-sky-500/20 text-sky-800 dark:text-sky-300' :
                        'bg-purple-500/20 text-purple-800 dark:text-purple-300'
                      }`}>
                        {row.code}
                      </span>
                      <span>{row.department}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center tabular-nums text-sm font-bold">{row.defectsRaised}</td>
                  <td className="py-4 text-center tabular-nums text-sm font-bold text-emerald-600 dark:text-emerald-400">{row.defectsResolved}</td>
                  <td className="py-4 text-center tabular-nums text-sm font-bold text-amber-600 dark:text-amber-400">{row.pendingBacklog}</td>
                  <td className="py-4 text-center tabular-nums">{row.avgResolutionDays} Days</td>
                  <td className="py-4 text-right">
                    <span className="px-3 py-1 rounded-lg bg-[#132A1E] text-[#F0C954] font-bold text-xs">
                      {row.slaCompliancePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
