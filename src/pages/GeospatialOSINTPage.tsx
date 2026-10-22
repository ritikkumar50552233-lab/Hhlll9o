import React, { useState } from 'react';
import { Compass, Search, MapPin, Bookmark, Download, ExternalLink, Globe } from 'lucide-react';
import { searchLocationGeocode } from '../services/api';

export const GeospatialOSINTPage: React.FC = () => {
  const [query, setQuery] = useState('Tokyo, Japan');
  const [result, setResult] = useState({
    name: 'Tokyo Metropolitan Region, Japan',
    lat: 35.6762,
    lon: 139.6503,
    boundingbox: ['35.5', '35.8', '139.3', '140.0'],
    osmType: 'relation',
    importance: 0.92
  });
  const [bookmarks, setBookmarks] = useState([
    { name: 'Tokyo Station', lat: 35.6812, lng: 139.7671 },
    { name: 'Gibraltar Strait', lat: 35.968, lng: -5.376 },
    { name: 'Suez Canal Terminal', lat: 30.5852, lng: 32.2654 }
  ]);

  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchLocationGeocode(query);
      if (results.length > 0) {
        const top = results[0];
        setResult({
          name: top.display_name,
          lat: top.lat,
          lon: top.lon,
          boundingbox: [String(top.lat - 0.1), String(top.lat + 0.1), String(top.lon - 0.1), String(top.lon + 0.1)],
          osmType: 'verified_node',
          importance: 0.95
        });
      } else {
        alert('Location not found. Please try another query.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = () => {
    setBookmarks([...bookmarks, { name: result.name, lat: result.lat, lng: result.lon }]);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4" />
            GEOSPATIAL INVESTIGATION WORKSPACE
          </div>
          <h1 className="text-2xl font-bold text-white">Geospatial OSINT & Coordinate Lookup</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized OpenStreetMap geocoding, metadata inspection, and geographic bookmarking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter location name or coordinates..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Geocode
              </button>
            </form>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {result.name}
                </h3>
                <button
                  onClick={addBookmark}
                  className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Save Bookmark
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">LATITUDE</span>
                  <span className="text-white font-bold">{result.lat}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">LONGITUDE</span>
                  <span className="text-white font-bold">{result.lon}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">IMPORTANCE</span>
                  <span className="text-emerald-400 font-bold">{result.importance}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OSM TYPE</span>
                  <span className="text-cyan-400 font-bold uppercase">{result.osmType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            Geographic Bookmarks ({bookmarks.length})
          </h2>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {bookmarks.map((bm, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <h4 className="text-xs font-bold text-white mb-1">{bm.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {bm.lat}, {bm.lng}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
