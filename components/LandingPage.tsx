
import React from 'react';
import { ShieldCheck, Wallet, ArrowRight, Ghost, Lock, Cpu } from 'lucide-react';

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
      
      {/* Navbar */}
      <header className="px-8 py-6 flex justify-between items-center relative z-10 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">TALOS<span className="text-indigo-400">.AI</span></span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Infrastructure</span>
          <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10">
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
          Autonomous Security for <br/>
          <span className="text-indigo-500">Solana Protocols</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
          The <strong>TALOS</strong> Infrastructure leverages Multi-Agent Consensus to secure Anchor smart contracts against logic errors and rug pulls.
        </p>

        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="group relative px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full md:w-auto justify-center"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Initializing Talos Link...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect Wallet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <button 
            onClick={onGuestEnter}
            className="group flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-all w-full md:w-auto justify-center"
          >
            <Ghost className="w-4 h-4" />
            Access Demo Environment
          </button>

          {error && <div className="text-red-400 text-sm font-mono mt-2">{error}</div>}
          
          <div className="flex items-center gap-6 mt-12 text-xs text-slate-600 font-mono border-t border-slate-800 pt-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <span>Mainnet Compatible</span>
             </div>
             <div className="flex items-center gap-2">
               <Lock className="w-3 h-3" />
               <span>Enterprise Grade</span>
             </div>
             <div className="flex items-center gap-2">
               <Cpu className="w-3 h-3" />
               <span>Gemini 3.0 Pro Inference</span>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-700 text-xs relative z-10">
        Talos Security Platform v0.9.2 (Internal Beta)
      </footer>
    </div>
  );
};