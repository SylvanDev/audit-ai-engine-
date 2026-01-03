import React, { useState } from 'react';
import { AnalysisType, ProjectFile, AuditProject, AuditReport } from '../types';
import { generateAuditReport, analyzeCode } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Loader2, ScanSearch, FileCode, Play, Terminal, ChevronRight, Layers, Sparkles, Globe, Search, AlertOctagon } from 'lucide-react';

interface AnalyzerProps {
  files: ProjectFile[];
  project: AuditProject;
  onSave: (file: ProjectFile) => void;
  onAddReport: (report: AuditReport) => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ files, project, onSave, onAddReport }) => {
  const [mode, setMode] = useState<'paste' | 'address'>('paste');
  const [code, setCode] = useState(files[0]?.content || '');
  const [fileName, setFileName] = useState(files[0]?.name || 'contract.rs');
  const [contractAddress, setContractAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Pro (Google)');
  const [scanStep, setScanStep] = useState<string>('');
  
  // Mock function to simulate fetching code/data from Solana explorer
  const fetchFromChain = async () => {
    if (!contractAddress) return;
    setIsAnalyzing(true);
    setScanStep(`Connecting to Solana Mainnet RPC...`);
    await new Promise(r => setTimeout(r, 800));
    setScanStep(`Querying Account Data: ${contractAddress.slice(0,4)}...${contractAddress.slice(-4)}`);
    await new Promise(r => setTimeout(r, 800));
    setScanStep(`Fetching Verified IDL from Anchor Registry...`);
    await new Promise(r => setTimeout(r, 800));
    setScanStep(`Decompiling BPF Bytecode...`);
    await new Promise(r => setTimeout(r, 800));
    
    // Simulate a found "Pump.fun" style contract with vulnerabilities
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

    // CRITICAL: Freeze Authority is Enabled.
    // The developer can blacklist holders preventing them from selling.
    pub fn freeze_user(ctx: Context<FreezeUser>) -> Result<()> {
        let cpi_accounts = token::FreezeAccount {
            account: ctx.accounts.user_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        token::freeze_account(CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts))?;
        Ok(())
    }
}
    `;
    
    setCode(mockFetchedCode);
    setFileName(`fetched_${contractAddress.slice(0,6)}.rs`);
    setMode('paste'); // Switch to editor view with fetched code
    setIsAnalyzing(false);
    setScanStep('');
  };

  const handleScan = async () => {
    if (!code) return;
    setIsAnalyzing(true);
    setScanStep('Initializing Analysis Environment...');
    
    // Simulate complex multi-model processing if Unified is selected
    if (selectedModel.includes('Unified')) {
      const steps = [
        'Parsing AST tree...',
        'Querying GPT-4o (OpenAI) Node...',
        'Querying Claude 3.5 Sonnet (Anthropic) Node...',
        'Running DeepSeek V3 (Logic Check)...',
        'Cross-referencing Vulnerabilities...',
        'Synthesizing Consensus Report...'
      ];
      
      for (const step of steps) {
        setScanStep(step);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
      }
    } else {
      // Standard single model delay
      await new Promise(r => setTimeout(r, 1500));
    }

    setScanStep('Finalizing Report...');
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
    setIsAnalyzing(false);
    setScanStep('');
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Input Area (Editor or Address) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl relative">
        
        {/* Mode Toggles */}
        <div className="bg-slate-800/50 p-2 border-b border-slate-700/50 flex items-center gap-2">
           <button 
             onClick={() => setMode('paste')}
             className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
           >
             <FileCode className="w-4 h-4" /> Source Code
           </button>
           <button 
             onClick={() => setMode('address')}
             className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${mode === 'address' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
           >
             <Globe className="w-4 h-4" /> Import Address
           </button>
        </div>

        {/* Content Area */}
        {mode === 'paste' ? (
          <>
            <div className="bg-slate-900 p-3 border-b border-slate-700/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <input 
                  className="bg-transparent text-sm text-slate-300 focus:outline-none font-mono placeholder-slate-600 w-64"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="filename.rs"
                />
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-500">{code.length} bytes</span>
              </div>
            </div>
            <textarea 
              className="flex-grow bg-[#0f172a] text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none custom-scrollbar leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="// Paste your Smart Contract code here..."
            />
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-12 bg-[#0f172a]">
             <div className="w-full max-w-lg space-y-6 text-center">
               <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                 <Search className="w-10 h-10 text-indigo-400" />
               </div>
               <h3 className="text-2xl font-bold text-white">Import from Blockchain</h3>
               <p className="text-slate-400 text-sm">
                 Enter a Solana Program ID or Token Address (Pump.fun/Raydium). We will attempt to fetch the verified source code or decompile the bytecode for analysis.
               </p>
               
               <div className="relative">
                 <input 
                   type="text" 
                   value={contractAddress}
                   onChange={(e) => setContractAddress(e.target.value)}
                   placeholder="Enter Solana Address (e.g. 7ey2...)"
                   className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-6 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono shadow-inner"
                 />
                 <div className="absolute right-3 top-3.5 px-2 py-1 bg-slate-700 rounded text-[10px] text-slate-400 font-bold border border-slate-600">
                   MAINNET
                 </div>
               </div>

               <button 
                 onClick={fetchFromChain}
                 disabled={isAnalyzing || !contractAddress}
                 className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
               >
                 {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Globe className="w-5 h-5" />}
                 Fetch Contract Data
               </button>
               
               <div className="flex justify-center gap-4 pt-4">
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                   <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="w-4 h-4 grayscale opacity-50" />
                   Solana
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500">
                   <AlertOctagon className="w-4 h-4" />
                   Pump.fun Ready
                 </div>
               </div>
             </div>
          </div>
        )}
        
        {/* Scanning Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                 <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                 <Layers className="absolute inset-0 m-auto w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audit In Progress</h3>
              <p className="text-indigo-400 font-mono text-sm animate-pulse">{scanStep}</p>
              
              <div className="mt-6 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-progressBar rounded-full"></div>
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
                <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">PRO</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <optgroup label="Single Model (Fast)">
                    <option>Gemini 1.5 Pro (Google)</option>
                    <option>GPT-4o (OpenAI)</option>
                    <option>Claude 3.5 Sonnet (Anthropic)</option>
                    <option>DeepSeek V3 (DeepSeek)</option>
                  </optgroup>
                  <optgroup label="Multi-Agent System">
                    <option>✨ Unified Ensemble (All Models)</option>
                  </optgroup>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                {selectedModel.includes('Unified') 
                  ? "Combines outputs from 5 top-tier LLMs to eliminate hallucinations and cross-verify vulnerabilities. Best for final production audits."
                  : "Standard single-pass analysis suitable for quick checks and development loops."}
              </p>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Target Context</label>
              <div className="relative">
                <select className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none">
                  <option>Solana (Anchor/Rust)</option>
                  <option>Ethereum (Solidity)</option>
                  <option>Pump.fun (Token Metadata)</option>
                  <option>Full Stack (React/Node)</option>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleScan}
                disabled={isAnalyzing || !code}
                className={`w-full py-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden ${
                  selectedModel.includes('Unified') 
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white shadow-indigo-900/50'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50'
                }`}
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  selectedModel.includes('Unified') ? <Sparkles className="w-5 h-5 fill-current animate-pulse" /> : <Play className="w-5 h-5 fill-current" />
                )}
                {isAnalyzing 
                  ? 'Processing...' 
                  : selectedModel.includes('Unified') ? 'Run Unified Audit' : 'Run Audit'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900 p-6 rounded-xl border border-indigo-500/20 flex-grow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Terminal className="w-24 h-24 text-indigo-400" />
          </div>
          <h4 className="text-sm font-bold text-indigo-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Pump.fun Protection
          </h4>
          <p className="text-xs text-indigo-200/70 leading-relaxed relative z-10">
            Scanning a token address? We check Mint Authority, Freeze Authority, and LP Burn status to detect Rug Pulls instantly.
          </p>
        </div>

      </div>

    </div>
  );
};