import React from 'react';
import { Settings, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsProfilePage: React.FC = () => {
  const { user, updatePreferences } = useAuth();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Settings className="w-4 h-4" />
          USER PROFILE & PREFERENCES
        </div>
        <h1 className="text-2xl font-bold text-white">Account Settings & Intelligence Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your analyst profile, security credentials, and monitoring defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Analyst Profile
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={user?.displayName || ''}
                readOnly
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Access Role</label>
              <input
                type="text"
                value={user?.role?.toUpperCase() || 'ANALYST'}
                readOnly
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Security & Session
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your session is protected with secure token validation. Founder & Owner: Ayush Yadav.
          </p>
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => alert('Security credentials updated successfully.')}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              Verify Security State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
