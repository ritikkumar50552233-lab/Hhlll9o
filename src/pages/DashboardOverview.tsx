import React, { useEffect, useState } from 'react';
import { Activity, Globe, Satellite, Plane, Anchor, AlertTriangle, ShieldCheck, ArrowUpRight, RefreshCw, Sparkles } from 'lucide-react';
import { fetchUSGSEarthquakes, fetchMockNews } from '../services/api';
import { GlobalEvent, NewsReport } from '../types';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [news, setNews] = useState<NewsReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const eqData = await fetchUSGSEarthquakes();
      const newsData = fetchMockNews();
      setEvents(eqData);
      setNews(newsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const criticalCount = events.filter(e => e.severity === 'critical' || e.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            LIVE INTELLIGENCE COMMAND CENTER
          </div>
          <h1 className="text-2xl font-bold text-white">Global Situation Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry feeds connected across USGS seismology, NASA FIRMS, and OSINT wire services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ai')}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Gemini AI Briefing
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Globe className="w-4 h-4" />
            Open Interactive Map
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Seismic Signals', count: events.length, change: '+12% 24h', icon: Activity, color: 'text-cyan-400', tab: 'events' },
          { label: 'Critical Anomalies', count: criticalCount, change: 'Requires review', icon: AlertTriangle, color: 'text-rose-400', tab: 'events' },
          { label: 'Active Aircraft Tracked', count: '1,428', change: 'Live Telemetry', icon: Plane, color: 'text-amber-400', tab: 'aviation' },
          { label: 'Maritime Vessels Monitored', count: '890', change: 'AIS Feeds Active', icon: Anchor, color: 'text-emerald-400', tab: 'maritime' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(stat.tab)}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{stat.count}</span>
                <span className="text-[11px] text-slate-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Events & News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Seismic & Natural Events */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Latest Global Events Feed (USGS & Live Sensors)
            </h2>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
              Ingesting real-time global event feeds...
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {events.slice(0, 6).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setActiveTab('map')}
                  className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl hover:border-cyan-500/40 transition-all flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                      <span className="uppercase font-mono text-cyan-400">{ev.category}</span>
                      <span>·</span>
                      <span>{new Date(ev.eventTime).toLocaleTimeString()}</span>
                      <span>·</span>
                      <span className="text-slate-300">{ev.sourceName}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{ev.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ev.description}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase shrink-0 ${
                      ev.severity === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : ev.severity === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {ev.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intelligence News & Wires */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">OSINT Wires & News</h2>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              All wire feeds <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {news.map((item) => (
              <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="text-cyan-400">{item.category}</span>
                  <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{item.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.summary}</p>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">Source: {item.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
