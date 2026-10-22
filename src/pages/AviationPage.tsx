import React, { useEffect, useState } from 'react';
import { Plane, Search, RefreshCw } from 'lucide-react';
import { fetchMockAviation } from '../services/api';
import { AviationRecord } from '../types';

export const AviationPage: React.FC = () => {
  const [flights, setFlights] = useState<AviationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFlights(fetchMockAviation());
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Plane className="w-4 h-4" />
            AVIATION INTELLIGENCE MODULE
          </div>
          <h1 className="text-2xl font-bold text-white">Global Flight Telemetry & Airspace Monitoring</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized public flight tracking feed. Respects privacy and API rate limits.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-300 uppercase">
          Active Tracked Aircraft ({flights.length})
        </div>
        <div className="divide-y divide-slate-800">
          {flights.map((f) => (
            <div key={f.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-950/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span className="font-bold text-white">{f.callsign}</span>
                  <span>·</span>
                  <span>{f.aircraftType}</span>
                </div>
                <p className="text-xs text-slate-300">Route: {f.origin} ➔ {f.destination}</p>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500">ALTITUDE</span>
                  <span className="text-white">{f.altitudeFt} ft</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">GROUND SPEED</span>
                  <span className="text-white">{f.groundSpeedKnots} kts</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">HEADING</span>
                  <span className="text-white">{f.heading}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
