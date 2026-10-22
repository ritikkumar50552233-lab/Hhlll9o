export interface GlobalEvent {
  id: string;
  title: string;
  description: string;
  category: 'earthquake' | 'wildfire' | 'weather' | 'geopolitical' | 'infrastructure' | 'maritime' | 'aviation';
  latitude?: number;
  longitude?: number;
  magnitude?: number;
  depth?: number;
  locationName: string;
  eventTime: string;
  publishedAt: string;
  updatedAt: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: 'verified' | 'reported' | 'pending' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface NewsReport {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  region: string;
  sentiment?: 'neutral' | 'elevated' | 'critical';
}

export interface AviationRecord {
  id: string;
  callsign: string;
  aircraftType: string;
  origin: string;
  destination: string;
  latitude: number;
  longitude: number;
  altitudeFt: number;
  groundSpeedKnots: number;
  heading: number;
  lastUpdated: string;
  status: 'enroute' | 'airborne' | 'landed';
}

export interface MaritimeRecord {
  id: string;
  vesselName: string;
  mmsi: string;
  vesselType: string;
  flag: string;
  latitude: number;
  longitude: number;
  speedKnots: number;
  heading: number;
  destination: string;
  lastReported: string;
}

export interface IPIntelligenceData {
  ip: string;
  city: string;
  region: string;
  country: string;
  org: string;
  asn: string;
  lat: number;
  lon: number;
  timezone: string;
  threatScore?: number;
}

export interface DomainIntelligenceData {
  domain: string;
  registrar: string;
  creationDate: string;
  expirationDate: string;
  nameServers: string[];
  dnssec: boolean;
  status: string[];
  ipResolution: string;
}

export interface Investigation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sourceReferences: string[];
  selectedEvents: string[];
  geoBookmarks: { name: string; lat: number; lng: number }[];
  notes: { id: string; text: string; timestamp: string; author: string }[];
  timeline: { id: string; time: string; title: string; description: string }[];
  status: 'active' | 'archived' | 'review';
}

export interface DataSourceStatus {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Not Configured' | 'Updating' | 'Delayed' | 'Temporarily Unavailable' | 'Rate Limited' | 'Error';
  lastSuccess: string;
  lastAttempt: string;
  updateFrequency: string;
  description: string;
  attribution: string;
}
