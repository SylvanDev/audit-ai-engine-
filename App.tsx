
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Analyzer } from './components/Analyzer';
import { ReportManager } from './components/ReportManager';
import { LandingPage } from './components/LandingPage';
import { LayoutDashboard, FileSearch, ShieldCheck, Activity, LogOut, Wallet, UserCircle, LogIn } from 'lucide-react';
import { ProjectFile, AuditProject, AuditReport } from './types';

enum Tab {
  DASHBOARD = 'dashboard',
  SCANNER = 'scanner',
  REPORTS = 'reports',
}

const INITIAL_FILES: ProjectFile[] = [
  {
    name: 'lib.rs',
    language: 'rust',
    content: `use anchor_lang::prelude::*;\n\ndeclare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");\n\n#[program]\npub mod insecure_contract {\n    use super::*;\n\n    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {\n        // CRITICAL: Missing owner check!\n        let user = &mut ctx.accounts.user;\n        user.balance -= amount;\n        Ok(())\n    }\n}`
  }
];

const INITIAL_PROJECT: AuditProject = {
  name: "My Solana Project",
  description: "DeFi Protocol on Solana Mainnet",
  stack: "Rust (Anchor), React, TypeScript",
  lastAuditDate: "Never",
  riskScore: 0
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isGuest, setIsGuest] = useState(false);
  
  // Wallet Connection State
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [project, setProject] = useState<AuditProject>(INITIAL_PROJECT);
  const [reports, setReports] = useState<AuditReport[]>([]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectError(null);

    // Attempt to connect to real Solana wallet (Phantom/Solflare)
    try {
      // @ts-ignore - window.solana is injected by Phantom
      const { solana } = window;

      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        const pubKey = response.publicKey.toString();
        // Artificial delay for effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        handleLoginSuccess(pubKey);
      } else {
        // Fallback for Demo/Development
        await new Promise(resolve => setTimeout(resolve, 1500));
        handleLoginSuccess("7Xw...AuditDAO"); 
      }
    } catch (err) {
      console.error(err);
      setConnectError("Connection rejected. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleLoginSuccess = (address: string) => {
    setWalletAddress(address);
    setIsAuthenticated(true);
    setIsGuest(false);
    setIsConnecting(false);
  };

  const handleGuestEntry = () => {
    setIsAuthenticated(true);
    setIsGuest(true);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
    setWalletAddress('');
    setIsGuest(false);
    setActiveTab(Tab.DASHBOARD);
  };

  const handleAddReport = (report: AuditReport) => {
    setReports(prev => [report, ...prev]);
    setProject(prev => ({
      ...prev,
      riskScore: report.riskScore,
      lastAuditDate: new Date().toLocaleDateString()
    }));
    setActiveTab(Tab.REPORTS); 
  };

  const handleSaveFile = (file: ProjectFile) => {
    if (!files.find(f => f.name === file.name)) {
      setFiles(prev => [...prev, file]);
    } else {
      setFiles(prev => prev.map(f => f.name === file.name ? file : f));
    }
  };

  if (!isAuthenticated) {
    return (
      <LandingPage 
        onConnect={connectWallet} 
        onGuestEnter={handleGuestEntry}
        isConnecting={isConnecting}
        error={connectError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                TALOS<span className="text-indigo-400">.AI</span>
              </h1>
              <div className="text-[10px] text-slate-400 font-medium">Autonomous Security</div>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <NavButton 
            active={activeTab === Tab.DASHBOARD} 
            onClick={() => setActiveTab(Tab.DASHBOARD)}
            icon={<LayoutDashboard />}
            label="Mission Control"
          />
          <NavButton 
            active={activeTab === Tab.SCANNER} 
            onClick={() => setActiveTab(Tab.SCANNER)}
            icon={<FileSearch />}
            label="Code Scanner"
          />
          <NavButton 
            active={activeTab === Tab.REPORTS} 
            onClick={() => setActiveTab(Tab.REPORTS)}
            icon={<Activity />}
            label="Audit Certificates"
          />
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          {isGuest ? (
             // Guest Mode Footer
             <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700 border-dashed mb-2">
               <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                 <UserCircle className="w-3 h-3" /> Guest Mode
               </div>
               <button 
                 onClick={connectWallet}
                 disabled={isConnecting}
                 className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
               >
                 {isConnecting ? <span className="animate-spin">...</span> : <Wallet className="w-3 h-3" />}
                 Connect Wallet
               </button>
             </div>
          ) : (
             // Connected Mode Footer
             <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 mb-2">
               <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                 <Wallet className="w-3 h-3" /> Connected
               </div>
               <div className="font-mono text-xs text-emerald-400 font-bold truncate">
                 {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
               </div>
             </div>
          )}
          
          <button 
            onClick={handleDisconnect}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <LogOut className="w-3 h-3" /> {isGuest ? 'Exit Guest Mode' : 'Disconnect Wallet'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
        
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex justify-between items-center px-8 z-10">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === Tab.DASHBOARD && 'System Overview'}
            {activeTab === Tab.SCANNER && 'Vulnerability Analysis'}
            {activeTab === Tab.REPORTS && 'Compliance Center'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-sm text-slate-400 hidden md:block">Target Project: <span className="text-indigo-400 font-bold">{project.name}</span></div>
             {isGuest ? (
               <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                 Guest Access
               </div>
             ) : (
               <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                 {walletAddress.slice(0, 6)}...
               </div>
             )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-grow overflow-hidden p-6 relative z-10">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {activeTab === Tab.DASHBOARD && <Dashboard project={project} reports={reports} onUpdateProject={setProject} />}
            {activeTab === Tab.SCANNER && <Analyzer files={files} project={project} onSave={handleSaveFile} onAddReport={handleAddReport} />}
            {activeTab === Tab.REPORTS && <ReportManager reports={reports} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({
  active, onClick, icon, label
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default App;