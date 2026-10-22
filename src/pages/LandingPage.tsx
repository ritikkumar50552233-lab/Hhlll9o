import React from 'react';
import { Globe, Shield, Satellite, Activity, Plane, Anchor, Newspaper, Search, ArrowRight, CheckCircle2, Lock, Cpu, Database } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            GLOBAL OSINT & GEOSPATIAL INTELLIGENCE PLATFORM
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto mb-6 text-balance">
            Understand a Changing World Through Open Data.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-normal">
            See the World. Connect the Signals. Understand the Bigger Picture. Explore global events, geographic information, public intelligence sources, and connected signals through one unified workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 group"
            >
              Explore Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-800 flex items-center justify-center gap-2"
            >
              Create Free Account
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto border-t border-slate-900 pt-10">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-1">Open Public Sources</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono">Real-Time</p>
              <p className="text-xs text-slate-400 mt-1">USGS, FIRMS & RSS Feeds</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white font-mono">Secure</p>
              <p className="text-xs text-slate-400 mt-1">Encrypted Investigations</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">Gemini AI</p>
              <p className="text-xs text-slate-400 mt-1">Grounded Intelligence Synthesis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Intelligence Modules</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Engineered for precision monitoring, cross-signal correlation, and rigorous open-source analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Global Monitoring',
              desc: 'Live tracking of earthquakes, wildfire thermal anomalies, and meteorological warnings worldwide.',
              icon: Activity
            },
            {
              title: 'Geospatial OSINT',
              desc: 'Interactive coordinate geocoding, bounding box analysis, and geographic feature exploration.',
              icon: Globe
            },
            {
              title: 'Earth Observation',
              desc: 'Satellite imagery metadata, environmental monitoring indices, and thermal anomaly layers.',
              icon: Satellite
            },
            {
              title: 'Aviation Intelligence',
              desc: 'Live aircraft positions, flight identifiers, altitudes, and heading telemetry.',
              icon: Plane
            },
            {
              title: 'Maritime Intelligence',
              desc: 'Vessel tracking, AIS position reports, speed, course, and destination monitoring.',
              icon: Anchor
            },
            {
              title: 'News Intelligence',
              desc: 'Aggregated global news feeds, sentiment analysis, and cross-source reporting comparisons.',
              icon: Newspaper
            },
            {
              title: 'Domain & IP Intel',
              desc: 'Public RDAP, DNS record lookup, and IP geolocation ASN intelligence.',
              icon: Search
            },
            {
              title: 'Investigation Workspace',
              desc: 'Encrypted research spaces with notes, chronological timelines, and report exports.',
              icon: Shield
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-cyan-400 font-medium">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How Worldveil Intelligence Works</h2>
            <p className="text-slate-400 text-sm">A systematic workflow designed for rigorous analysis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Select Source', desc: 'Choose from verified public feeds like USGS, NASA, and RSS.' },
              { step: '02', title: 'Explore Map', desc: 'Inspect geographic anomalies on high-fidelity MapLibre/Leaflet layers.' },
              { step: '03', title: 'Compare Reports', desc: 'Cross-reference timestamps, source reliability, and metadata.' },
              { step: '04', title: 'Synthesize AI', desc: 'Generate secure Gemini briefings grounded in retrieved evidence.' },
              { step: '05', title: 'Save & Export', desc: 'Organize findings in secure workspaces and export records.' }
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs font-mono text-cyan-400 font-bold">{item.step}</span>
                <h3 className="text-sm font-bold text-white mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Transparency & About */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Data Transparency & Provenance</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Worldveil Intelligence is committed to rigorous data integrity. Coverage, accuracy, update frequency, and historical availability depend entirely on authorized public sources (USGS, NASA, RSS aggregators). We never fabricate live incidents or simulate unverified feeds.
          </p>
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <div>
              <p className="text-white font-semibold">Product Founder & Architect</p>
              <p className="text-cyan-400 font-mono mt-0.5">Ayush Yadav</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 font-mono">
                Category: Global OSINT & Geospatial Intelligence
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-200">WORLDVEIL INTELLIGENCE</span>
          </div>
          <div className="flex flex-wrap gap-6 text-slate-400">
            <button onClick={onExplore} className="hover:text-white">Dashboard</button>
            <button onClick={() => onOpenAuth('signin')} className="hover:text-white">Sign In</button>
            <span>Data Sources</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <div>
            <p>© 2026 Worldveil Intelligence. Founder: Ayush Yadav. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
