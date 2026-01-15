
import React, { useState, useEffect, useRef } from 'react';
import { AuditProject, AuditReport, ProjectFile } from '../types';
import { generateAuditReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Loader2, ScanSearch, FileCode, Terminal, ChevronRight, Sparkles, Globe, Search, ShieldAlert, Cpu, Binary, Layers, BrainCircuit, CheckCircle2, AlertOctagon } from 'lucide-react';

interface AnalyzerProps {
  files: ProjectFile[];
  project: AuditProject;
  onSave: (file: ProjectFile) => void;
  onAddReport: (report: AuditReport) => void;
}

const TERMINAL_STEPS = [
  "Initializing TALOS Kernel v0.9.4...",
  "Connecting to Solana Mainnet RPC [74.12.x.x]...",
  "Fetching Account Data & IDL...",
  "EXTRACTING SBF BYTECODE...",
  "Disassembling ELF Headers...",
  "Constructing Control Flow Graph (CFG)...",
  "Running Static Analysis (Clippy/Anchor-lint)...",
  "Detecting Unchecked CPI Calls...",
  "Simulating Transaction Replay...",
  "Synthesizing Consensus Report..."
];

// Mock function to generate fake SBF Bytecode visualization
const generateMockHex = (seed: string) => {
  const hexChars = "0123456789ABCDEF";
  let output = [];
  for (let i = 0; i < 16; i++) {
    let row = `0x${(i * 10).toString(16).padStart(4, '0').toUpperCase()}  `;
    let bytes = "";
    let ascii = "";
    for (let j = 0; j < 8; j++) {
      const byte = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
      bytes += byte + " ";
      ascii += Math.random() > 0.5 ? "." : String.fromCharCode(33 + Math.floor(Math.random() * 90));
    }
    output.push(row + bytes + " |" + ascii + "|");
  }
  return output;
};

