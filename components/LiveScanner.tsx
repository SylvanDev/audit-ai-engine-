import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, CheckCircle, Loader2, AlertTriangle, FileCode, Lock } from 'lucide-react';
import { ScanLog } from '../types';

interface LiveScannerProps {
  campaignName: string;
}

const MOCK_LOGS = [
  { file: 'recon', msg: 'Enumerating subdomains via Subfinder/Amass...', status: 'scanning' },
  { file: 'recon', msg: 'Found 14 live subdomains.', status: 'clean' },
  { file: 'web', msg: 'Fingerprinting tech stack (Wappalyzer)...', status: 'scanning' },
  { file: 'web', msg: 'Detected: React, Node.js, Nginx, AWS.', status: 'clean' },
  { file: 'crawler', msg: 'Crawling JavaScript files for secrets...', status: 'scanning' },
  { file: 'js', msg: 'WARN: Found potential API Key pattern in main.bundle.js', status: 'suspicious' },
  { file: 'js', msg: 'Analyzing API Key entropy...', status: 'scanning' },
  { file: 'js', msg: 'False positive. Key is for Google Maps (Public).', status: 'clean' },
  { file: 'vuln', msg: 'Checking for Missing Security Headers...', status: 'scanning' },
  { file: 'vuln', msg: 'ALERT: CSP Header missing on login page.', status: 'suspicious' },
  { file: 'auth', msg: 'Testing for IDOR on /api/v1/user/profile...', status: 'scanning' },
  { file: 'auth', msg: 'Request with User B cookie succeeded!', status: 'vulnerable' },
  { file: 'report', msg: 'Automated scan finished. 1 High Severity issue found.', status: 'clean' },
];

export const LiveScanner: React.FC<LiveScannerProps> = ({ campaignName }) => {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const startScan = () => {
    setIsScanning(true);
    setLogs([]);
    let delay = 0;

    MOCK_LOGS.forEach((log, index) => {
      delay += Math.random() * 800 + 400; // Random delay for realism
      setTimeout(() => {
        setLogs(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          file: log.file,
          status: log.status as any,
          message: log.msg
        }]);
        
        if (index === MOCK_LOGS.length - 1) setIsScanning(false);
      }, delay);
    });
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'vulnerable': return 'text-red-400 font-bold';
      case 'suspicious': return 'text-yellow-400';
      case 'clean': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'vulnerable': return <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'suspicious': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'clean': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center shadow-lg shadow-emerald-900/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Active Recon Terminal
          </h3>
          <p className="text-xs text-slate-500">Scanning Scope: <span className="text-emerald-400 font-bold">{campaignName}</span></p>
        </div>
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all ${
            isScanning 
              ? 'bg-slate-800 text-slate-500 border border-slate-700' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
          }`}
        >
          {isScanning ? 'ENUMERATING...' : 'START RECON'}
        </button>
      </div>

      <div className="flex-grow bg-black rounded-lg border border-slate-800 p-4 overflow-hidden font-mono text-sm relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-20"></div>
        <div className="h-full overflow-y-auto custom-scrollbar space-y-2">
          {logs.length === 0 && !isScanning && (
             <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-2">
               <Terminal className="w-12 h-12 opacity-20" />
               <p>Target acquired. Ready to begin passive & active recon.</p>
             </div>
          )}
          
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start animate-fadeIn">
              <span className="text-slate-600 whitespace-nowrap">[{log.timestamp}]</span>
              <div className="mt-1">{getStatusIcon(log.status)}</div>
              <div className="flex flex-col">
                <span className={`uppercase text-xs font-bold mb-0.5 ${log.file === 'vulnerable' ? 'text-red-500' : 'text-slate-500'}`}>
                  {log.file}
                </span>
                <span className={`${getStatusColor(log.status)} break-all`}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};