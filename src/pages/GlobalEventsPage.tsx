import React, { useEffect, useState } from 'react';
import { Activity, Search, Filter, RefreshCw, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { fetchUSGSEarthquakes } from '../services/api';
import { GlobalEvent } from '../types';

export const GlobalEventsPage: React.FC = () => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await fetchUSGSEarthquakes();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const filtered = events.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.locationName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Activity className="w-4 h-4" />
            LIVE TELEMETRY FEED
          </div>
          <h1 className="text-2xl font-bold text-white">Global Events & Seismic Monitoring</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized real-time seismic and natural event ingestion from USGS and global sensors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event reports..."
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'earthquake', 'wildfire', 'weather', 'geopolitical', 'maritime'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          Synchronizing seismic and event feeds...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <div key={ev.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span className="text-cyan-400 uppercase">{ev.category}</span>
                  <span className={ev.severity === 'critical' ? 'text-rose-400' : 'text-slate-400'}>
                    Severity: {ev.severity}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ev.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{new Date(ev.eventTime).toLocaleString()}</span>
                <a
                  href={ev.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                >
                  {ev.sourceName} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
