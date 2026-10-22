import React, { useState } from 'react';
import { Newspaper, Search, ExternalLink } from 'lucide-react';
import { fetchMockNews } from '../services/api';
import { NewsReport } from '../types';

export const NewsIntelPage: React.FC = () => {
  const [news] = useState<NewsReport[]>(fetchMockNews());
  const [search, setSearch] = useState('');

  const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Newspaper className="w-4 h-4" />
            GLOBAL NEWS & OSINT WIRES
          </div>
          <h1 className="text-2xl font-bold text-white">Aggregated Intelligence News Feeds</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized public news aggregation and cross-source reporting comparisons.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news wires..."
            className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="text-cyan-400">{item.category}</span>
                <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.summary}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">{item.source}</span>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                Original report <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
