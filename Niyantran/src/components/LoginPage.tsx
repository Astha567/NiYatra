import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Building2,
  GitBranch,
  Shield,
  ArrowRight,
  Train,
  Wrench,
  Radio,
  Award,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/schema';

const DIVISIONS = [
  {
    id: 'HWH',
    name: 'Howrah Division (HWH)',
    zone: 'Eastern Railway',
    corridors: [
      { id: 'HWH-BDC', name: 'HWH-BDC (Howrah - Bandel Main Line)' },
      { id: 'HWH-KGP', name: 'HWH-KGP (Howrah - Kharagpur Section)' },
      { id: 'BDC-KWAE', name: 'BDC-KWAE (Bandel - Katwa Line)' }
    ]
  },
  {
    id: 'SDAH',
    name: 'Sealdah Division (SDAH)',
    zone: 'Eastern Railway',
    corridors: [
      { id: 'SDAH-RHA', name: 'SDAH-RHA (Sealdah - Ranaghat Main Line)' },
      { id: 'SDAH-BT', name: 'SDAH-BT (Sealdah - Barasat Line)' },
      { id: 'SDAH-CAN', name: 'SDAH-CAN (Sealdah - Canning Section)' }
    ]
  },
  {
    id: 'ASN',
    name: 'Asansol Division (ASN)',
    zone: 'Eastern Railway',
    corridors: [
      { id: 'ASN-DHN', name: 'ASN-DHN (Asansol - Dhanbad Grand Chord)' },
      { id: 'ASN-DGR', name: 'ASN-DGR (Asansol - Durgapur Industrial Corridor)' }
    ]
  },
  {
    id: 'MLDT',
    name: 'Malda Division (MLDT)',
    zone: 'Eastern Railway',
    corridors: [
      { id: 'MLDT-NJP', name: 'MLDT-NJP (Malda - New Jalpaiguri Link)' },
      { id: 'MLDT-BGP', name: 'MLDT-BGP (Malda - Bhagalpur Section)' }
    ]
  }
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('controller');
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('HWH');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('HWH-BDC');

  const currentDivisionObj = DIVISIONS.find(d => d.id === selectedDivisionId) || DIVISIONS[0];

  const handleDivisionChange = (divId: string) => {
    setSelectedDivisionId(divId);
    const divObj = DIVISIONS.find(d => d.id === divId);
    if (divObj && divObj.corridors.length > 0) {
      setSelectedCorridorId(divObj.corridors[0].id);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentCorridorObj = currentDivisionObj.corridors.find(c => c.id === selectedCorridorId);

    login(
      selectedRole,
      currentDivisionObj.name,
      currentCorridorObj ? currentCorridorObj.name : selectedCorridorId
    );

    // Redirect based on role
    if (selectedRole === 'drm') {
      navigate('/app/division-overview');
    } else {
      navigate('/app/overview');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E7] dark:bg-[#171F1A] text-[#16311F] dark:text-[#FDF6E7] flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#EFE4CF] dark:border-[#2E3D33] mb-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-[#132A1E] text-[#F0C954] flex items-center justify-center shadow-sm">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold font-heading text-[#16311F] dark:text-[#FDF6E7]">NiYatra</span>
            <span className="ml-2 text-[10px] font-mono bg-[#F0C954]/20 text-[#132A1E] dark:text-[#F0C954] px-1.5 py-0.5 rounded border border-[#F0C954]/40 font-semibold">
              INDIAN RAILWAYS
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-[#6B6355] dark:text-[#A8B88A] hover:text-[#132A1E] dark:hover:text-white transition-colors"
        >
          ← Back to Public Page
        </button>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-4xl mx-auto w-full panel-card rounded-2xl shadow-xl overflow-hidden my-auto">
        <div className="bg-[#132A1E] p-6 text-[#FDF6E7] border-b border-[#224432] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#F0C954] font-mono font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Official Officer Authentication Portal</span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white">
              Corridor Block Planning System
            </h2>
            <p className="text-xs text-[#A8B88A]">
              Select your operational role and jurisdiction to access the NiYatra Pulse decision-support workspace.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-[#FDF6E7] shrink-0 font-mono">
            Eastern Railway Zone
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-8">
          {/* 1. ROLE SELECTION CARDS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6355] dark:text-[#A8B88A] font-mono mb-3">
              1. Select Officer Role
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Role 1: Section Engineer */}
              <div
                onClick={() => setSelectedRole('section_engineer')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  selectedRole === 'section_engineer'
                    ? 'border-[#132A1E] dark:border-[#F0C954] bg-[#FBEAAE]/40 dark:bg-[#272C1F] shadow-md'
                    : 'border-[#EFE4CF] dark:border-[#2E3D33] hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#222E26]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    {selectedRole === 'section_engineer' && (
                      <span className="w-5 h-5 rounded-full bg-[#132A1E] text-[#F0C954] flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#16311F] dark:text-white font-heading">
                    Section Engineer
                  </h4>
                  <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 leading-relaxed">
                    SSE / JE (Track, S&T, OHE). Manages departmental backlog requests & technical defect parameters.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                  Target: Corridor Overview
                </div>
              </div>

              {/* Role 2: Controller */}
              <div
                onClick={() => setSelectedRole('controller')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  selectedRole === 'controller'
                    ? 'border-[#132A1E] dark:border-[#F0C954] bg-[#FBEAAE]/40 dark:bg-[#272C1F] shadow-md'
                    : 'border-[#EFE4CF] dark:border-[#2E3D33] hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#222E26]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Radio className="w-5 h-5" />
                    </div>
                    {selectedRole === 'controller' && (
                      <span className="w-5 h-5 rounded-full bg-[#132A1E] text-[#F0C954] flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#16311F] dark:text-white font-heading">
                    Traffic Controller
                  </h4>
                  <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 leading-relaxed">
                    DOM / Controller. Evaluates AI proposed block slots against train traffic, approves or re-times windows.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                  Target: Corridor Overview
                </div>
              </div>

              {/* Role 3: DRM */}
              <div
                onClick={() => setSelectedRole('drm')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  selectedRole === 'drm'
                    ? 'border-[#F0C954] dark:border-[#F0C954] bg-[#FBEAAE] dark:bg-[#272C1F] shadow-md'
                    : 'border-[#EFE4CF] dark:border-[#2E3D33] hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#222E26]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0C954]/30 border border-[#F0C954] text-[#132A1E] dark:text-[#F0C954] flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    {selectedRole === 'drm' && (
                      <span className="w-5 h-5 rounded-full bg-[#F0C954] text-[#132A1E] flex items-center justify-center text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-base font-bold text-[#16311F] dark:text-white font-heading">
                      DRM / Executive
                    </h4>
                    <span className="text-[10px] bg-[#132A1E] text-[#F0C954] px-1.5 py-0.2 rounded font-bold font-mono">
                      EXECUTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] mt-1 leading-relaxed">
                    Divisional Railway Manager / Sr. DOM. Macro monthly plan oversight, backlog clearance rates, and division analytics.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EFE4CF] dark:border-[#2E3D33] text-[11px] text-[#132A1E] dark:text-[#F0C954] font-mono font-bold">
                  Target: Division Overview
                </div>
              </div>
            </div>
          </div>

          {/* 2. DIVISION AND CORRIDOR SELECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6355] dark:text-[#A8B88A] font-mono mb-2 flex items-center space-x-1">
                <Building2 className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954]" />
                <span>2. Select Division</span>
              </label>
              <select
                value={selectedDivisionId}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-white dark:bg-[#1A241E] text-[#16311F] dark:text-white text-sm focus:ring-2 focus:ring-[#F0C954] outline-none transition-colors"
              >
                {DIVISIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name} — {div.zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6355] dark:text-[#A8B88A] font-mono mb-2 flex items-center space-x-1">
                <GitBranch className="w-4 h-4 text-[#D4A31C]" />
                <span>3. Select Corridor / Section</span>
              </label>
              <select
                value={selectedCorridorId}
                onChange={(e) => setSelectedCorridorId(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-white dark:bg-[#1A241E] text-[#16311F] dark:text-white text-sm focus:ring-2 focus:ring-[#F0C954] outline-none transition-colors"
              >
                {currentDivisionObj.corridors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-[#EFE4CF] dark:border-[#2E3D33] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B6355] dark:text-[#A8B88A] flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Logging in as <strong className="text-[#16311F] dark:text-[#FDF6E7] capitalize">{selectedRole.replace('_', ' ')}</strong> in <strong className="text-[#16311F] dark:text-[#FDF6E7]">{selectedDivisionId}</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F0C954] hover:bg-[#F7D97B] text-[#132A1E] font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              <span>Enter Decision Support Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#132A1E]" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer info */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-[#6B6355] dark:text-[#A8B88A] py-4 font-mono">
        NiYatra Pulse Decision-Support System • Ministry of Railways • Stage 1 Active
      </div>
    </div>
  );
};
