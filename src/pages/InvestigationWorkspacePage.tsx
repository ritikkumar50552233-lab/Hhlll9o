import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, FileText, Calendar, Download, Trash2, CheckCircle2, Bookmark, MapPin } from 'lucide-react';
import { Investigation } from '../types';

export const InvestigationWorkspacePage: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>(() => {
    const saved = localStorage.getItem('worldveil_investigations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'inv-1',
        title: 'Pacific Rim Seismic Swarm Investigation',
        description: 'Analyzing consecutive seismic activity and correlating with maritime shipping lanes and coastal infrastructure alerts.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceReferences: ['USGS Seismology Feed #4421', 'IMB Navigational Notice'],
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
    ];
  });

  const [savedMarkers, setSavedMarkers] = useState<any[]>(() => {
    const saved = localStorage.getItem('worldveil_saved_markers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedInvId, setSelectedInvId] = useState<string>('inv-1');

  useEffect(() => {
    localStorage.setItem('worldveil_investigations', JSON.stringify(investigations));
  }, [investigations]);

  const createInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const inv: Investigation = {
      id: `inv-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'No description provided.',
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
    setSelectedInvId(inv.id);
    setNewTitle('');
    setNewDesc('');
  };

  const addNoteToActiveInv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setInvestigations(investigations.map(inv => {
      if (inv.id === selectedInvId) {
        return {
          ...inv,
          notes: [...inv.notes, {
            id: `note-${Date.now()}`,
            text: newNote,
            timestamp: new Date().toISOString(),
            author: 'Analyst'
          }],
          updatedAt: new Date().toISOString()
        };
      }
      return inv;
    }));
    setNewNote('');
  };

  const deleteInvestigation = (id: string) => {
    setInvestigations(investigations.filter(i => i.id !== id));
    if (selectedInvId === id && investigations.length > 1) {
      setSelectedInvId(investigations[0].id);
    }
  };

  const exportJSON = (inv: Investigation) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${inv.title.toLowerCase().replace(/\s+/g, '-')}-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const activeInv = investigations.find(i => i.id === selectedInvId) || investigations[0];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <FolderKanban className="w-4 h-4" />
            INVESTIGATION WORKSPACE
          </div>
          <h1 className="text-2xl font-bold text-white">Encrypted OSINT Dossiers & Research</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize public signals, sensor bookmarks, findings from Google Maps, and analyst notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create & Saved Telemetry Markers */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold text-white mb-4">Create New Dossier</h2>
            <form onSubmit={createInvestigation} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dossier Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Eastern Mediterranean Seismic Cluster"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Investigation Scope</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Target objectives, region, and risk hypothesis..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Initialize Dossier
              </button>
            </form>
          </div>

          {/* Telemetry Findings Saved From Google Maps */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Signals Saved from Google Map ({savedMarkers.length})
            </h3>
            {savedMarkers.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No telemetry pins saved yet. Click on any pin in the Google Map and select "Save Finding" to pin it here.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedMarkers.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-mono text-cyan-400 uppercase">{m.type}</span>
                      <span>{m.lat?.toFixed(2)}, {m.lng?.toFixed(2)}</span>
                    </div>
                    <p className="font-semibold text-white truncate">{m.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Investigation Details, Notes, and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {investigations.map((inv) => (
              <button
                key={inv.id}
                onClick={() => setSelectedInvId(inv.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedInvId === inv.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                {inv.title}
              </button>
            ))}
          </div>

          {activeInv && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase mb-1">
                    <span>Status: {activeInv.status}</span>
                    <span>•</span>
                    <span>Created: {new Date(activeInv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{activeInv.title}</h2>
                  <p className="text-xs text-slate-300 mt-1">{activeInv.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportJSON(activeInv)}
                    className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Dossier
                  </button>
                  {investigations.length > 1 && (
                    <button
                      onClick={() => deleteInvestigation(activeInv.id)}
                      className="p-1.5 bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg text-xs transition-colors"
                      title="Delete dossier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Add Note Section */}
              <div>
                <h3 className="text-xs font-bold text-white mb-2">Analyst Working Notes ({activeInv.notes.length})</h3>
                <form onSubmit={addNoteToActiveInv} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an intelligence observation or log finding..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                  >
                    Add Log
                  </button>
                </form>

                <div className="space-y-2">
                  {activeInv.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-cyan-400">{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
