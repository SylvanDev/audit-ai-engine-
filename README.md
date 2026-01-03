# Solana Security Audit Platform

**Autonomous Security Infrastructure for Smart Contracts**

A specialized tool designed to assist auditors and developers in identifying business logic vulnerabilities in Anchor-based programs using Multi-Agent Consensus.

![Preview](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop)

## Overview

Unlike standard linters, this infrastructure leverages LLM inference (Gemini 1.5 Pro) to understand the *intent* of the code, flagging logic errors such as:
*   Missing ownership checks.
*   Improper Authority validation.
*   Unrestricted minting/freezing capabilities.

## Architecture

1.  **Frontend:** React 19 / TypeScript (Vite).
2.  **Analysis Engine:** Google Gemini 1.5 Pro (via Google GenAI SDK).
3.  **On-Chain Data:** Solana Web3.js integration.

## Deployment

To run locally:

```bash
git clone <repo-url>
npm install
npm run dev
```

## Roadmap

*   **Phase 1:** Frontend MVP & AI Integration (Complete)
*   **Phase 2:** Rust Bytecode Decompiler
*   **Phase 3:** Real-time Transaction Monitoring
