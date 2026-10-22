import React, { useEffect, useState } from 'react';
import { Network, Search, RefreshCw } from 'lucide-react';
import { fetchIPLookup } from '../services/api';
import { IPIntelligenceData } from '../types';

export const IPIntelPage: React.FC = () => {
  const [ipInput, setIpInput] = useState('');
  const [data, setData] = useState<IPIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIP() {
      setLoading(true);
      const res = await fetchIPLookup();
      setData(res);
      setLoading(false);
    }
    loadIP();
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchIPLookup(ipInput);
    setData(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Network className="w-4 h-4" />
          IP INTELLIGENCE & GEOLOCATION
        </div>
        <h1 className="text-2xl font-bold text-white">Public IP & ASN Intelligence Lookup</h1>
        <p className="text-xs text-slate-400 mt-1">
          Approximate IP geolocation and routing references. Note that IP geolocation is approximate.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <form onSubmit={handleLookup} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IP address (leave blank for current lookup)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs">
            Inspect IP
          </button>
        </form>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
            Resolving IP registration & ASN records...
          </div>
        ) : data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px] mb-1">IP ADDRESS</span>
              <span className="text-white font-bold text-sm">{data.ip}</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px] mb-1">LOCATION</span>
              <span className="text-cyan-400 font-bold">{data.city}, {data.region}, {data.country}</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px] mb-1">ASN / ORGANIZATION</span>
              <span className="text-emerald-400 font-bold">{data.asn} — {data.org}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
