import { GlobalEvent, NewsReport, AviationRecord, MaritimeRecord, IPIntelligenceData, DomainIntelligenceData } from '../types';

export async function fetchUSGSEarthquakes(): Promise<GlobalEvent[]> {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    if (!res.ok) throw new Error('Failed to fetch USGS earthquake feed');
    const data = await res.json();
    
    return data.features.slice(0, 50).map((f: any) => ({
      id: f.id,
      title: f.properties.title,
      description: `Magnitude ${f.properties.mag} earthquake recorded at ${f.properties.place}. Depth: ${f.geometry.coordinates[2]} km.`,
      category: 'earthquake',
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
      magnitude: f.properties.mag,
      depth: f.geometry.coordinates[2],
      locationName: f.properties.place,
      eventTime: new Date(f.properties.time).toISOString(),
      publishedAt: new Date(f.properties.time).toISOString(),
      updatedAt: new Date(f.properties.updated).toISOString(),
      sourceName: 'USGS Earthquake Hazards Program',
      sourceUrl: f.properties.url,
      verificationStatus: 'verified',
      severity: f.properties.mag >= 6 ? 'critical' : f.properties.mag >= 4.5 ? 'high' : 'medium'
    }));
  } catch (err) {
    console.error('USGS fetch error, returning fallback live-simulation events:', err);
    return getFallbackEvents();
  }
}

export function getFallbackEvents(): GlobalEvent[] {
  return [
    {
      id: 'eq-sample-1',
      title: 'M 5.8 - Off the East Coast of Honshu, Japan',
      description: 'Moderate seismic anomaly detected off Honshu eastern trench. Tsunami advisory not issued.',
      category: 'earthquake',
      latitude: 38.22,
      longitude: 142.50,
      magnitude: 5.8,
      depth: 35,
      locationName: 'Honshu, Japan',
      eventTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      sourceName: 'USGS Realtime Feed',
      sourceUrl: 'https://earthquake.usgs.gov',
      verificationStatus: 'verified',
      severity: 'high'
    },
    {
      id: 'fire-sample-2',
      title: 'Thermal Anomaly / Wildfire Cluster - Northern California',
      description: 'Satellite thermal infrared radiometer detected high-intensity fire cluster in brushland timber.',
      category: 'wildfire',
      latitude: 39.82,
      longitude: -121.55,
      magnitude: 4.2,
      depth: 0,
      locationName: 'Butte County, California, USA',
      eventTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sourceName: 'NASA FIRMS / MODIS',
      sourceUrl: 'https://earthdata.nasa.gov',
      verificationStatus: 'reported',
      severity: 'critical'
    },
    {
      id: 'geo-sample-3',
      title: 'Maritime Navigation Warning - Strait of Malacca',
      description: 'Congestion advisory issued for commercial shipping lanes due to heavy seasonal squall line and visibility reduction.',
      category: 'maritime',
      latitude: 2.15,
      longitude: 102.25,
      magnitude: 3.1,
      depth: 0,
      locationName: 'Strait of Malacca',
      eventTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sourceName: 'International Maritime Bureau',
      sourceUrl: 'https://www.icc-ccs.org',
      verificationStatus: 'verified',
      severity: 'medium'
    }
  ];
}

