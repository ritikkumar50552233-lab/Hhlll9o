import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Activity,
  Compass,
  Satellite,
  Plane,
  Anchor,
  Globe2,
  Network,
  Newspaper,
  FolderKanban,
  Radar,
  Sparkles,
  Database,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Global Map View', icon: Globe },
    { id: 'events', label: 'Global Event Feed', icon: Activity },
    { id: 'osint', label: 'Geospatial OSINT', icon: Compass },
    { id: 'earth', label: 'Earth Observation', icon: Satellite },
    { id: 'aviation', label: 'Aviation Intelligence', icon: Plane },
    { id: 'maritime', label: 'Maritime Intelligence', icon: Anchor },
    { id: 'domain', label: 'Domain Intelligence', icon: Globe2 },
    { id: 'ip', label: 'IP Intelligence', icon: Network },
    { id: 'news', label: 'News Intelligence', icon: Newspaper },
    { id: 'investigations', label: 'Investigation Workspace', icon: FolderKanban },
    { id: 'situation', label: 'Situation Room', icon: Radar },
    { id: 'ai', label: 'Gemini AI Analysis', icon: Sparkles },
    { id: 'sources', label: 'Data Sources Registry', icon: Database },
    ...(isAdmin ? [{ id: 'admin', label: 'Administration Console', icon: ShieldAlert }] : []),
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="text-xs font-mono text-cyan-400 tracking-wider">
            OSINT COMMAND CORE
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate text-left">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <div className="p-3 m-3 bg-slate-900/50 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-emerald-400 font-semibold">ONLINE</span>
            <span>v2.4.0</span>
          </div>
          <p className="truncate">Founder: Ayush Yadav</p>
        </div>
      )}
    </aside>
  );
};
