import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ListOrdered,
  AlertOctagon,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  route: string;
  category: 'defect' | 'sla_breach' | 'conflict' | 'approval';
  icon: any;
}

export const MOCK_NOTIFICATION_DATA: NotificationItem[] = [
  {
    id: 'NOTIF-101',
    title: 'Critical USFD Rail Defect Raised',
    message: 'Engineering (ENG) logged high-criticality rail weld flaw on HWH-BDC (Km 12.4 - 15.8). Priority Score: 94.',
    time: '10 mins ago',
    type: 'danger',
    category: 'defect',
    route: '/app/priority-queue',
    icon: AlertTriangle
  },
  {
    id: 'NOTIF-102',
    title: 'Inter-Departmental Block Conflict Flagged',
    message: 'Overlapping block requests between ENG Turnout Renewal & TRD Substation Inspection on HWH-KGP.',
    time: '35 mins ago',
    type: 'warning',
    category: 'conflict',
    route: '/app/conflict-resolution',
    icon: AlertOctagon
  },
  {
    id: 'NOTIF-103',
    title: 'AI Merged Block Proposal Awaiting Approval',
    message: 'Pulse unified 3 departmental requests into single 180-min shadow window BLK-2026-W1-01 for Tuesday 01:30.',
    time: '1 hour ago',
    type: 'info',
    category: 'approval',
    route: '/app/block-calendar',
    icon: Calendar
  },
  {
    id: 'NOTIF-104',
    title: 'SLA Maintenance Window Warning',
    message: 'Signal & Telecom Axle Counter sensor maintenance on SDAH-RHA exceeds 10-day SLA window.',
    time: '2 hours ago',
    type: 'danger',
    category: 'sla_breach',
    route: '/app/priority-queue',
    icon: ShieldAlert
  },
  {
    id: 'NOTIF-105',
    title: 'Officer Action Recorded',
    message: 'Sr. DEN Howrah approved block BLK-2026-W1-02. Speed restrictions updated.',
    time: '4 hours ago',
    type: 'success',
    category: 'approval',
    route: '/app/block-calendar',
    icon: CheckCircle2
  }
];

export const NotificationsDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { notificationsOpen, setNotificationsOpen } = useApp();

  if (!notificationsOpen) return null;

  const handleNotificationClick = (route: string) => {
    setNotificationsOpen(false);
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF7] dark:bg-[#222E26] border-l border-[#EFE4CF] dark:border-[#2E3D33] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 bg-[#132A1E] text-[#FDF6E7] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#F0C954] text-[#132A1E]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">Notifications & Alerts</h3>
                <p className="text-xs text-[#A8B88A] font-mono">Real-Time Pulse Event Stream</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-2 rounded-lg text-[#A8B88A] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="px-3 py-2 bg-[#FBEAAE] dark:bg-[#272C1F] border border-[#F0C954] rounded-xl text-xs text-[#16311F] dark:text-[#FDF6E7] flex items-center justify-between">
              <span className="font-semibold font-mono">Pulse Active Event Queue</span>
              <span className="font-mono text-[10px] bg-[#132A1E] text-[#F0C954] px-2 py-0.5 rounded font-bold">
                {MOCK_NOTIFICATION_DATA.length} EVENTS
              </span>
            </div>

            {MOCK_NOTIFICATION_DATA.map((item) => {
              const IconComp = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item.route)}
                  className="p-4 rounded-xl border border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] hover:border-[#F0C954] hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${
                        item.type === 'danger' ? 'bg-[#E2574C]/15 text-[#E2574C]' :
                        item.type === 'warning' ? 'bg-amber-500/15 text-amber-600' :
                        item.type === 'success' ? 'bg-emerald-500/15 text-emerald-600' :
                        'bg-sky-500/15 text-sky-600'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#16311F] dark:text-white group-hover:text-[#D4A31C]">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#6B6355] dark:text-[#A8B88A] font-mono">{item.time}</span>
                  </div>

                  <p className="text-xs text-[#6B6355] dark:text-[#A8B88A] pl-7 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="pl-7 pt-1 flex items-center text-[10px] font-mono font-bold text-[#132A1E] dark:text-[#F0C954] group-hover:underline">
                    <span>View in Dashboard</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#EFE4CF] dark:border-[#2E3D33] bg-[#FDF6E7]/60 dark:bg-[#1A241E] text-center">
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-xs font-bold text-[#132A1E] dark:text-[#F0C954] hover:underline"
            >
              Close Notifications Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
