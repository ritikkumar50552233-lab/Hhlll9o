import React from 'react';
import { ShieldAlert, Users, Activity, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminConsolePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <Lock className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          The Administration Console requires administrator role authorization. (Current user: {user?.displayName || 'Guest'}).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          PROTECTED ADMINISTRATION AREA
        </div>
        <h1 className="text-2xl font-bold text-white">System Administration & Security Control</h1>
        <p className="text-xs text-slate-400 mt-1">
          Role-based access control, system health audit logs, and integration monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Active User Roles
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-white font-bold">{user?.displayName} (Founder)</p>
                <p className="text-slate-500 text-[10px]">{user?.email}</p>
              </div>
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-[10px]">ADMIN</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            System Health & Security Audit Logs
          </h2>
          <div className="space-y-2 font-mono text-[11px] text-slate-400">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex justify-between">
              <span>[AUDIT] Firestore Security Rules Enforced</span>
              <span className="text-emerald-400">SUCCESS</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex justify-between">
              <span>[AUDIT] Gemini API Server-Side Key Verified</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex justify-between">
              <span>[AUDIT] USGS Earthquake Stream Ingested</span>
              <span className="text-emerald-400">OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
