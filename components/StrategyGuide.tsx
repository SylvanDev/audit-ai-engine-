import React from 'react';
import { Target, Zap, Lock, Code, Server, Flame, FileJson, AlertTriangle, Terminal, Globe } from 'lucide-react';

export const StrategyGuide: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto custom-scrollbar p-1">
      
      {/* VULNERABILITY 1: IDOR */}
      <div className="bg-slate-900 border border-red-900/50 rounded-lg overflow-hidden">
        <div className="bg-red-950/20 p-4 border-b border-red-900/30 flex justify-between items-center">
          <h3 className="text-red-400 font-bold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            IDOR (Insecure Direct Object Reference)
          </h3>
          <span className="text-xs bg-red-900 text-red-100 px-2 py-1 rounded">High/Critical</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300">
            One of the most paid bugs on HackerOne. Look for API endpoints that take an ID but don't verify ownership.
          </p>
          
          <div className="bg-black rounded p-3 font-mono text-xs border border-slate-800">
            <div className="flex justify-between text-slate-500 mb-2">
              <span>TEST PATTERN</span>
              <Terminal className="w-3 h-3" />
            </div>
            <span className="text-blue-300">GET</span> /api/v1/users/<span className="text-red-400">1234</span>/receipts<br/>
            <span className="text-slate-500">// Change 1234 to another user's ID</span><br/>
            <span className="text-blue-300">GET</span> /api/v1/users/<span className="text-red-400">1235</span>/receipts<br/>
            <br/>
            <span className="text-green-400"># Tips:</span><br/>
            - Try replacing numeric IDs with GUIDs.<br/>
            - Try "HPP" (HTTP Parameter Pollution): ?id=1234&id=admin_id
          </div>
        </div>
      </div>

      {/* VULNERABILITY 2: Subdomain Takeover */}
      <div className="bg-slate-900 border border-yellow-900/50 rounded-lg overflow-hidden">
        <div className="bg-yellow-950/20 p-4 border-b border-yellow-900/30 flex justify-between items-center">
          <h3 className="text-yellow-400 font-bold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Subdomain Takeover
          </h3>
          <span className="text-xs bg-yellow-900 text-yellow-100 px-2 py-1 rounded">Medium/High</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300">
             Check for CNAME records pointing to unclaimed services (AWS S3, Heroku, GitHub Pages, etc).
          </p>
          <div className="bg-black rounded p-3 font-mono text-xs border border-slate-800">
             <span className="text-green-400"># Fingerprinting</span><br/>
             <span className="text-blue-300">dig</span> dev.target.com CNAME<br/>
             <span className="text-slate-400">>> dev.target.com. CNAME target-dev.herokuapp.com.</span><br/>
             <br/>
             <span className="text-slate-300">If `target-dev.herokuapp.com` shows "There's nothing here, yet.", register it immediately!</span>
          </div>
        </div>
      </div>

      {/* VULNERABILITY 3: XSS (Stored) */}
      <div className="bg-slate-900 border border-blue-900/50 rounded-lg overflow-hidden">
        <div className="bg-blue-950/20 p-4 border-b border-blue-900/30 flex justify-between items-center">
          <h3 className="text-blue-400 font-bold flex items-center gap-2">
            <Code className="w-5 h-5" />
            Stored XSS (Cross-Site Scripting)
          </h3>
          <span className="text-xs bg-blue-900 text-blue-100 px-2 py-1 rounded">Medium/High</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300">
            Inject payloads into profile fields, comments, or support tickets that admins view.
          </p>
          <div className="bg-black rounded p-3 font-mono text-xs border border-slate-800">
             <span className="text-green-400"># Polyglot Payload</span><br/>
             <span className="text-slate-300 break-all">
               javascript:/*--&gt;&lt;/title&gt;&lt;/style&gt;&lt;/textarea&gt;&lt;/script&gt;&lt;/xmp&gt;&lt;svg/onload='+/"/+/onmouseover=1/+/[*/[]/+alert(1)//'&gt;
             </span>
          </div>
           <p className="text-xs text-slate-500 mt-2">
             Always try to escalate XSS to Account Takeover (ATO) by stealing cookies or tokens.
           </p>
        </div>
      </div>

    </div>
  );
};