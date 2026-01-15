
import React from 'react';
import { ShieldCheck, Wallet, ArrowRight, Ghost, Lock, Cpu, Zap, Search, Binary } from 'lucide-react';

interface LandingPageProps {
  onConnect: () => void;
  onGuestEnter: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnect, onGuestEnter, isConnecting, error }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Professional Background: Top Spotlight + Subtle Grid */}
      <div className="absolute inset-0 w-full h-full bg-slate-950">
        <div className="absolute top-0 z-[0] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-[1]"></div>
      </div>
      
      {/* Navbar */}
      <header className="px-8 py-6 flex justify-between items-center relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">TALOS<span className="text-indigo-400">.AI</span></span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Institutional</span>
          <span className="hover:text-white cursor-pointer transition-colors">Developers</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10 mt-[-40px]">
        
        <div className="mb-8 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Zap className="w-3 h-3" />
          Automated Due Diligence Infrastructure
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100 drop-shadow-xl">
          Security Consensus for <br/>
          <span className="text-indigo-500 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">Solana Bytecode</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
          Standard auditors take weeks. Talos uses <span className="text-white font-bold">Multi-Agent Consensus</span> and static analysis to instantly detect rug-pull vectors and logic flaws in Anchor programs.
        </p>

        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300 w-full max-w-md">
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="group relative px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Initializing Talos Link...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <button 
            onClick={onGuestEnter}
            className="group flex items-center justify-center gap-2 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-all w-full border border-transparent hover:border-white/10"
          >
            <Ghost className="w-4 h-4" />
            Enter Sandbox Mode
          </button>

          {error && <div className="text-red-400 text-sm font-mono mt-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
          
        </div>

        <div className="flex items-center gap-8 mt-16 text-xs text-slate-500 font-mono border-t border-slate-800/50 pt-8 w-full max-w-3xl justify-center">
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                 <Search className="w-4 h-4 text-emerald-500" />
               </div>
               <span>Risk Scoring</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                 <Binary className="w-4 h-4 text-indigo-500" />
               </div>
               <span>SBF Analysis</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-purple-500/10 rounded-lg">
                 <Cpu className="w-4 h-4 text-purple-500" />
               </div>
               <span>AI Consensus Engine</span>
             </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-700 text-xs relative z-10">
        Talos Security Infrastructure • Enterprise Grade
      </footer>
    </div>
  );
};
