import React, { useEffect, useState } from 'react';
import { Anchor } from 'lucide-react';
import { fetchMockMaritime } from '../services/api';
import { MaritimeRecord } from '../types';

export const MaritimePage: React.FC = () => {
  const [vessels, setVessels] = useState<MaritimeRecord[]>([]);

  useEffect(() => {
    setVessels(fetchMockMaritime());
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Anchor className="w-4 h-4" />
            MARITIME INTELLIGENCE & AIS
          </div>
          <h1 className="text-2xl font-bold text-white">Global Vessel Tracking & Shipping Lanes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized AIS vessel telemetry, course, speed, and destination monitoring.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-300 uppercase">
          Monitored Commercial Vessels ({vessels.length})
        </div>
        <div className="divide-y divide-slate-800">
          {vessels.map((v) => (
            <div key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-950/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span className="font-bold text-white">{v.vesselName}</span>
                  <span>·</span>
                  <span>MMSI: {v.mmsi}</span>
                </div>
                <p className="text-xs text-slate-300">Type: {v.vesselType} ({v.flag}) ➔ Destination: {v.destination}</p>
              </div>
              <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500">SPEED</span>
                  <span className="text-white">{v.speedKnots} kts</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">HEADING</span>
                  <span className="text-white">{v.heading}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
