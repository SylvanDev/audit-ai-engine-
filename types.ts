
export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export interface ScopeItem {
  domain: string;
  type: string;
  assetValue: Severity;
  description: string;
}

export interface VulnerabilityReport {
  title: string;
  severity: Severity;
  description: string;
  remediation: string;
  codeSnippet?: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  file: string;
  status: 'scanning' | 'vulnerable' | 'clean' | 'suspicious';
  message: string;
}

export enum AnalysisType {
  SMART_CONTRACT = 'Solana Smart Contract (Rust/Anchor)',
  WEB_API = 'Web API / Backend (Python/Node)',
  WORKFLOW_ENGINE = 'Workflow / Compute Engine',
  FRONTEND = 'Frontend / Client Logic',
  SOLIDITY = 'EVM Smart Contract (Solidity)',
  GENERIC = 'Generic Code Audit'
}

export interface AuditReport {
  id: string;
  fileName: string;
  projectName: string;
  timestamp: string;
  riskScore: number; // 0-100
  issuesFound: number;
  summary: string;
  fullReportMarkdown: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

export interface AuditProject {
  name: string;
  description: string;
  stack: string; // e.g., "Solana, React"
  lastAuditDate: string;
  riskScore: number;
}
