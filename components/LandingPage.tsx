
import React, { useState } from 'react';
import { ShieldCheck, Wallet, ArrowRight, Terminal, Lock, Cpu, Ghost } from 'lucide-react';

interface LandingPageProps {
  onConnect: () => void;
  onGuestEnter: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnect, onGuestEnter, isConnecting, error }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b0764,transparent)] pointer-events-none opacity-40"></div>

      {/* Navbar */}
      <header className="px-8 py-6 flex justify-between items-center relative z-10 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">Audit<span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-white cursor-pointer transition-colors">Grant Proposal</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10">
        
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Solana Renaissance Hackathon Ready
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
          Secure your Solana Programs with <br/>
          <span className="text-indigo-500">Autonomous AI Agents</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
          The first decentralized audit infrastructure powered by Multi-Agent Consensus. 
          Scan for logic vulnerabilities and rug-pull vectors instantly.
        </p>

        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="group relative px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto justify-center"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Verifying On-Chain...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                Connect Wallet to Save Reports
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            
            {/* Shiny effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
          </button>
          
          <button 
            onClick={onGuestEnter}
            className="group flex items-center gap-2 px-6 py-3 bg-transparent text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl font-medium text-sm transition-all w-full md:w-auto justify-center"
          >
            <Ghost className="w-4 h-4" />
            Try Scanner (Guest Mode)
          </button>

          {error && <div className="text-red-400 text-sm font-mono mt-2">{error}</div>}
          
          <div className="flex items-center gap-6 mt-8 text-xs text-slate-500 font-mono">
             <div className="flex items-center gap-2">
               <Terminal className="w-4 h-4" />
               <span>v0.9.2 Alpha</span>
             </div>
             <div className="flex items-center gap-2">
               <Lock className="w-4 h-4" />
               <span>End-to-End Encrypted</span>
             </div>
             <div className="flex items-center gap-2">
               <Cpu className="w-4 h-4" />
               <span>Gemini Powered</span>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-xs border-t border-white/5 relative z-10">
        Built for the AlxBlock Community.
      </footer>
    </div>
  );
};
