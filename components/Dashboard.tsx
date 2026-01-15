
import React, { useState, useEffect } from 'react';
import { AuditProject, AuditReport } from '../types';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Network, Cpu, Zap, Radio, Terminal, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  project: AuditProject;
  reports: AuditReport[];
  onUpdateProject: (p: AuditProject) => void;
}

const MOCK_CONSENSUS_LOGS = [
  { agent: 'Gemini-Pro-3', action: 'Analyzing Control Flow Graph (CFG)...', status: 'working' },
  { agent: 'Claude-3.5', action: 'Verifying CPI constraints on instruction 0x4A...', status: 'working' },
  { agent: 'GPT-4o', action: 'Cross-referencing similar exploits (DB: Sol-2024)...', status: 'idle' },
  { agent: 'Talos-SBF', action: 'Decompiling bytecode segment .text...', status: 'success' },
];

export const Dashboard: React.FC<DashboardProps> = ({ project, reports, onUpdateProject }) => {
  const [logs, setLogs] = useState<any[]>([]);

  // Simulation of live agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = MOCK_CONSENSUS_LOGS[Math.floor(Math.random() * MOCK_CONSENSUS_LOGS.length)];
      const newLog = {
        ...randomLog,
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        latency: Math.floor(Math.random() * 150) + 20
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* HUD Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex justify-between items-center backdrop-blur-sm relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
           <div>
             <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
               <Shield className="w-6 h-6 text-indigo-500" />
               Command Center
             </h2>
             <p className="text-slate-400 text-sm mt-1 font-mono">
               Project: <span className="text-white font-bold">{project.name}</span> <span className="text-slate-600">|</span> ID: {project.name.toUpperCase().slice(0,3)}-{Math.floor(Math.random()*9000)+1000}
             </p>
           </div>
           <div className="text-right z-10">
             <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Overall Risk Score</div>
             <div className={`text-4xl font-black ${getRiskColor(project.riskScore)} tracking-tighter`}>
               {project.riskScore}
             </div>
           </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-slow"></div>
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            SYSTEM ONLINE
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Uptime: 99.99%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Consensus (The "Magic") */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Agents Visualization */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[320px]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Live Consensus Engine
              </h3>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/20">3 NODES ACTIVE</span>
            </div>
            
            <div className="flex-grow p-4 relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
              
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* Agent 1 */}
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <Server className="w-5 h-5 text-indigo-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono mb-1">NODE_01</div>
                    <div className="font-bold text-white text-sm">Gemini 3.0</div>
                    <div className="text-[10px] text-indigo-300 mt-2">Task: Semantic Analysis</div>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-indigo-500 w-[75%] animate-pulse"></div>
                  </div>
                </div>

                {/* Agent 2 */}
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col justify-between group hover:border-orange-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <Cpu className="w-5 h-5 text-orange-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-100"></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono mb-1">NODE_02</div>
                    <div className="font-bold text-white text-sm">Talos SBF</div>
                    <div className="text-[10px] text-orange-300 mt-2">Task: Bytecode Decomp</div>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-orange-500 w-[45%] animate-pulse"></div>
                  </div>
                </div>

                {/* Agent 3 */}
                <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <Network className="w-5 h-5 text-emerald-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-200"></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono mb-1">NODE_03</div>
                    <div className="font-bold text-white text-sm">Heuristics</div>
                    <div className="text-[10px] text-emerald-300 mt-2">Task: Pattern Match</div>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-emerald-500 w-[90%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Live Terminal Stream */}
            <div className="h-24 bg-black border-t border-slate-800 p-3 font-mono text-[10px] overflow-hidden flex flex-col justify-end">
               {logs.map((log) => (
                 <div key={log.id} className="flex gap-2 animate-in slide-in-from-left duration-300">
                   <span className="text-slate-600">[{log.timestamp}]</span>
                   <span className="text-indigo-400 font-bold">{log.agent}:</span>
                   <span className="text-slate-300 truncate">{log.action}</span>
                   <span className="text-slate-600 ml-auto">{log.latency}ms</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Recent Audits List (Functional) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-white text-sm flex items-center gap-2">
                 <Activity className="w-4 h-4 text-slate-400" />
                 Recent Scan Activity
               </h3>
               <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase">View Full Logs</button>
             </div>
             <div className="divide-y divide-slate-800">
                {reports.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm italic">
                    No active threats detected in current session.
                  </div>
                ) : (
                  reports.map(report => (
                    <div key={report.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${report.issuesFound > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                         <div className="text-sm font-medium text-slate-200">{report.fileName}</div>
                       </div>
                       <div className="flex items-center gap-4 text-xs">
                          <span className="text-slate-500 font-mono">{report.timestamp.split(',')[1]}</span>
                          <span className={`px-2 py-0.5 rounded ${report.issuesFound > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {report.issuesFound} Issues
                          </span>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Infrastructure Status */}
        <div className="space-y-6">
          
          {/* Asset Monitor (Restored) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
             <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
               <Network className="w-4 h-4 text-blue-400" />
               Network Telemetry
             </h3>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-400">Solana Mainnet RPC</span>
                   <span className="text-emerald-400">24ms</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[95%]"></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-400">Talos Inference API</span>
                   <span className="text-emerald-400">110ms</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[80%]"></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-400">Gemini 3.0 Pro Gateway</span>
                   <span className="text-indigo-400">Operational</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-[100%] animate-pulse"></div>
                 </div>
               </div>
             </div>
          </div>

          {/* Security Alert Level */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
             <div className="mb-2 p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
               <Zap className="w-6 h-6 text-indigo-400" />
             </div>
             <div className="text-2xl font-black text-white">DEFCON 4</div>
             <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Threat Level: Low</div>
             <div className="mt-4 text-[10px] text-slate-600 border-t border-slate-800 pt-2 w-full">
               Monitoring 1 active contract
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
