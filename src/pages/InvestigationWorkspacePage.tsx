import React, { useState } from 'react';
import { FolderKanban, Plus, FileText, Calendar, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Investigation } from '../types';

export const InvestigationWorkspacePage: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([
    {
      id: 'inv-1',
      title: 'North Pacific Seismic Swarm Investigation',
      description: 'Analyzing consecutive seismic activity and correlating with maritime navigation advisories.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceReferences: ['USGS Feed #8841', 'IMB Nav Warning #21'],
      selectedEvents: ['eq-sample-1'],
      geoBookmarks: [{ name: 'Honshu Trench', lat: 38.22, lng: 142.50 }],
      notes: [
        { id: 'n-1', text: 'Magnitude 5.8 tremor recorded. No tsunami alert triggered.', timestamp: new Date().toISOString(), author: 'Ayush Yadav' }
      ],
      timeline: [
        { id: 't-1', time: '12:00 UTC', title: 'Initial USGS Detection', description: 'Seismic wave recorded off Honshu east coast.' }
      ],
      status: 'active'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const createInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const inv: Investigation = {
      id: `inv-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceReferences: [],
      selectedEvents: [],
      geoBookmarks: [],
      notes: [],
      timeline: [],
      status: 'active'
    };
    setInvestigations([inv, ...investigations]);
    setNewTitle('');
    setNewDesc('');
  };

  const exportJSON = (inv: Investigation) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${inv.title.toLowerCase().replace(/\s+/g, '-')}-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <FolderKanban className="w-4 h-4" />
            INVESTIGATION WORKSPACE
          </div>
          <h1 className="text-2xl font-bold text-white">Private Investigation Research Spaces</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize public source references, notes, chronologies, and export research records securely.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-4">Create New Investigation</h2>
          <form onSubmit={createInvestigation} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Investigation Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Atlantic Cable Anomaly"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Scope and objectives..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Initialize Investigation
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white">Active Investigations ({investigations.length})</h2>
          {investigations.map((inv) => (
            <div key={inv.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">Status: {inv.status}</span>
                  <h3 className="text-base font-bold text-white mt-1">{inv.title}</h3>
                </div>
                <button
                  onClick={() => exportJSON(inv)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
              </div>
              <p className="text-xs text-slate-300">{inv.description}</p>
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>Notes: <strong className="text-white">{inv.notes.length}</strong></span>
                <span>Timeline Entries: <strong className="text-white">{inv.timeline.length}</strong></span>
                <span>Bookmarks: <strong className="text-white">{inv.geoBookmarks.length}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
