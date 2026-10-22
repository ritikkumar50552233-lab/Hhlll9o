import React, { useState } from 'react';
import { Globe, Shield, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDashboard: boolean;
  setIsDashboard: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeTab,
  setActiveTab,
  isDashboard,
  setIsDashboard,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Zone 1: Single text element Brand Wordmark */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
        onClick={() => { setIsDashboard(false); setActiveTab('landing'); }}
      >
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Globe className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            WORLDVEIL
          </span>
          <span className="text-xs text-cyan-400 font-mono tracking-widest block -mt-1">
            INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        {!isDashboard ? (
          <>
            <button onClick={() => { setIsDashboard(false); setActiveTab('landing'); }} className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
              Overview
            </button>
            <button onClick={() => { setIsDashboard(false); setActiveTab('features'); }} className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
              Capabilities
            </button>
            <button onClick={() => { setIsDashboard(false); setActiveTab('transparency'); }} className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
              Data Transparency
            </button>
            <button onClick={() => { setIsDashboard(false); setActiveTab('about'); }} className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
              About
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SECURE GLOBAL FEED ONLINE
            </div>
            <span className="text-xs text-slate-400 font-mono">
              FOUNDER: AYUSH YADAV
            </span>
          </>
        )}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {!isDashboard ? (
          <>
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setIsDashboard(true);
                  setActiveTab('overview');
                } else {
                  onOpenAuth('signup');
                }
              }}
              className="px-4 py-2 text-xs font-medium text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAuthenticated ? 'Enter Dashboard' : 'Create Free Account'}
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                {user?.displayName ? user.displayName[0] : 'A'}
              </div>
              <span className="text-slate-200 font-medium hidden sm:inline">{user?.displayName || 'Analyst'}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="font-semibold text-white">{user?.displayName}</p>
                  <p className="text-slate-400 truncate">{user?.email}</p>
                  <p className="text-cyan-400 font-mono mt-1 uppercase text-[10px]">Role: {user?.role || 'analyst'}</p>
                </div>
                <button
                  onClick={() => { setActiveTab('settings'); setUserMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setIsDashboard(false);
                    setActiveTab('landing');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Public Landing Page
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsDashboard(false);
                    setActiveTab('landing');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 md:hidden flex flex-col gap-3 text-sm">
          {!isDashboard ? (
            <>
              <button onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Overview</button>
              <button onClick={() => { setActiveTab('features'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Capabilities</button>
              <button onClick={() => { setActiveTab('transparency'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Data Transparency</button>
              <button onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">About</button>
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center text-slate-300 bg-slate-900 rounded-lg">Sign In</button>
                <button onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }} className="flex-1 py-2 text-center text-slate-950 bg-cyan-400 rounded-lg font-medium">Get Started</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Dashboard Overview</button>
              <button onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Interactive Map</button>
              <button onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }} className="text-left py-2 text-slate-300">Global Events</button>
              <button onClick={() => { setIsDashboard(false); setMobileMenuOpen(false); }} className="text-left py-2 text-cyan-400">Exit to Public Site</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
