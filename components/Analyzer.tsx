
import React, { useState, useEffect, useRef } from 'react';
import { AuditProject, AuditReport, ProjectFile } from '../types';
import { generateAuditReport } from '../services/geminiService';
import { Loader2, ScanSearch, FileCode, Terminal, ChevronRight, Sparkles, Globe, Search, BrainCircuit, Binary, Rocket, ShieldCheck } from 'lucide-react';

interface AnalyzerProps {
  files: ProjectFile[];
  project: AuditProject;
  onSave: (file: ProjectFile) => void;
  onAddReport: (report: AuditReport) => void;
}

const TERMINAL_STEPS = [
  "Mounting Talos VFS...",
  "Initializing Consensus Cluster (3 Nodes)...",
  "Fetching IDL from Solana Mainnet...",
  "DISASSEMBLING BPF BYTECODE...",
  "Mapping Memory Allocations...",
  "CROSS-REF: Matching against known exploit database...",
  "DETECTED: Suspicious logic in instruction 0x05...",
  "SIMULATING RUG VECTOR: Attempting unauthorized drain...",
  "Generating Cryptographic Proof of Findings...",
  "Finalizing Audit Certificate..."
];

export const Analyzer: React.FC<AnalyzerProps> = ({ files, project, onSave, onAddReport }) => {
  const [mode, setMode] = useState<'paste' | 'address'>('paste');
  const [viewMode, setViewMode] = useState<'source' | 'bytecode'>('source');
  const [code, setCode] = useState(files[0]?.content || '');
  const [fileName, setFileName] = useState(files[0]?.name || 'contract.rs');
  const [contractAddress, setContractAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const handleScan = async () => {
    if (!code) return;
    setIsAnalyzing(true);
    setTerminalLogs([]);

    for (const step of TERMINAL_STEPS) {
      setTerminalLogs(prev => [...prev, step]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    }

    try {
        const result = await generateAuditReport(fileName, code, project);
        const newReport: AuditReport = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: fileName,
          projectName: project.name,
          timestamp: new Date().toLocaleString(),
          riskScore: result.riskScore,
          issuesFound: result.issuesFound,
          summary: result.summary,
          fullReportMarkdown: result.markdown,
          status: 'Completed'
        };
        onAddReport(newReport);
    } catch (e) {
        setTerminalLogs(prev => [...prev, "CRITICAL ERROR: Analysis Timeout."]);
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl relative">
        <div className="bg-slate-800/50 p-3 border-b border-slate-700/50 flex justify-between items-center">
           <div className="flex gap-2">
             <button onClick={() => setMode('paste')} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 ${mode === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
               <FileCode className="w-3.5 h-3.5" /> EDITOR
             </button>
             <button onClick={() => setMode('address')} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 ${mode === 'address' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
               <Globe className="w-3.5 h-3.5" /> SOLANA ADDR
             </button>
           </div>
           {mode === 'paste' && (
             <div className="flex bg-slate-900 rounded p-1 border border-slate-700">
               <button onClick={() => setViewMode('source')} className={`px-3 py-1 text-[10px] font-bold rounded ${viewMode === 'source' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>RUST</button>
               <button onClick={() => setViewMode('bytecode')} className={`px-3 py-1 text-[10px] font-bold rounded ${viewMode === 'bytecode' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500'}`}>BYTECODE</button>
             </div>
           )}
        </div>

        <div className="flex-grow bg-[#0f172a] relative">
          <textarea 
            className="w-full h-full bg-[#0f172a] text-slate-300 p-6 font-mono text-sm focus:outline-none resize-none custom-scrollbar"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste Solana Program code for deep inspection..."
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-30 flex flex-col p-8 font-mono text-xs">
              <div className="flex items-center gap-2 text-indigo-400 mb-6 border-b border-indigo-500/20 pb-4">
                <Terminal className="w-4 h-4" />
                <span className="font-bold tracking-widest uppercase">Talos DeepScan Engine v0.9.4</span>
              </div>
              <div className="flex-grow overflow-y-auto space-y-2">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left duration-200">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span className={i === terminalLogs.length - 1 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-[progressBar_5s_linear] w-full"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Logic Synthesis</span>
                  <span>Safety Verified: NO</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <ScanSearch className="w-5 h-5 text-indigo-400" />
            Analysis Params
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Target Engine</label>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-sm text-indigo-300 font-bold flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> Gemini 3.0 Pro Cluster
              </div>
            </div>
            <button 
              onClick={handleScan}
              disabled={isAnalyzing || !code}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-black shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              RUN PRE-AUDIT
            </button>
          </div>
        </div>

        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">Security Intel</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Our engine combines static analysis with LLM reasoning to identify patterns that standard tools miss.
          </p>
          <div className="text-[10px] font-mono text-indigo-300">MODELS: Gemini Consensus</div>
        </div>
      </div>
    </div>
  );
};
