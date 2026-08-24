import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Train,
  Layers,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleStart = () => {
    if (user) {
      if (user.role === 'drm') {
        navigate('/app/division-overview');
      } else {
        navigate('/app/overview');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E7] dark:bg-[#171F1A] text-[#16311F] dark:text-[#FDF6E7] flex flex-col transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#132A1E] text-[#FDF6E7] border-b border-[#224432] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0C954] text-[#132A1E] flex items-center justify-center shadow-md">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight font-heading">NiYatra</span>
                <span className="text-xs bg-[#F0C954]/20 text-[#F0C954] border border-[#F0C954]/40 font-mono font-semibold px-2 py-0.5 rounded-full">
                  PULSE ENGINE v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#A8B88A] tracking-wide font-mono">INDIAN RAILWAY BLOCK PLANNING SYSTEM</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleStart}
              className="px-5 py-2 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] text-sm font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>{user ? 'Open Dashboard' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#132A1E] to-[#0B1B13] text-[#FDF6E7] py-20 lg:py-28 border-b border-[#224432]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#F0C954]/15 border border-[#F0C954]/40 text-[#F0C954] text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4" />
              <span>Multi-Departmental Corridor Block Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white">
              One system to see and approve every maintenance block on your corridor.
            </h1>

            <p className="text-lg sm:text-xl text-[#FDF6E7]/90 leading-relaxed font-sans">
              Pulse unifies engineering, S&T, and electrical maintenance backlogs into prioritized, merged block slots — empowering Railway Officers with human-in-the-loop decision support.
            </p>

            {/* Official Notice Badge */}
            <div className="p-4 rounded-xl bg-[#171F1A]/80 border border-[#2E3D33] backdrop-blur-sm flex items-start space-x-3 text-xs text-[#FDF6E7]/90">
              <ShieldCheck className="w-5 h-5 text-[#F0C954] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F0C954] block mb-0.5 font-mono">DECISION-SUPPORT ASSURANCE:</span>
                NiYatra Pulse provides intelligent recommendations and conflict resolution proposals. Block schedules are never auto-approved and strictly require human officer authorization before publication.
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleStart}
                className="px-7 py-3.5 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-base transition-all shadow-lg flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>Access Pulse System</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#features"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDF6E7] font-medium text-base transition-all flex items-center justify-center border border-white/10"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A8B88A] font-mono">Departments Unified</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-white tabular-nums font-mono">3</span>
                <span className="text-xs text-amber-400 font-mono font-medium">ENG / SNT / TRD</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A8B88A] font-mono">Corridor Utilization</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-[#F0C954] tabular-nums font-mono">+34%</span>
                <span className="text-xs text-emerald-400 font-medium">Efficiency Gain</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A8B88A] font-mono">Conflict Auto-Merges</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-[#F0C954] tabular-nums font-mono">89%</span>
                <span className="text-xs text-slate-300">Shadow Windows</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A8B88A] font-mono">Safety Compliance</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-400 tabular-nums font-mono">100%</span>
                <span className="text-xs text-emerald-300">Officer Authorized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#D4A31C] uppercase tracking-widest font-mono">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#16311F] dark:text-white">
            Designed specifically for Indian Railways Operations
          </h2>
          <p className="text-[#6B6355] dark:text-[#A8B88A] text-base">
            Replacing fragmented departmental requests with unified multi-track block intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="panel-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-[#16311F] dark:text-white">
                1. Unified Backlog
              </h3>
              <p className="text-sm text-[#6B6355] dark:text-[#A8B88A] leading-relaxed">
                Single pane of glass aggregating independent requests from Engineering (ENG), Signals & Telecom (SNT), and Traction Distribution (TRD).
              </p>
            </div>
          </div>

          <div className="panel-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#132A1E]/10 border border-[#132A1E]/30 text-[#132A1E] dark:text-[#F0C954] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-[#16311F] dark:text-white">
                2. AI-Prioritized Scheduling
              </h3>
              <p className="text-sm text-[#6B6355] dark:text-[#A8B88A] leading-relaxed">
                Algorithmic scoring combining defect severity, overdue days, asset criticality, and train timetable busy slots to propose non-conflicting windows.
              </p>
            </div>
          </div>

          <div className="panel-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F0C954]/20 border border-[#F0C954]/40 text-[#132A1E] dark:text-[#F0C954] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-[#16311F] dark:text-white">
                3. Human-in-the-Loop Approval
              </h3>
              <p className="text-sm text-[#6B6355] dark:text-[#A8B88A] leading-relaxed">
                Controllers and Section Engineers review, customize, re-time, or reject block proposals with full audit trails and decision reasoning.
              </p>
            </div>
          </div>

          <div className="panel-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D4A31C]/10 border border-[#D4A31C]/30 text-[#D4A31C] flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-[#16311F] dark:text-white">
                4. Weekly & Monthly Visibility
              </h3>
              <p className="text-sm text-[#6B6355] dark:text-[#A8B88A] leading-relaxed">
                Strategic 4-week lookahead calendar and monthly division analytics tracking backlog clearance rates and section bottleneck points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#132A1E] text-[#FDF6E7] py-10 border-t border-[#224432]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Train className="w-4 h-4 text-[#F0C954]" />
            <span className="font-bold font-heading text-white">NiYatra — Indian Railways Decision-Support System</span>
          </div>
          <p className="text-[#A8B88A] font-mono text-[11px]">
            Designed for Section Engineers, Traffic Controllers & Divisional Railway Managers (DRM)
          </p>
        </div>
      </footer>
    </div>
  );
};
