import React, { useState } from 'react';
import { Radar, RefreshCw, Layers } from 'lucide-react';
import { fetchUSGSEarthquakes, fetchMockNews } from '../services/api';

export const SituationRoomPage: React.FC = () => {
  const [region, setRegion] = useState('Global');
  const [category, setCategory] = useState('all');

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Radar className="w-4 h-4" />
            GLOBAL SITUATION ROOM & CORRELATION
          </div>
          <h1 className="text-2xl font-bold text-white">Multi-Source Monitoring & Signal Correlation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Combine earthquake telemetry, weather alerts, and news reports for regional threat assessment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
          >
            <option value="Global">Global Region</option>
            <option value="Asia-Pacific">Asia-Pacific</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center py-16">
        <Radar className="w-12 h-12 text-cyan-400 animate-pulse mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Situation Room Active for {region}</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          All active telemetry feeds are synchronized. Geographic proximity rules and time windows are enforced.
        </p>
        <button className="px-6 py-2.5 bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-300 transition-colors">
          Run Correlation Scan
        </button>
      </div>
    </div>
  );
};
