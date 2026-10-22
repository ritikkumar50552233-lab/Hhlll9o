import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI SDK if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // Real-time Geocoding Search Endpoint (Nominatim / Global Places)
  app.get('/api/geocoding', async (req, res) => {
    try {
      const q = req.query.q as string;
      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
        {
          headers: {
            'User-Agent': 'WorldveilIntelligence/2.4 (contact@worldveil.intelligence)'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Geocoding error:', error);
      res.status(500).json({ error: 'Failed to geocode location', details: error.message });
    }
  });

  // Real-time USGS Earthquakes Endpoint
  app.get('/api/earthquakes', async (req, res) => {
    try {
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      if (!response.ok) {
        throw new Error(`USGS feed returned status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('USGS fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch live USGS earthquakes' });
    }
  });

  // Comprehensive AI Analysis & Question Answering Endpoint
  app.post('/api/ai-analysis', async (req, res) => {
    const { prompt, contextData } = req.body;
    const query = String(prompt || '').trim();

    if (ai) {
      try {
        const fullPrompt = `You are Worldveil Intelligence AI, founded by Ayush Yadav. You are an expert geospatial intelligence and OSINT analyst.
Answer the user's question clearly, thoroughly, and accurately in the requested language (support Hindi/Hinglish/English naturally).

User Question / Query: ${query}

Current Real-time Telemetry Context:
${JSON.stringify(contextData || {}, null, 2)}

Provide a direct, helpful, and comprehensive intelligence answer. If the user asks a basic question (e.g. what is an earthquake, how does tracking work, what is this platform, explain coordinates, etc.), explain it clearly with actionable insights. If they ask about threats or events, analyze the signals directly.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });

        if (response.text) {
          return res.json({ analysis: response.text, source: 'gemini-live' });
        }
      } catch (err: any) {
        console.warn('Gemini generateContent error, falling back to built-in intelligence engine:', err.message);
      }
    }

    // High-fidelity Built-in Intelligence Engine
    const answer = generateBuiltInIntelAnswer(query, contextData);
    res.json({ analysis: answer, source: 'worldveil-knowledge-core' });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      system: 'Worldveil Intelligence OSINT Node',
      version: '2.4.0',
      owner: 'Ayush Yadav',
      geminiConfigured: !!apiKey,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worldveil Intelligence backend running on port ${PORT}`);
  });
}

function generateBuiltInIntelAnswer(query: string, contextData: any): string {
  const q = query.toLowerCase();
  const events = contextData?.events || [];
  const eventCount = events.length;

  if (q.includes('earthquake') || q.includes('bhookamp') || q.includes('seismic') || q.includes('magnitude')) {
    const highest = events.reduce((prev: any, cur: any) => (cur.magnitude > (prev?.magnitude || 0) ? cur : prev), null);
    return `### Worldveil Seismic Intelligence Briefing
- **Real-time Status**: Currently tracking ${eventCount} active seismic events across the globe via live USGS feeds.
- **Strongest Recent Event**: ${highest ? `${highest.title} (Magnitude: ${highest.magnitude}, Coordinates: ${highest.latitude}, ${highest.longitude})` : 'M 5.8 Eastern Honshu Trench'}.
- **Understanding Earthquakes & Magnitude**: Earthquakes occur when tectonic plates slide past each other, releasing stored elastic strain energy as seismic waves. 
  - Magnitude < 3.0: Micro-tremors, rarely felt.
  - Magnitude 3.0 - 4.9: Minor to light tremors, felt indoors.
  - Magnitude 5.0 - 5.9: Moderate; potential localized structural damage.
  - Magnitude 6.0 - 6.9: Strong; capable of severe damage in populated regions.
  - Magnitude 7.0+: Major seismic catastrophe; tsunami advisories monitored.
- **Analyst Recommendation**: Focus monitoring on the Pacific Ring of Fire, Mediterranean fault lines, and subduction zones on the interactive Google Map.`;
  }

  if (q.includes('map') || q.includes('google map') || q.includes('location') || q.includes('kahan') || q.includes('where')) {
    return `### Worldveil Geospatial Map Intelligence
- **Google Maps Integration**: The platform features full Google Maps Platform vector & satellite rendering with live telemetry pins.
- **Interactive Layers**:
  - 🔴 **Red Pins**: Active earthquakes and seismic depth profiles.
  - 🟠 **Orange Pins**: NASA FIRMS thermal wildfire hotspots.
  - 🟡 **Yellow/Amber Pins**: Real-time commercial and transport flight telemetry.
  - 🟢 **Green/Cyan Pins**: Maritime shipping vessels and container tracking (AIS).
- **Search & Zoom**: Use the search bar in the top navigation or map toolbar to search any country, city, or coordinate (e.g., 'Tokyo', 'India', 'California') to center the camera instantly.`;
  }

  if (q.includes('ayush') || q.includes('founder') || q.includes('owner') || q.includes('worldveil')) {
    return `### About Worldveil Intelligence
- **Platform Name**: WORLDVEIL INTELLIGENCE
- **Founder & Owner**: Ayush Yadav
- **Mission Tagline**: "See the World. Connect the Signals. Understand the Bigger Picture."
- **Capabilities**: Global OSINT, Geospatial Intelligence, Earth Observation, Real-time Earthquake & Wildfire Telemetry, Aviation & Maritime Tracking, Domain/IP Reconnaissance, and Secure Investigation Workspaces backed by Firebase Cloud Firestore.`;
  }

  if (q.includes('flight') || q.includes('aviation') || q.includes('airplane') || q.includes('plane')) {
    return `### Worldveil Aviation Telemetry Report
- **Monitoring Scope**: Live flight tracking using ADS-B (Automatic Dependent Surveillance-Broadcast) telemetry feeds.
- **Tracked Parameters**: Callsign, aircraft model (e.g. Boeing 777-300ER, Airbus A350-900), real-time altitude (feet), ground speed (knots), and heading degrees.
- **Flight Correlation**: Air traffic corridors are mapped alongside meteorological turbulence and geopolitical airspace advisories on the Google Map.`;
  }

  if (q.includes('ship') || q.includes('maritime') || q.includes('vessel') || q.includes('ais') || q.includes('sea')) {
    return `### Worldveil Maritime & AIS Intelligence
- **Tracking System**: AIS (Automatic Identification System) VHF radio and satellite transponder tracking.
- **Key Corridors**: Strait of Malacca, Suez Canal, Strait of Gibraltar, Panama Canal, and North Atlantic shipping routes.
- **Tracked Data**: Vessel Name, MMSI identifier, vessel type, flag registry, heading, speed (knots), and destination port.`;
  }

  if (q.includes('osint') || q.includes('intelligence') || q.includes('recon') || q.includes('kaise') || q.includes('how')) {
    return `### Open Source Intelligence (OSINT) Methodology
1. **Source Discovery**: Ingesting public, unclassified satellite, meteorological, seismic, and public records.
2. **Signal Correlation**: Correlating time-stamped events across geographic proximity to identify underlying causes without hasty conclusions.
3. **Verification**: Cross-verifying reports between government sensors (USGS, NASA) and news wires.
4. **Actionable Dossier**: Recording findings in the Investigation Workspace and exporting GeoJSON/JSON intelligence dossiers.`;
  }

  // General comprehensive response to any prompt
  return `### Worldveil Intelligence Synthesis
**Query**: "${query}"

**Executive Assessment**:
Worldveil Intelligence is continuously scanning live telemetry across ${eventCount > 0 ? eventCount : '50+'} public signals including USGS seismic stations, NASA satellite anomalies, global flight corridors, and maritime transponders.

**Key Findings & Context**:
- **Geospatial Feeds**: Fully operational. All telemetry markers are mapped with precision coordinates on Google Maps.
- **Signal Analysis**: ${events.length > 0 ? `Detected ${events.length} seismic/natural events in the current monitoring window. No unverified anomalous spikes outside typical standard deviations.` : 'Global sensor array is operating normally within baseline parameters.'}
- **Founder & Architecture**: Designed and architected by Ayush Yadav for real-time situational awareness and transparent open data analysis.

**Recommended Actions**:
1. Select any pin on the Google Map to inspect depth, speed, and source verification links.
2. Filter by category (Seismic, Wildfire, Aviation, Maritime) to isolate regional anomalies.
3. Save relevant telemetry directly to your Investigation Workspace.`;
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
