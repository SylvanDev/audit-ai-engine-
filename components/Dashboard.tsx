
import React, { useState, useEffect } from 'react';
import { AuditProject, AuditReport } from '../types';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Network, Cpu, Zap, Radio, Terminal, BrainCircuit, Rocket, ShoppingCart, Calendar, Trophy } from 'lucide-react';

interface DashboardProps {
  project: AuditProject;
  reports: AuditReport[];
  onUpdateProject: (p: AuditProject) => void;
}

const MOCK_CONSENSUS_LOGS = [
  { agent: 'Gemini-3-Pro', action: 'Scanning for time-locked drain functions...', status: 'working' },
  { agent: 'DeepSeek-V3', action: 'Verifying proxy implementation integrity...', status: 'working' },
  { agent: 'Talos-Heuristics', action: 'Checking mint authority revocation status...', status: 'success' },
  { agent: 'SBF-Decompiler', action: 'Analyzing hidden jump instructions...', status: 'working' },
];

export const Dashboard: React.FC<DashboardProps> = ({ project, reports, onUpdateProject }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = MOCK_CONSENSUS_LOGS[Math.floor(Math.random() * MOCK_CONSENSUS_LOGS.length)];
      const newLog = {
        ...randomLog,
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        latency: Math.floor(Math.random() * 80) + 15
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 2000);
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
               Mission Control
             </h2>
             <p className="text-slate-400 text-sm mt-1 font-mono">
               Active Audit: <span className="text-white font-bold">{project.name}</span>
             </p>
           </div>
           <div className="text-right z-10">
             <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Safety Index</div>
             <div className={`text-4xl font-black ${getRiskColor(project.riskScore)} tracking-tighter`}>
               {project.riskScore === 0 ? '--' : project.riskScore}%
             </div>
           </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center backdrop-blur-sm">
          <div className="text-indigo-400 font-bold text-sm flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            AI CLUSTER ACTIVE
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Nodes: 12 Online</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[350px]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Multi-Agent Consensus Layer
              </h3>
              <div className="flex gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">GEMINI 3.0 PRO</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">DEEPSEEK V3</span>
              </div>
            </div>
            
            <div className="flex-grow p-6 grid grid-cols-3 gap-4">
                <AgentCard icon={<Server className="text-indigo-400"/>} name="Semantic Auditor" task="Intent Discovery" color="indigo" />
                <AgentCard icon={<Cpu className="text-orange-400"/>} name="SBF Decompiler" task="Bytecode Logic" color="orange" />
                <AgentCard icon={<Network className="text-emerald-400"/>} name="Pattern Matcher" task="Rugcheck Vectors" color="emerald" />
            </div>
            
            <div className="h-28 bg-black border-t border-slate-800 p-3 font-mono text-[10px] overflow-hidden flex flex-col justify-end">
               {logs.map((log) => (
                 <div key={log.id} className="flex gap-2 animate-in slide-in-from-left duration-200">
                   <span className="text-slate-600">[{log.timestamp}]</span>
                   <span className="text-indigo-400 font-bold">{log.agent}:</span>
                   <span className="text-slate-300 truncate">{log.action}</span>
                   <span className="text-slate-500 ml-auto">{log.latency}ms</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
               <Zap className="w-12 h-12 text-white" />
             </div>
             <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
               <Rocket className="w-4 h-4 text-indigo-400" />
               Audit Progress
             </h3>
             <p className="text-xs text-slate-400 mb-4 leading-relaxed">
               Continuous monitoring of program instructions and state transitions.
             </p>
             <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                 <span>Review Status</span>
                 <span className="text-indigo-400">Active</span>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-[65%]"></div>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
             <h4 className="text-white text-xs font-bold mb-3 uppercase tracking-wider text-slate-500">Security Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400">Total Scans</div>
                  <div className="text-xl font-black text-white">1,402</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400">Threats Blocked</div>
                  <div className="text-xl font-black text-emerald-400">84</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentCard = ({ icon, name, task, color }: any) => (
  <div className={`bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 flex flex-col justify-between hover:border-${color}-500/30 transition-all cursor-default group`}>
    <div className="flex justify-between items-start">
      <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
    </div>
    <div className="mt-4">
      <div className="text-[10px] text-slate-500 font-mono mb-1">AGENT_V3</div>
      <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{name}</div>
      <div className={`text-[10px] text-${color}-400/80 mt-1`}>{task}</div>
    </div>
  </div>
);
