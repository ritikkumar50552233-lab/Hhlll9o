import React, { useState } from 'react';
import { Sparkles, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { requestAIAnalysis, fetchUSGSEarthquakes } from '../services/api';

export const AIAnalysisPage: React.FC = () => {
  const [prompt, setPrompt] = useState('Analyze recent seismic anomalies and summarize potential infrastructure risks.');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const events = await fetchUSGSEarthquakes();
    const result = await requestAIAnalysis(prompt, { events: events.slice(0, 10) });
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            GEMINI AI INTELLIGENCE BRIEFING
          </div>
          <h1 className="text-2xl font-bold text-white">Secure AI-Assisted OSINT Synthesis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure server-side Gemini API integration grounded in retrieved telemetry records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-4">Prompt Intelligence Query</h2>
          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Analysis Focus</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate AI Briefing
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
          <h2 className="text-sm font-bold text-white mb-4 pb-2 border-b border-slate-800">
            Synthesized Intelligence Output
          </h2>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-y-auto max-h-[500px]">
            {loading ? (
              <div className="py-20 text-center text-cyan-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Querying Gemini server-side model and grounding analysis in telemetry...
              </div>
            ) : analysis ? (
              analysis
            ) : (
              <span className="text-slate-500">Click 'Generate AI Briefing' to analyze current intelligence signals.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
