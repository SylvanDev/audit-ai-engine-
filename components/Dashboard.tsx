import React from 'react';
import { AuditProject, AuditReport } from '../types';
import { Shield, AlertTriangle, CheckCircle, Activity, FileText, Lock, Server, Zap, Clock, DollarSign, BrainCircuit, Network, Database, Cpu, LockKeyhole } from 'lucide-react';

interface DashboardProps {
  project: AuditProject;
  reports: AuditReport[];
  onUpdateProject: (p: AuditProject) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, reports, onUpdateProject }) => {
  
  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 90) return 'SECURE';
    if (score >= 70) return 'WARNING';
    return 'CRITICAL RISK';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Welcome / Status Banner */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 p-8 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded border border-indigo-500/30">Beta 0.9.2</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              System Operational
            </span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Security Overview</h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
             AuditAI uses <span className="text-indigo-400 font-bold">Multi-Agent Consensus</span> to monitor your project's integrity. 
             Unlike standard linters, we analyze logic, not just syntax.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-slate-950/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-md">
           <div className="text-right">
             <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Current Risk Score</div>
             <div className={`text-4xl font-black ${getRiskColor(project.riskScore)} tracking-tighter`}>
               {project.riskScore}/100
             </div>
             <div className={`text-[10px] font-bold ${getRiskColor(project.riskScore)} mt-1`}>{getRiskLabel(project.riskScore)}</div>
           </div>
           <div className="relative">
             <div className={`absolute inset-0 blur-xl opacity-20 ${getRiskColor(project.riskScore).replace('text-', 'bg-')}`}></div>
             <Activity className={`w-14 h-14 ${getRiskColor(project.riskScore)} relative z-10`} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors"><FileText className="w-5 h-5" /></div>
             <h3 className="font-semibold text-slate-200">Audits Performed</h3>
           </div>
           <div className="text-3xl font-bold text-white tracking-tight">{reports.length}</div>
           <div className="text-xs text-slate-500 mt-1">Files analyzed by Unified Engine</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-red-500/30 transition-colors group">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors"><AlertTriangle className="w-5 h-5" /></div>
             <h3 className="font-semibold text-slate-200">Issues Detected</h3>
           </div>
           <div className="text-3xl font-bold text-white tracking-tight">
             {reports.reduce((acc, r) => acc + r.issuesFound, 0)}
           </div>
           <div className="text-xs text-slate-500 mt-1">Potential vulnerabilities identified</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors"><Shield className="w-5 h-5" /></div>
             <h3 className="font-semibold text-slate-200">Ecosystem Impact</h3>
           </div>
           <div className="text-3xl font-bold text-white tracking-tight">$0</div>
           <div className="text-xs text-slate-500 mt-1">Cost vs Traditional Audit ($30k+)</div>
        </div>
      </div>

      {/* GRANT ROADMAP SECTION - VITAL FOR INVESTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              Market Advantage
            </h3>
            <p className="text-sm text-slate-400">Why the Unified Engine outperforms competitors.</p>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4 text-slate-500">Others</th>
                  <th className="px-6 py-4 text-indigo-400 bg-indigo-900/10 border-t-2 border-indigo-500">AuditAI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-slate-200">Logic Analysis</td>
                  <td className="px-6 py-4 text-red-400 font-bold">Poor</td>
                  <td className="px-6 py-4 font-bold text-emerald-400 bg-indigo-900/5">Advanced (AI)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-slate-200">Bytecode Decompile</td>
                  <td className="px-6 py-4 text-red-400 font-bold">No</td>
                  <td className="px-6 py-4 font-bold text-emerald-400 bg-indigo-900/5">Yes (Pipeline)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-slate-200">Cost</td>
                  <td className="px-6 py-4 text-slate-400">$30k+</td>
                  <td className="px-6 py-4 font-bold text-white bg-indigo-900/5">~$50/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Architecture (Roadmap) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 relative">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <Network className="w-32 h-32 text-indigo-500" />
           </div>
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Server className="w-5 h-5 text-indigo-500" />
             Production Roadmap (Grant Scope)
           </h3>
           <div className="space-y-6 relative z-10">
             
             {/* Step 1 */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-bold text-xs">
                   <CheckCircle className="w-4 h-4" />
                 </div>
                 <div className="h-full w-0.5 bg-slate-800 my-2"></div>
               </div>
               <div>
                 <h4 className="font-bold text-white text-sm">Phase 1: AI Frontend (MVP)</h4>
                 <p className="text-xs text-slate-400 mt-1">
                   Interactive UI, Gemini Integration, Report Generation. <span className="text-emerald-400">Completed.</span>
                 </p>
               </div>
             </div>

             {/* Step 2 */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 flex items-center justify-center font-bold text-xs animate-pulse">
                   2
                 </div>
                 <div className="h-full w-0.5 bg-slate-800 my-2 border-l border-dashed border-slate-600"></div>
               </div>
               <div>
                 <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                   Phase 2: Decompilation Engine
                   <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[9px] rounded uppercase font-bold">Grant Needed</span>
                 </h4>
                 <p className="text-xs text-slate-400 mt-1">
                   Backend service to fetch raw BPF bytecode from RPC nodes and decompile it to readable Rust for AI analysis.
                 </p>
               </div>
             </div>

             {/* Step 3 */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 border border-slate-600 flex items-center justify-center font-bold text-xs">
                   3
                 </div>
               </div>
               <div>
                 <h4 className="font-bold text-slate-300 text-sm">Phase 3: Hybrid Consensus</h4>
                 <p className="text-xs text-slate-500 mt-1">
                   Integrating <code className="bg-slate-800 px-1 rounded">Soteria</code> static analysis to run alongside LLMs for 99.9% accuracy.
                 </p>
               </div>
             </div>

           </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Audit Reports</h3>
          <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
        </div>
        <div className="divide-y divide-slate-700/50">
           {reports.length === 0 ? (
             <div className="p-8 text-center text-slate-500 italic">
               No scans performed yet. Go to <span className="text-indigo-400 font-bold">Scanner</span> to analyze your first file.
             </div>
           ) : (
             reports.map(report => (
               <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${report.issuesFound > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {report.issuesFound > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-200">{report.fileName}</div>
                      <div className="text-xs text-slate-500">{report.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <div className="text-[10px] text-slate-500 uppercase">Issues</div>
                       <div className="font-bold text-sm text-white">{report.issuesFound}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] text-slate-500 uppercase">Score</div>
                       <div className={`font-bold text-sm ${getRiskColor(report.riskScore)}`}>{report.riskScore}</div>
                    </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
      
    </div>
  );
};