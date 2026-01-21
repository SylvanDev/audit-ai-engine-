
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Analyzer } from './components/Analyzer';
import { ReportManager } from './components/ReportManager';
import { LandingPage } from './components/LandingPage';
import { LayoutDashboard, FileSearch, ShieldCheck, Activity, LogOut, Wallet, UserCircle, LogIn, BadgeCheck, X, Copy, ExternalLink, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
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
  
  // Monetization State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [txHashInput, setTxHashInput] = useState('');
  
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

  const handleVerifyPayment = () => {
    if (!txHashInput) return;
    setPaymentStep('verifying');
    // Simulate API call to Solana RPC
    setTimeout(() => {
      setPaymentStep('success');
    }, 2500);
  };

  const resetPaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentStep('idle');
    setTxHashInput('');
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

        <div className="px-4 pb-2">
           <button
             onClick={() => setIsPaymentModalOpen(true)}
             className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-3 rounded-lg shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 font-bold transition-all transform hover:scale-[1.02] text-sm group"
           >
             <BadgeCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             Get Certified <span className="opacity-75 font-normal text-xs">(0.5 SOL)</span>
           </button>
        </div>

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

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <button onClick={resetPaymentModal} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            {paymentStep === 'idle' && (
              <div className="p-8 text-center animate-in slide-in-from-left duration-300">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <BadgeCheck className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Get Verified</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Send <span className="text-white font-bold">0.5 SOL</span> to receive your on-chain audit certificate and trust badge.
                </p>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6 text-left relative group">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-2 tracking-wider">Treasury Address:</label>
                  <div className="flex items-center gap-2 bg-slate-900 p-3 rounded border border-slate-700/50 group-hover:border-amber-500/30 transition-colors">
                    <code className="text-xs font-mono text-emerald-400 truncate flex-grow">
                      TalosSec...AuditWallet
                    </code>
                    <button className="text-slate-400 hover:text-white" title="Copy Address">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Paste Transaction Hash..." 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    value={txHashInput}
                    onChange={(e) => setTxHashInput(e.target.value)}
                  />
                  <button 
                    onClick={handleVerifyPayment}
                    disabled={!txHashInput}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02]"
                  >
                    Verify Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'verifying' && (
              <div className="p-12 text-center animate-in zoom-in duration-300 flex flex-col items-center justify-center h-[400px]">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                  <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verifying Transaction</h3>
                <p className="text-slate-400 text-sm font-mono">Confirming block finality...</p>
                <div className="mt-8 w-full max-w-[200px] h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 animate-[progressBar_2s_ease-in-out]"></div>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-8 text-center animate-in slide-in-from-right duration-300">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Payment Confirmed!</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Your project has been certified. You can now access the badge in the Compliance Center.
                </p>
                
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                   <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Badge Preview</div>
                   <div className="flex items-center gap-2 justify-center bg-black/40 p-3 rounded border border-emerald-500/30">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="font-bold text-emerald-400 text-sm">Talos Verified</span>
                   </div>
                </div>

                <button 
                  onClick={resetPaymentModal}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all"
                >
                  Close & Download Assets
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
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