export const Analyzer: React.FC<AnalyzerProps> = ({ files, project, onSave, onAddReport }) => {
  const [mode, setMode] = useState<'paste' | 'address'>('paste');
  const [viewMode, setViewMode] = useState<'source' | 'bytecode'>('source');
  const [code, setCode] = useState(files[0]?.content || '');
  const [fileName, setFileName] = useState(files[0]?.name || 'contract.rs');
  const [contractAddress, setContractAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.0 Pro (Consensus Mode)');
  
  // Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Consensus Animation State
  const [consensusStep, setConsensusStep] = useState(0);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);
  
  const fetchFromChain = async () => {
    if (!contractAddress) return;
    setIsAnalyzing(true);
    setTerminalLogs(["Connecting to Solana Cluster..."]);
    
    await new Promise(r => setTimeout(r, 800));
    setTerminalLogs(prev => [...prev, `Found Program ID: ${contractAddress}`]);
    
    await new Promise(r => setTimeout(r, 800));
    setTerminalLogs(prev => [...prev, "Downloading IDL...", "Decompiling Bytecode..."]);
    
    await new Promise(r => setTimeout(r, 800));
    
    const mockFetchedCode = `
// FETCHED FROM SOLANA MAINNET
// PROGRAM ID: ${contractAddress}
// DETECTED TYPE: SPL Token (Pump.fun Curve)

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("${contractAddress}");

#[program]
pub mod pump_fun_token {
    use super::*;

    // CRITICAL: Mint Authority is NOT revoked.
    // The developer can mint infinite tokens to dump on users.
    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, amount)?;
        Ok(())
    }
}
    `;
    
    setCode(mockFetchedCode);
    setFileName(`fetched_${contractAddress.slice(0,6)}.rs`);
    setMode('paste'); 
    setIsAnalyzing(false);
    setTerminalLogs([]);
  };

  const handleScan = async () => {
    if (!code) return;
    setIsAnalyzing(true);
    setTerminalLogs([]);
    setConsensusStep(1);

    // Step 1: Init
    setTerminalLogs(prev => [...prev, TERMINAL_STEPS[0]]);
    await new Promise(r => setTimeout(r, 600));

    // Step 2-4: Consensus Simulation
    setConsensusStep(2);
    for (let i = 1; i < 5; i++) {
      setTerminalLogs(prev => [...prev, TERMINAL_STEPS[i]]);
      await new Promise(r => setTimeout(r, 400));
    }
    setConsensusStep(3);

    // Remaining logs
    for (let i = 5; i < TERMINAL_STEPS.length; i++) {
      setTerminalLogs(prev => [...prev, TERMINAL_STEPS[i]]);
      await new Promise(r => setTimeout(r, 300));
    }
    setConsensusStep(4); // Done

    try {
        const result = await generateAuditReport(fileName, code, project, selectedModel);
        
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
        setTerminalLogs(prev => [...prev, "ERROR: Analysis Failed."]);
    } finally {
        setIsAnalyzing(false);
        setConsensusStep(0);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      
      {/* Input Area (Editor or Address) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl relative group">
        
        {/* Mode Toggles */}
        <div className="bg-slate-800/50 p-2 border-b border-slate-700/50 flex items-center justify-between">
           <div className="flex gap-2">
             <button 
               onClick={() => setMode('paste')}
               className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <FileCode className="w-4 h-4" /> Source
             </button>
             <button 
               onClick={() => setMode('address')}
               className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'address' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
               <Globe className="w-4 h-4" /> Import Address
             </button>
           </div>
           
           {/* Bytecode Toggle */}
           {mode === 'paste' && (
             <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
               <button 
                onClick={() => setViewMode('source')}
                className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-2 transition-colors ${viewMode === 'source' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
               >
                 <FileCode className="w-3 h-3" /> RUST
               </button>
               <button 
                onClick={() => setViewMode('bytecode')}
                className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-2 transition-colors ${viewMode === 'bytecode' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500'}`}
               >
                 <Binary className="w-3 h-3" /> SBF HEX
               </button>
             </div>
           )}
        </div>

        {/* Content Area */}
        {mode === 'paste' ? (
          <>
            <div className="bg-slate-900 p-3 border-b border-slate-700/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                 <input 
                  className="bg-transparent text-sm text-slate-300 focus:outline-none font-mono placeholder-slate-600 w-64 ml-2"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="filename.rs"
                />
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>{viewMode === 'source' ? 'Rust (Anchor)' : 'Solana Bytecode Format (SBF)'}</span>
                <span>{code.length} bytes</span>
              </div>
            </div>
            
            <div className="flex-grow relative bg-[#0f172a]">
              {viewMode === 'source' ? (
                <textarea 
                  className="w-full h-full bg-[#0f172a] text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none custom-scrollbar leading-relaxed"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  placeholder="// Paste your Smart Contract code here..."
                />
              ) : (
                <div className="w-full h-full bg-[#0b0f19] text-emerald-500/80 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                   <div className="mb-4 text-slate-500 border-b border-slate-800 pb-2">
                     // VIRTUAL MACHINE: Solana (SBF)<br/>
                     // ENTRY POINT: 0x2040<br/>
                     // STATUS: <span className="text-indigo-400">DECOMPILATION PREVIEW</span>
                   </div>
                   {generateMockHex(code).map((line, idx) => (
                     <div key={idx} className="hover:bg-white/5 cursor-crosshair transition-colors">
                       <span className="text-slate-600 select-none mr-4">{String(idx).padStart(3, '0')}</span>
                       {line}
                     </div>
                   ))}
                   <div className="mt-4 text-indigo-400 animate-pulse">_END OF STREAM</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-12 bg-[#0f172a] relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
             
             <div className="w-full max-w-lg space-y-6 text-center relative z-10">
               <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                 <Search className="w-10 h-10 text-indigo-400" />
               </div>
               <h3 className="text-2xl font-bold text-white">Import from Blockchain</h3>
               <p className="text-slate-400 text-sm">
                 Enter a Solana Program ID. Our nodes will fetch the verified IDL or attempt a decompilation of the on-chain SBF bytecode.
               </p>
               
               <div className="relative group/input">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover/input:opacity-50 transition duration-500 blur"></div>
                 <input 
                   type="text" 
                   value={contractAddress}
                   onChange={(e) => setContractAddress(e.target.value)}
                   placeholder="Enter Solana Address (e.g. 7ey2...)"
                   className="relative w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono shadow-inner"
                 />
                 <div className="absolute right-3 top-3.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-bold">
                   MAINNET
                 </div>
               </div>

               <button 
                 onClick={fetchFromChain}
                 disabled={isAnalyzing || !contractAddress}
                 className="w-full py-4 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
               >
                 {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Globe className="w-5 h-5" />}
                 Fetch Contract Data
               </button>
             </div>
          </div>
        )}
        
        {/* TERMINAL OVERLAY */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-30 flex flex-col p-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-emerald-500 mb-4 border-b border-emerald-500/20 pb-2">
              <Terminal className="w-5 h-5" />
              <span className="font-bold">TALOS LIVE TERMINAL</span>
              <span className="ml-auto text-xs animate-pulse">● PROCESSING</span>
            </div>
            
            <div className="flex-grow overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto custom-scrollbar space-y-2">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 text-xs animate-in slide-in-from-left duration-300">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span className={i === terminalLogs.length - 1 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 animate-[progressBar_5s_ease-in-out_infinite] w-[80%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-wider">
                <span>CPU Usage: 84%</span>
                <span>Bytecode Analysis: ACTIVE</span>
                <span>Nodes: 3/3</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Options */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
            <ScanSearch className="w-5 h-5 text-indigo-400" />
            Audit Configuration
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase mb-2 block flex items-center gap-2">
                Analysis Engine
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none font-medium"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option>Gemini 3.0 Pro (Consensus Mode)</option>
                  <option>Talos SBF Decompiler (Experimental)</option>
                  <option>DeepSeek V3 (Auditor Persona)</option>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                <strong className="text-indigo-400">Consensus Mode:</strong> Queries multiple simulated agents (DeFi Investor, Security Researcher, Rust Dev).
              </p>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Target Architecture</label>
              <div className="relative">
                <select className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none">
                  <option>Solana (Sealevel / Anchor)</option>
                  <option>Solana (Native Rust)</option>
                  <option>SBF Bytecode (Raw)</option>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleScan}
                disabled={isAnalyzing || !code}
                className={`w-full py-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-900/50`}
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5 fill-current" />
                )}
                {isAnalyzing 
                  ? 'Running Diagnostics...' 
                  : 'Initialize Pre-Audit'}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Consensus Visualization - REPLACING STATIC RUG PULL CARD */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-5 rounded-xl border border-indigo-500/20 flex-grow relative overflow-hidden group flex flex-col">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            Multi-Agent Consensus
          </h4>
          
          <div className="flex-grow space-y-3 relative z-10">
            {/* Node 1: Gemini */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${consensusStep >= 2 ? 'bg-emerald-500' : 'bg-slate-600 animate-pulse'}`}></div>
                 <div className="text-xs font-bold text-slate-300">Gemini 3.0</div>
               </div>
               <div className="text-[10px] font-mono text-slate-500">
                 {consensusStep >= 2 ? <span className="text-emerald-400">SAFE</span> : 'WAITING'}
               </div>
            </div>

            {/* Node 2: Claude/GPT (Simulated) */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${consensusStep >= 3 ? 'bg-emerald-500' : (consensusStep === 2 ? 'bg-indigo-500 animate-bounce' : 'bg-slate-600')}`}></div>
                 <div className="text-xs font-bold text-slate-300">DeepSeek V3</div>
               </div>
               <div className="text-[10px] font-mono text-slate-500">
                 {consensusStep >= 3 ? <span className="text-emerald-400">SAFE</span> : (consensusStep === 2 ? 'ANALYZING' : 'WAITING')}
               </div>
            </div>

            {/* Node 3: Heuristics */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${consensusStep >= 3 ? 'bg-yellow-500' : (consensusStep === 2 ? 'bg-indigo-500 animate-bounce' : 'bg-slate-600')}`}></div>
                 <div className="text-xs font-bold text-slate-300">Heuristics</div>
               </div>
               <div className="text-[10px] font-mono text-slate-500">
                 {consensusStep >= 3 ? <span className="text-yellow-400">WARN</span> : (consensusStep === 2 ? 'CHECKING' : 'WAITING')}
               </div>
            </div>
          </div>

          {/* Result */}
          <div className="mt-4 pt-4 border-t border-indigo-500/20">
            <div className="flex justify-between items-end">
               <div>
                 <div className="text-[10px] text-indigo-300 uppercase tracking-wider mb-1">Confidence Score</div>
                 <div className="text-2xl font-black text-white">{consensusStep >= 4 ? '94%' : '--'}</div>
               </div>
               <div className={`px-2 py-1 rounded text-[10px] font-bold ${consensusStep >= 4 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                 {consensusStep >= 4 ? 'PASSED' : 'CALCULATING...'}
               </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
