import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Send, HelpCircle, Activity, Globe, ShieldCheck } from 'lucide-react';
import { requestAIAnalysis, fetchUSGSEarthquakes } from '../services/api';
import { GlobalEvent } from '../types';

export const AIAnalysisPage: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const [prompt, setPrompt] = useState(initialQuery || 'What is an earthquake and how does Worldveil Intelligence detect seismic events?');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [events, setEvents] = useState<GlobalEvent[]>([]);

  useEffect(() => {
    fetchUSGSEarthquakes().then(setEvents).catch(console.error);
    if (initialQuery) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  const handleAsk = async (queryText: string) => {
    setLoading(true);
    setPrompt(queryText);
    try {
      const activeEvents = events.length > 0 ? events : await fetchUSGSEarthquakes();
      const result = await requestAIAnalysis(queryText, {
        events: activeEvents.slice(0, 15),
        totalSignals: activeEvents.length,
        timestamp: new Date().toISOString()
      });
      setAnalysis(result);
    } catch (err: any) {
      setAnalysis(`Error analyzing query: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is an earthquake and how is magnitude measured?',
    'What are the strongest seismic events detected today?',
    'How does Google Maps integration display live OSINT signals?',
    'What is OSINT and how does Worldveil Intelligence analyze data?',
    'Explain how aviation flight tracking and maritime AIS tracking work',
    'Who is Ayush Yadav and what is the mission of Worldveil Intelligence?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            WORLDVEIL INTELLIGENCE AI CORE
          </div>
          <h1 className="text-2xl font-bold text-white">AI Analyst & Question Answering System</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ask any question—from basic definitions to complex multi-signal correlations. Powered by Gemini & real-time telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <Activity className="w-3.5 h-3.5" />
          {events.length} Live Signals Connected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input & Question Prompts */}
        <div className="space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Ask Any Question
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(prompt);
              }}
              className="space-y-3"
            >
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Type your question here (Hindi, Hinglish, or English)..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Synthesizing Answer...' : 'Analyze & Answer'}
              </button>
            </form>
          </div>

          {/* Quick Questions */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Frequently Asked Questions (Click to run):
            </h3>
            <div className="space-y-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs transition-colors line-clamp-2"
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Output */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Intelligence Briefing & Analysis Result
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">Grounded Telemetry</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-200 leading-relaxed font-sans overflow-y-auto max-h-[520px]">
              {loading ? (
                <div className="py-24 text-center text-cyan-400 space-y-3">
                  <RefreshCw className="w-7 h-7 animate-spin mx-auto text-cyan-400" />
                  <p className="font-mono text-xs">Processing real-time sensor streams and synthesizing response...</p>
                </div>
              ) : analysis ? (
                <div className="whitespace-pre-line space-y-3">
                  {analysis}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs">
                  Select a question on the left or type your query to receive an instant real-time intelligence report.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Model: Gemini OSINT Core</span>
            <span>Founder: Ayush Yadav</span>
          </div>
        </div>
      </div>
    </div>
  );
};
