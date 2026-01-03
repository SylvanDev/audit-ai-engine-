import React from 'react';
import { ScopeItem, Severity } from '../types';
import { ShieldAlert, Globe, Database, Server, Cpu, Box, FileCode, Folder, Zap, Lock, Star } from 'lucide-react';

const scopeData: ScopeItem[] = [
  { domain: '*.target-program.com', type: 'Wildcard Domain', assetValue: Severity.CRITICAL, description: 'Main production wildcard. Check subdomains.' },
  { domain: 'api.target-program.com', type: 'API', assetValue: Severity.CRITICAL, description: 'REST/GraphQL endpoints. Focus on IDOR & Auth.' },
  { domain: 'vpn.target-program.com', type: 'Infrastructure', assetValue: Severity.HIGH, description: 'VPN Portal. Check for CVEs (Pulse Secure, etc).' },
  { domain: 'jira.target-program.com', type: 'Internal Tool', assetValue: Severity.MEDIUM, description: 'Check for public registration or misconfig.' },
  { domain: 'mobile-app (iOS)', type: 'Mobile', assetValue: Severity.HIGH, description: 'Extract IPA, check Info.plist and hardcoded secrets.' },
  { domain: 'dev-*.target-program.com', type: 'Dev Environment', assetValue: Severity.MEDIUM, description: 'Often has debug mode enabled or weak auth.' },
];

const getIcon = (type: string) => {
  if (type.includes('Domain') || type.includes('Infrastructure')) return <Globe className="w-4 h-4 text-emerald-400" />;
  if (type.includes('API')) return <Server className="w-4 h-4 text-blue-400" />;
  if (type.includes('Mobile')) return <Cpu className="w-4 h-4 text-purple-400" />;
  if (type.includes('Internal')) return <Lock className="w-4 h-4 text-orange-400" />;
  return <Star className="w-4 h-4 text-gray-400" />;
};

const getBadgeColor = (severity: Severity) => {
  switch (severity) {
    case Severity.CRITICAL: return 'bg-red-900/50 text-red-200 border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.3)]';
    case Severity.HIGH: return 'bg-orange-900/50 text-orange-200 border-orange-700';
    case Severity.MEDIUM: return 'bg-yellow-900/50 text-yellow-200 border-yellow-700';
    default: return 'bg-blue-900/50 text-blue-200 border-blue-700';
  }
};

export const ScopeTable: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          Target Scope (Asset Inventory)
        </h3>
        <span className="text-xs text-slate-500 font-mono">Synced with H1 Policy</span>
      </div>
      <div className="overflow-auto custom-scrollbar flex-grow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-400 uppercase bg-slate-950 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border-b border-slate-800">Asset</th>
              <th className="px-4 py-3 border-b border-slate-800">Type</th>
              <th className="px-4 py-3 border-b border-slate-800">Max Bounty</th>
              <th className="px-4 py-3 hidden md:table-cell border-b border-slate-800">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {scopeData.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-4 py-3 font-medium text-emerald-300 mono group-hover:text-emerald-200">
                  {item.domain}
                </td>
                <td className="px-4 py-3 flex items-center gap-2 text-slate-300">
                  {getIcon(item.type)}
                  {item.type}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getBadgeColor(item.assetValue)}`}>
                    {item.assetValue.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 hidden md:table-cell font-mono text-xs">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 text-center">
        Always check the <strong>Policy Page</strong> on HackerOne before attacking out-of-scope assets.
      </div>
    </div>
  );
};