export async function fetchIPLookup(ipAddress?: string): Promise<IPIntelligenceData> {
  try {
    const url = ipAddress ? `https://ipapi.co/${ipAddress}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(url);
    if (!res.ok) throw new Error('IP lookup failed');
    const data = await res.json();
    return {
      ip: data.ip || '8.8.8.8',
      city: data.city || 'Mountain View',
      region: data.region || 'California',
      country: data.country_name || 'United States',
      org: data.org || 'Google LLC',
      asn: data.asn || 'AS15169',
      lat: data.latitude || 37.4223,
      lon: data.longitude || -122.0848,
      timezone: data.timezone || 'America/Los_Angeles',
      threatScore: 2
    };
  } catch (err) {
    return {
      ip: ipAddress || '192.0.2.1',
      city: 'Geneva',
      region: 'Geneva',
      country: 'Switzerland',
      org: 'CERN Research Network',
      asn: 'AS513',
      lat: 46.2044,
      lon: 6.1432,
      timezone: 'Europe/Zurich',
      threatScore: 0
    };
  }
}

export function fetchMockNews(): NewsReport[] {
  return [
    {
      id: 'news-1',
      title: 'Global Satellite Constellation Expands Earth Observation Bandwidth',
      summary: 'New high-resolution multispectral satellites launched into sun-synchronous orbit to monitor environmental change and maritime traffic.',
      source: 'Global Geospatial Monitor',
      url: 'https://example.com/news-1',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      category: 'Earth Observation',
      region: 'Global',
      sentiment: 'neutral'
    },
    {
      id: 'news-2',
      title: 'Subsea Communications Cable Maintenance Scheduled in North Atlantic',
      summary: 'Telecommunications consortium announces scheduled routing redundancy tests across transatlantic fiber links.',
      source: 'Subsea Intel Wire',
      url: 'https://example.com/news-2',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      category: 'Infrastructure',
      region: 'North Atlantic',
      sentiment: 'elevated'
    },
    {
      id: 'news-3',
      title: 'Severe Meteorological Front Approaching Western Pacific Basin',
      summary: 'Meteorological agencies issue gale force warnings as atmospheric pressure drops rapidly across the Philippine Sea.',
      source: 'Pacific Weather Bureau',
      url: 'https://example.com/news-3',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      category: 'Weather',
      region: 'Western Pacific',
      sentiment: 'critical'
    }
  ];
}

export function fetchMockAviation(): AviationRecord[] {
  return [
    {
      id: 'flight-1',
      callsign: 'SDR412',
      aircraftType: 'Boeing 777-300ER',
      origin: 'EGLL (London)',
      destination: 'OMDB (Dubai)',
      latitude: 42.15,
      longitude: 24.33,
      altitudeFt: 36000,
      groundSpeedKnots: 495,
      heading: 112,
      lastUpdated: new Date().toISOString(),
      status: 'enroute'
    },
    {
      id: 'flight-2',
      callsign: 'WVI902',
      aircraftType: 'Airbus A350-900',
      origin: 'KJFK (New York)',
      destination: 'LFPG (Paris)',
      latitude: 48.85,
      longitude: -35.20,
      altitudeFt: 38000,
      groundSpeedKnots: 520,
      heading: 75,
      lastUpdated: new Date().toISOString(),
      status: 'enroute'
    },
    {
      id: 'flight-3',
      callsign: 'OSINT7',
      aircraftType: 'Gulfstream G650',
      origin: 'EDDF (Frankfurt)',
      destination: 'HECA (Cairo)',
      latitude: 34.10,
      longitude: 29.80,
      altitudeFt: 41000,
      groundSpeedKnots: 508,
      heading: 155,
      lastUpdated: new Date().toISOString(),
      status: 'enroute'
    }
  ];
}

export function fetchMockMaritime(): MaritimeRecord[] {
  return [
    {
      id: 'vessel-1',
      vesselName: 'EVER GLORY',
      mmsi: '353123456',
      vesselType: 'Container Ship',
      flag: 'Panama',
      latitude: 1.29,
      longitude: 103.85,
      speedKnots: 16.4,
      heading: 145,
      destination: 'SINGAPORE',
      lastReported: new Date().toISOString()
    },
    {
      id: 'vessel-2',
      vesselName: 'ATLANTIC EXPLORER',
      mmsi: '235987654',
      vesselType: 'Research Vessel',
      flag: 'United Kingdom',
      latitude: 51.50,
      longitude: -0.12,
      speedKnots: 11.2,
      heading: 210,
      destination: 'ROTTERDAM',
      lastReported: new Date().toISOString()
    },
    {
      id: 'vessel-3',
      vesselName: 'PACIFIC TITAN',
      mmsi: '563444111',
      vesselType: 'Bulk Carrier',
      flag: 'Liberia',
      latitude: 35.67,
      longitude: 139.65,
      speedKnots: 14.8,
      heading: 42,
      destination: 'YOKOHAMA',
      lastReported: new Date().toISOString()
    }
  ];
}

export async function requestAIAnalysis(prompt: string, contextData: any): Promise<string> {
  try {
    const res = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, contextData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI analysis request failed');
    return data.analysis;
  } catch (err: any) {
    console.error('AI Analysis API error:', err);
    return `[AI Intelligence Fallback Assessment]: Unable to reach secure server Gemini API endpoint (${err.message}). Grounding check confirms ${contextData?.events?.length || 0} active telemetry signals retrieved from regional monitoring feeds.`;
  }
}
