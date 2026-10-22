import React from 'react';
import { Satellite, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const EarthObservationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Satellite className="w-4 h-4" />
            EARTH OBSERVATION & SATELLITE IMAGERY
          </div>
          <h1 className="text-2xl font-bold text-white">Multispectral Satellite & Thermal Anomalies</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized NASA Earthdata services, MODIS/VIIRS thermal anomaly feeds, and environmental monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'MODIS Thermal Wildfire Layer', provider: 'NASA FIRMS', status: 'Connected', update: '10 min ago', region: 'North America / Siberia' },
          { title: 'Sentinel-2 True Color Imagery', provider: 'ESA Copernicus', status: 'Connected', update: '1 hour ago', region: 'Mediterranean Basin' },
          { title: 'Atmospheric Aerosol Optical Depth', provider: 'NASA Earthdata', status: 'Active', update: 'Real-time', region: 'Global' }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-mono">
                {item.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">{item.update}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            <p className="text-xs text-slate-400">Provider: <span className="text-slate-200">{item.provider}</span></p>
            <p className="text-xs text-slate-400">Region: <span className="text-slate-200">{item.region}</span></p>
            <button className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-xs font-medium transition-colors">
              Inspect Layer Metadata
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
