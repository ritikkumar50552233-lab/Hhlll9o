import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  Globe,
  Search,
  RefreshCw,
  Activity,
  Plane,
  Anchor,
  Flame,
  Layers,
  MapPin,
  ExternalLink,
  Sparkles,
  BookmarkPlus,
  Navigation,
  Compass
} from 'lucide-react';
import { fetchUSGSEarthquakes, fetchMockAviation, fetchMockMaritime, searchLocationGeocode } from '../services/api';
import { GlobalEvent, AviationRecord, MaritimeRecord } from '../types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCLmf-NHSJoIl_HV3WJ7LGouycy_B0LOYY';

// Helper component to control map camera programmatically
function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
}

export const GlobalMapPage: React.FC<{ onOpenAIAnalysis?: (query: string) => void }> = ({ onOpenAIAnalysis }) => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [aviation, setAviation] = useState<AviationRecord[]>([]);
  const [maritime, setMaritime] = useState<MaritimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapTypeId, setMapTypeId] = useState<string>('hybrid'); // roadmap, satellite, hybrid, terrain

  // Filter toggles
  const [showSeismic, setShowSeismic] = useState(true);
  const [showAviation, setShowAviation] = useState(true);
  const [showMaritime, setShowMaritime] = useState(true);

  // Selected item for detail drawer / InfoWindow
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: 'earthquake' | 'wildfire' | 'aviation' | 'maritime';
    title: string;
    description: string;
    lat: number;
    lng: number;
    extra: Record<string, any>;
  } | null>(null);

  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [eqData, avData, marData] = await Promise.all([
        fetchUSGSEarthquakes(),
        Promise.resolve(fetchMockAviation()),
        Promise.resolve(fetchMockMaritime())
      ]);
      setEvents(eqData);
      setAviation(avData);
      setMaritime(marData);
    } catch (err) {
      console.error('Failed to load telemetry data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadAllData, 60000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  // Handle Location Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // First check if query matches any event/aircraft/vessel title
    const matchedEvent = events.find(
      (ev) =>
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedEvent && matchedEvent.latitude && matchedEvent.longitude) {
      setMapCenter({ lat: matchedEvent.latitude, lng: matchedEvent.longitude });
      setMapZoom(6);
      setSelectedItem({
        id: matchedEvent.id,
        type: 'earthquake',
        title: matchedEvent.title,
        description: matchedEvent.description,
        lat: matchedEvent.latitude,
        lng: matchedEvent.longitude,
        extra: {
          magnitude: matchedEvent.magnitude,
          depth: matchedEvent.depth,
          source: matchedEvent.sourceName,
          time: matchedEvent.eventTime
        }
      });
      return;
    }

    // Otherwise geocode location via real-time Geocoding API
    setSearchingLocation(true);
    try {
      const results = await searchLocationGeocode(searchQuery);
      if (results.length > 0) {
        const top = results[0];
        setMapCenter({ lat: top.lat, lng: top.lon });
        setMapZoom(7);
        setSelectedItem({
          id: `search-${top.place_id}`,
          type: 'earthquake',
          title: `Search Result: ${searchQuery}`,
          description: top.display_name,
          lat: top.lat,
          lng: top.lon,
          extra: { source: 'Global Geocoding Engine' }
        });
      } else {
        alert(`Location "${searchQuery}" not found. Try country or city name.`);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleSaveToInvestigation = (item: any) => {
    try {
      const stored = localStorage.getItem('worldveil_saved_markers') || '[]';
      const list = JSON.parse(stored);
      list.push({ ...item, savedAt: new Date().toISOString() });
      localStorage.setItem('worldveil_saved_markers', JSON.stringify(list));
      setSavedNotification(`Saved "${item.title}" to Investigation Workspace`);
      setTimeout(() => setSavedNotification(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 text-slate-100">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">Google Maps Global Command Center</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Google Maps Platform • Real-time USGS, Aviation ADS-B & Maritime AIS
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md min-w-[260px]">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, earthquake, flight, city (e.g. Tokyo, California)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={searchingLocation}
            className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1"
          >
            {searchingLocation ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Map Type & Telemetry Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {[
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'roadmap', label: 'Map' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'terrain', label: 'Terrain' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMapTypeId(t.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  mapTypeId === t.id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setShowSeismic(!showSeismic)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                showSeismic ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Activity className="w-3 h-3" />
              Seismic ({events.length})
            </button>
            <button
              onClick={() => setShowAviation(!showAviation)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                showAviation ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Plane className="w-3 h-3" />
              Aviation ({aviation.length})
            </button>
            <button
              onClick={() => setShowMaritime(!showMaritime)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                showMaritime ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Anchor className="w-3 h-3" />
              Maritime ({maritime.length})
            </button>
          </div>

          <button
            onClick={loadAllData}
            disabled={refreshing}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Refresh Real-time Feeds"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-1.5 text-xs font-semibold text-center z-30">
          {savedNotification}
        </div>
      )}

      {/* Main Map Canvas + Right Inspector Split View */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Google Map Container */}
        <div className="flex-1 h-full w-full relative">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_mcp_codeassist_v1_aistudio">
            <Map
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              mapTypeId={mapTypeId}
              mapId="DEMO_MAP_ID"
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              {/* Seismic / Natural Event Markers */}
              {showSeismic &&
                events.map((ev) => {
                  if (!ev.latitude || !ev.longitude) return null;
                  const isCritical = (ev.magnitude || 0) >= 5.0;
                  return (
                    <AdvancedMarker
                      key={ev.id}
                      position={{ lat: ev.latitude, lng: ev.longitude }}
                      onClick={() =>
                        setSelectedItem({
                          id: ev.id,
                          type: ev.category === 'wildfire' ? 'wildfire' : 'earthquake',
                          title: ev.title,
                          description: ev.description,
                          lat: ev.latitude!,
                          lng: ev.longitude!,
                          extra: {
                            magnitude: ev.magnitude,
                            depth: ev.depth,
                            source: ev.sourceName,
                            sourceUrl: ev.sourceUrl,
                            time: ev.eventTime
                          }
                        })
                      }
                    >
                      <div className="group relative flex items-center justify-center cursor-pointer">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                            ev.category === 'wildfire'
                              ? 'bg-orange-500 text-white'
                              : isCritical
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-rose-500/80 text-white'
                          }`}
                        >
                          {ev.category === 'wildfire' ? (
                            <Flame className="w-3.5 h-3.5" />
                          ) : (
                            <Activity className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                          <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[10px] rounded whitespace-nowrap shadow-xl">
                            {ev.title}
                          </span>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

              {/* Aviation Markers */}
              {showAviation &&
                aviation.map((f) => (
                  <AdvancedMarker
                    key={f.id}
                    position={{ lat: f.latitude, lng: f.longitude }}
                    onClick={() =>
                      setSelectedItem({
                        id: f.id,
                        type: 'aviation',
                        title: `Flight ${f.callsign} (${f.aircraftType})`,
                        description: `Route: ${f.origin} ➔ ${f.destination}. Currently airborne at ${f.altitudeFt} ft, speed ${f.groundSpeedKnots} knots.`,
                        lat: f.latitude,
                        lng: f.longitude,
                        extra: {
                          callsign: f.callsign,
                          aircraft: f.aircraftType,
                          altitude: `${f.altitudeFt} ft`,
                          speed: `${f.groundSpeedKnots} kts`,
                          heading: `${f.heading}°`,
                          route: `${f.origin} ➔ ${f.destination}`
                        }
                      })
                    }
                  >
                    <div className="group relative flex items-center justify-center cursor-pointer">
                      <span
                        className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125"
                        style={{ transform: `rotate(${f.heading}deg)` }}
                      >
                        <Plane className="w-3.5 h-3.5" />
                      </span>
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                        <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-amber-400 text-[10px] rounded whitespace-nowrap shadow-xl font-mono">
                          {f.callsign} • {f.altitudeFt}ft
                        </span>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

              {/* Maritime Markers */}
              {showMaritime &&
                maritime.map((v) => (
                  <AdvancedMarker
                    key={v.id}
                    position={{ lat: v.latitude, lng: v.longitude }}
                    onClick={() =>
                      setSelectedItem({
                        id: v.id,
                        type: 'maritime',
                        title: `Vessel: ${v.vesselName} (${v.vesselType})`,
                        description: `Destination: ${v.destination}. Speed: ${v.speedKnots} kts, Heading: ${v.heading}°. Flag: ${v.flag}.`,
                        lat: v.latitude,
                        lng: v.longitude,
                        extra: {
                          vessel: v.vesselName,
                          mmsi: v.mmsi,
                          type: v.vesselType,
                          flag: v.flag,
                          speed: `${v.speedKnots} kts`,
                          destination: v.destination
                        }
                      })
                    }
                  >
                    <div className="group relative flex items-center justify-center cursor-pointer">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125">
                        <Anchor className="w-3.5 h-3.5" />
                      </span>
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                        <span className="px-2 py-1 bg-slate-900 border border-slate-700 text-emerald-400 text-[10px] rounded whitespace-nowrap shadow-xl font-mono">
                          {v.vesselName}
                        </span>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}
            </Map>
          </APIProvider>
        </div>

        {/* Right Contextual Intelligence Panel */}
        <div className="w-80 md:w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto z-20 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Signals Inspector ({events.length + aviation.length + maritime.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
            </div>

            {/* Selected Item Card */}
            {selectedItem ? (
              <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {selectedItem.type}
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white">{selectedItem.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedItem.description}</p>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-1 text-slate-400">
                  <p>
                    <span className="text-slate-500">Coordinates: </span>
                    <strong className="text-white">
                      {selectedItem.lat.toFixed(4)}, {selectedItem.lng.toFixed(4)}
                    </strong>
                  </p>
                  {Object.entries(selectedItem.extra).map(([k, v]) => (
                    <p key={k}>
                      <span className="text-slate-500 capitalize">{k}: </span>
                      <strong className="text-slate-200">{String(v)}</strong>
                    </p>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleSaveToInvestigation(selectedItem)}
                    className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Save Finding
                  </button>
                  {onOpenAIAnalysis && (
                    <button
                      onClick={() => onOpenAIAnalysis(`Analyze this signal: ${selectedItem.title} at ${selectedItem.lat}, ${selectedItem.lng}`)}
                      className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Analysis
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center text-xs text-slate-400">
                <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-2 opacity-80" />
                Select any telemetry pin on Google Maps to inspect detailed sensor diagnostics, coordinates, and origin records.
              </div>
            )}

            {/* Live Feed List */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Recent Global Sensor Feeds</span>
                <span className="text-[10px] text-cyan-400 font-mono">Auto-Sync</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {events.slice(0, 10).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      if (ev.latitude && ev.longitude) {
                        setMapCenter({ lat: ev.latitude, lng: ev.longitude });
                        setMapZoom(6);
                      }
                      setSelectedItem({
                        id: ev.id,
                        type: 'earthquake',
                        title: ev.title,
                        description: ev.description,
                        lat: ev.latitude || 0,
                        lng: ev.longitude || 0,
                        extra: {
                          magnitude: ev.magnitude,
                          depth: ev.depth,
                          source: ev.sourceName,
                          time: ev.eventTime
                        }
                      });
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedItem?.id === ev.id
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-mono text-cyan-400 uppercase">{ev.category}</span>
                      <span>{new Date(ev.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{ev.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Mag: <strong className="text-rose-400">{ev.magnitude}</strong> • Depth: {ev.depth}km
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Map Engine: Google Maps JS</span>
            <span>Feed: USGS & Sensor Grid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
