import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const sources = [
    { name: 'USGS Earthquake Hazards Program', category: 'Seismic', status: 'Connected', update: 'Real-time', attribution: 'Public Domain' },
    { name: 'NASA FIRMS Wildfire Monitoring', category: 'Earth Observation', status: 'Connected', update: '10 min', attribution: 'NASA / MODIS' },
    { name: 'OpenStreetMap Nominatim', category: 'Geocoding', status: 'Connected', update: 'On demand', attribution: 'ODbL' },
    { name: 'Public Aviation ADS-B Feed', category: 'Aviation', status: 'Connected', update: 'Live', attribution: 'Authorized Public Feeds' },
    { name: 'AIS Maritime Telemetry', category: 'Maritime', status: 'Connected', update: 'Live', attribution: 'International Maritime Feeds' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Database className="w-4 h-4" />
          DATA SOURCE MANAGEMENT & REGISTRY
        </div>
        <h1 className="text-2xl font-bold text-white">Integrated Data Sources & Status</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time connection status, update frequency, and attribution notes for all platform integrations.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {sources.map((s, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span className="font-bold text-white">{s.name}</span>
                  <span>·</span>
                  <span>{s.category}</span>
                </div>
                <p className="text-xs text-slate-400">Attribution: {s.attribution}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                  {s.status}
                </span>
                <span className="text-slate-400">Update: {s.update}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
