import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Train,
  LayoutDashboard,
  Building2,
  ListOrdered,
  Calendar,
  AlertOctagon,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Type,
  Bell,
  LogOut,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { useApp, FontPairing } from '../context/AppContext';
import { NotificationsDrawer } from './NotificationsDrawer';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout,
    theme,
    toggleTheme,
    fontPairing,
    setFontPairing,
    sidebarCollapsed,
    toggleSidebar,
    toggleNotifications
  } = useApp();

  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const navItems = [
    ...(user.role === 'drm'
      ? [
          {
            name: 'Division Overview',
            path: '/app/division-overview',
            icon: Building2,
            drmOnly: true,
            description: 'Macro division level KPIs & backlog tracking'
          }
        ]
      : []),
    {
      name: 'Overview',
      path: '/app/overview',
      icon: LayoutDashboard,
      description: 'Corridor maintenance status & active requests'
    },
    {
      name: 'Priority Queue',
      path: '/app/priority-queue',
      icon: ListOrdered,
      description: 'Pulse AI prioritized backlog tasks'
    },
    {
      name: 'Block Calendar',
      path: '/app/block-calendar',
      icon: Calendar,
      description: 'Weekly & monthly merged block windows'
    },
    {
      name: 'Conflict Resolution',
      path: '/app/conflict-resolution',
      icon: AlertOctagon,
      description: 'Train traffic vs maintenance slot conflicts'
    },
    {
      name: 'Reports / Analytics',
      path: '/app/reports',
      icon: BarChart3,
      description: 'Departmental efficiency & backlog clearance'
    }
  ];

  const fontPairingLabels: Record<FontPairing, { title: string; desc: string }> = {
    serif: { title: 'Classic Railway (Serif)', desc: 'Cinzel / Playfair + Inter' },
    technical: { title: 'Technical Operations', desc: 'Barlow Semi-Condensed + Inter' },
    modern: { title: 'Modern Executive', desc: 'Plus Jakarta Sans + Inter' }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E7] dark:bg-[#171F1A] text-[#16311F] dark:text-[#FDF6E7] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#132A1E] text-[#FDF6E7] border-b border-[#224432] shadow-md h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Brand & Context */}
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F0C954] text-[#132A1E] flex items-center justify-center font-bold shadow-md">
              <Train className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold font-heading text-[#FDF6E7] tracking-tight">NiYatra</span>
                <span className="text-[10px] bg-[#F0C954]/20 text-[#F0C954] border border-[#F0C954]/40 font-mono font-bold px-1.5 py-0.5 rounded">
                  PULSE ENGINE
                </span>
              </div>
              <p className="text-[10px] text-[#A8B88A] font-mono tracking-wider">INDIAN RAILWAYS BLOCK PLANNING</p>
            </div>
          </div>

          {/* Division & Corridor Badge */}
          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-[#224432] text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[#FDF6E7] font-mono">
              {user.division}
            </span>
            <span className="text-[#A8B88A]">/</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#F0C954]/20 text-[#F0C954] font-mono border border-[#F0C954]/30">
              {user.corridor}
            </span>
          </div>
        </div>

        {/* Top Bar Controls */}
        <div className="flex items-center space-x-3">
          {/* FONT PAIRING SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setFontMenuOpen(!fontMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDF6E7] transition-colors flex items-center space-x-1.5 text-xs cursor-pointer"
              title="Font Switcher"
            >
              <Type className="w-4 h-4 text-[#F0C954]" />
              <span className="hidden lg:inline text-[11px] font-mono">Font Pair</span>
            </button>

            {fontMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FFFDF7] dark:bg-[#222E26] border border-[#EFE4CF] dark:border-[#2E3D33] rounded-2xl shadow-xl py-2 z-50 text-[#16311F] dark:text-[#FDF6E7]">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#6B6355] font-mono uppercase border-b border-[#EFE4CF] dark:border-[#2E3D33]">
                  Select Typography Pairing
                </div>
                {(['serif', 'technical', 'modern'] as FontPairing[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setFontPairing(key);
                      setFontMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-[#FDF6E7] dark:hover:bg-[#2C3830] transition-colors ${
                      fontPairing === key ? 'bg-[#FBEAAE] dark:bg-[#2A3423] border-l-4 border-[#132A1E]' : ''
                    }`}
                  >
                    <span className="font-bold text-[#16311F] dark:text-[#FDF6E7]">
                      {fontPairingLabels[key].title}
                    </span>
                    <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] font-mono">
                      {fontPairingLabels[key].desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* THEME SWITCHER BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDF6E7] transition-colors flex items-center space-x-1.5 cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#F0C954]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F0C954]" />
            )}
            <span className="hidden lg:inline text-[11px] font-mono capitalize">{theme} Mode</span>
          </button>

          {/* NOTIFICATIONS BELL */}
          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDF6E7] transition-colors cursor-pointer"
            title="Open Notifications"
          >
            <Bell className="w-4 h-4 text-[#F0C954]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#E2574C] animate-pulse"></span>
          </button>

          {/* USER PROFILE & ROLE BADGE */}
          <div className="relative pl-2 border-l border-[#224432]">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 text-xs hover:opacity-90 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#F0C954] text-[#132A1E] flex items-center justify-center text-xs font-bold shadow-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-[#FDF6E7] truncate max-w-[120px]">{user.name}</div>
                <div className="text-[10px] text-[#A8B88A] uppercase font-mono font-semibold">
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF7] dark:bg-[#222E26] border border-[#EFE4CF] dark:border-[#2E3D33] rounded-2xl shadow-xl py-2 z-50 text-[#16311F] dark:text-[#FDF6E7]">
                <div className="px-4 py-2 border-b border-[#EFE4CF] dark:border-[#2E3D33]">
                  <div className="text-xs font-bold text-[#16311F] dark:text-white">{user.name}</div>
                  <div className="text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono">{user.title}</div>
                </div>

                <div className="px-4 py-2 text-[11px] text-[#6B6355] dark:text-[#A8B88A] font-mono border-b border-[#EFE4CF] dark:border-[#2E3D33] space-y-0.5">
                  <div><strong>Division:</strong> {user.division}</div>
                  <div><strong>Corridor:</strong> {user.corridor}</div>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#132A1E] dark:text-[#F0C954] hover:bg-[#FDF6E7] dark:hover:bg-[#2C3830] font-medium"
                >
                  Switch Role / Division
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#E2574C] hover:bg-[#FDF6E7] dark:hover:bg-[#2C3830] font-medium flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Shell Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PERSISTENT LEFT SIDEBAR: Deep forest green #132A1E */}
        <aside
          className={`bg-[#132A1E] text-[#FDF6E7] border-r border-[#224432] flex flex-col justify-between transition-all duration-300 ease-in-out relative z-20 shrink-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* VISIBLE SLIDER / DRAG HANDLE BUTTON AT EDGE */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-[#F0C954] text-[#132A1E] border-2 border-[#132A1E] shadow-md flex items-center justify-center hover:bg-[#F7D97B] transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Navigation Links List */}
          <div className="p-3 space-y-2 flex-1 overflow-y-auto">
            <div className={`text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8B88A] px-3 pt-2 ${
              sidebarCollapsed ? 'text-center' : ''
            }`}>
              {sidebarCollapsed ? 'NAV' : 'Corridor Navigation'}
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center rounded-xl px-3 py-3 text-xs font-semibold transition-all group relative
                      ${
                        isActive
                          ? 'bg-[#F0C954] text-[#132A1E] shadow-md font-bold'
                          : 'text-[#FDF6E7]/80 hover:bg-white/10 hover:text-[#FDF6E7]'
                      }
                      ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}
                    `}
                  >
                    <IconComponent
                      className={`w-5 h-5 shrink-0 ${
                        isActive
                          ? 'text-[#132A1E]'
                          : 'text-[#A8B88A] group-hover:text-[#FDF6E7]'
                      }`}
                    />

                    {!sidebarCollapsed && (
                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.name}</span>
                          {item.drmOnly && (
                            <span className={`text-[9px] px-1 py-0.2 rounded font-bold font-mono ml-1 ${
                              isActive ? 'bg-[#132A1E]/20 text-[#132A1E]' : 'bg-[#F0C954]/20 text-[#F0C954]'
                            }`}>
                              DRM
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tooltip on collapse */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-[#0B1B13] text-[#FDF6E7] text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                        {item.name} {item.drmOnly && '(DRM Only)'}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-[#224432] bg-[#0B1B13]/60">
            {!sidebarCollapsed ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#FDF6E7]">
                  <ShieldCheck className="w-4 h-4 text-[#F0C954]" />
                  <span className="font-heading">Pulse Engine v1.0</span>
                </div>
                <p className="text-[10px] text-[#A8B88A] font-mono leading-tight">
                  Human-in-the-Loop Decision Support
                </p>
              </div>
            ) : (
              <div className="flex justify-center text-[#F0C954]">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>
        </aside>

        {/* MAIN VIEW CONTENT OUTLET */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col space-y-6 bg-[#FDF6E7] dark:bg-[#171F1A]">
          {/* Decision Support Assurance Banner */}
          <div className="bg-[#FBEAAE] dark:bg-[#272C1F] border border-[#F0C954] dark:border-[#3E4631] rounded-2xl p-3 sm:px-4 flex items-center justify-between text-xs text-[#16311F] dark:text-[#FDF6E7] shrink-0 shadow-sm">
            <div className="flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-[#132A1E] dark:text-[#F0C954] shrink-0" />
              <span>
                <strong>Decision-Support System:</strong> Proposed block windows require human officer review. Schedules are not final until explicitly approved.
              </span>
            </div>
            <span className="font-mono text-[10px] bg-[#132A1E] text-[#F0C954] px-2.5 py-1 rounded-lg font-bold uppercase shrink-0 hidden sm:inline">
              Officer Review Mode
            </span>
          </div>

          {/* Router Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Slide-over notifications drawer */}
      <NotificationsDrawer />
    </div>
  );
};
