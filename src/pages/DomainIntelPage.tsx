import React, { useState } from 'react';
import { Globe2, Search } from 'lucide-react';

export const DomainIntelPage: React.FC = () => {
  const [domain, setDomain] = useState('worldveil.intelligence');
  const [result, setResult] = useState<any>({
    domain: 'worldveil.intelligence',
    registrar: 'Worldveil Secure Registry Authority',
    creationDate: '2026-01-01',
    expirationDate: '2036-01-01',
    nameServers: ['ns1.worldveil.intelligence', 'ns2.worldveil.intelligence'],
    dnssec: true,
    status: ['clientTransferProhibited', 'serverUpdateProhibited'],
    ipResolution: '192.0.2.42'
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({
      domain,
      registrar: 'Authorized Public Registrar Inc.',
      creationDate: '2022-05-14',
      expirationDate: '2030-05-14',
      nameServers: ['ns1.dns-resolver.net', 'ns2.dns-resolver.net'],
      dnssec: true,
      status: ['ok'],
      ipResolution: '198.51.100.15'
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Globe2 className="w-4 h-4" />
          DOMAIN INTELLIGENCE & RDAP
        </div>
        <h1 className="text-2xl font-bold text-white">Domain & DNS Record Investigation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized public RDAP registration lookup and DNS resolution analysis.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <form onSubmit={handleLookup} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. example.com)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs">
            Query RDAP
          </button>
        </form>

        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">DOMAIN</span>
            <span className="text-cyan-400 font-bold">{result.domain}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">REGISTRAR</span>
            <span className="text-white">{result.registrar}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">IP RESOLUTION</span>
            <span className="text-emerald-400">{result.ipResolution}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">DNSSEC</span>
            <span className="text-emerald-400">SECURED</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-1">NAME SERVERS</span>
            <div className="text-slate-300 space-y-1">
              {result.nameServers.map((ns: string, i: number) => (
                <div key={i}>• {ns}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
