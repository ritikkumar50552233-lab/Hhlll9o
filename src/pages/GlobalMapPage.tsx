import React, { useEffect, useState, useRef } from 'react';
import { Globe, Layers, Filter, Search, RefreshCw, AlertTriangle, Activity, Plane, Anchor } from 'lucide-react';
import { fetchUSGSEarthquakes, fetchMockAviation, fetchMockMaritime } from '../services/api';
import { GlobalEvent, AviationRecord, MaritimeRecord } from '../types';

export const GlobalMapPage: React.FC = () => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [aviation, setAviation] = useState<AviationRecord[]>([]);
  const [maritime, setMaritime] = useState<MaritimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Layer toggles
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showAviation, setShowAviation] = useState(true);
  const [showMaritime, setShowMaritime] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      const eqData = await fetchUSGSEarthquakes();
      const avData = fetchMockAviation();
      const marData = fetchMockMaritime();
      setEvents(eqData);
      setAviation(avData);
      setMaritime(marData);
      setLoading(false);
    }
    loadMapData();
  }, []);

  useEffect(() => {
    // Initialize Leaflet map if not already initialized
    if (!mapInstanceRef.current && mapContainerRef.current && (window as any).L) {
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [loading]);

  // Update markers on map when data or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Clear existing marker layers or groups if needed. For simplicity, we can render custom interactive overlay list + Leaflet map.
  }, [events, aviation, maritime, selectedCategory, showEarthquakes, showAviation, showMaritime]);

  const filteredEvents = events.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) && !e.locationName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 text-slate-100">
      {/* Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Interactive Global Command Map</h1>
            <p className="text-[11px] text-slate-400">Leaflet GL Engine • Real-time telemetry layers</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location or event..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setShowEarthquakes(!showEarthquakes)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${showEarthquakes ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-slate-400'}`}
            >
              Seismic
            </button>
            <button
              onClick={() => setShowAviation(!showAviation)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${showAviation ? 'bg-amber-500/20 text-amber-400 font-medium' : 'text-slate-400'}`}
            >
              Aviation
            </button>
            <button
              onClick={() => setShowMaritime(!showMaritime)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${showMaritime ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-400'}`}
            >
              Maritime
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport & Detail Drawer */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Leaflet Map Canvas Container */}
        <div ref={mapContainerRef} className="flex-1 h-full bg-slate-950 z-10" />

        {/* Fallback visual indicator if Leaflet loads */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex items-center justify-center text-xs text-cyan-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading global map tiles and telemetry layers...
          </div>
        )}

        {/* Floating Right Side Event Inspector Panel */}
        <div className="w-80 lg:w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-4 overflow-y-auto z-20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                Telemetry Inspector ({filteredEvents.length} Signals)
              </h2>
              <span className="text-[11px] text-slate-400">Live Feed</span>
            </div>

            <div className="space-y-3">
              {filteredEvents.slice(0, 10).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedItem(ev)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedItem?.id === ev.id
                      ? 'bg-cyan-500/10 border-cyan-500/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-cyan-400 font-mono uppercase">{ev.category}</span>
                    <span>{new Date(ev.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">{ev.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <div className="mt-4 p-3 bg-slate-950 border border-cyan-500/30 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-cyan-400">SELECTED SIGNAL</span>
                <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{selectedItem.title}</h4>
              <p className="text-[11px] text-slate-300 mb-2">{selectedItem.description}</p>
              <div className="text-[10px] text-slate-400 font-mono space-y-1">
                <p>Coordinates: {selectedItem.latitude}, {selectedItem.longitude}</p>
                <p>Source: {selectedItem.sourceName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
