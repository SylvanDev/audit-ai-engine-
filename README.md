# Talos Security Infrastructure

**Autonomous Security for Solana Smart Contracts**

Talos is a specialized autonomous infrastructure designed to secure Anchor-based Solana programs. Unlike standard linters, Talos leverages Multi-Agent Consensus (powered by Gemini 3.0 Pro, GPT-4o, and Claude 3.5 Sonnet strategies) to understand the *intent* of the code and flag complex logic errors.

![Talos Security](https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2670&auto=format&fit=crop)

## Capabilities

*   **Logic Analysis:** Detects missing ownership checks and unauthorized fund transfers.
*   **Rug Pull Detection:** Instantly identifies unrevoked mint authorities or freeze capabilities in SPL tokens (Pump.fun/Raydium).
*   **Consensus Engine:** Reduces false positives by cross-referencing findings across multiple diverse LLM system prompts.

## Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI Inference:** Google Gemini 3.0 Pro (via `@google/genai` SDK)
*   **Build System:** Vite

## Deployment

Project name for Vercel: `talos-security-engine`

```bash
git clone <repo-url>
npm install
npm run dev
```

## Roadmap

*   **Phase 1:** Frontend MVP & Gemini 3.0 Integration (Complete)
*   **Phase 2:** Rust Bytecode Decompiler & CFG Analysis
*   **Phase 3:** Real-time Mainnet Transaction Monitoring
