# 🛡️ AuditAI - Autonomous Solana Security Infrastructure

> **Submission for Solana Renaissance Hackathon / AlxBlock Grant**

AuditAI is a decentralized security infrastructure designed to protect the Solana ecosystem from logic exploits, rug-pulls, and sophisticated attack vectors that standard static analysis tools miss.

![Dashboard Preview](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop)

## 🚨 The Problem

Traditional smart contract auditors and linters (like Clippy or Soteria) are excellent at catching syntax errors but fail to understand **Business Logic**. 
*   *Is it valid for the Admin to burn user tokens?* (Technically yes, logically no).
*   *Is the Freeze Authority acceptable in this DeFi context?*

## 🧠 The Solution: Multi-Agent Consensus

AuditAI employs a "Council of Agents" approach. Instead of relying on a single check, we orchestrate multiple LLM engines (Gemini 1.5 Pro, and planned integrations for others) to simulate a team of human auditors.

### Key Features

*   **Guest Mode Scanner:** Instantly scan public code or paste snippets without connecting a wallet.
*   **On-Chain Fetch (Live):** Pulls Program ID data directly from Solana Mainnet (detects Pump.fun curves, SPL Token metadata).
*   **Risk Scoring:** 0-100 deterministic score based on weighted vulnerability detection.
*   **Wallet Integration:** Connect Phantom/Solflare to save reports and mint "Audit Certificates" (Devnet).

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite, TailwindCSS
*   **AI Inference:** Google Gemini 1.5 Pro (via Google GenAI SDK)
*   **Blockchain:** Solana Web3.js, Wallet Adapter
*   **Visualization:** Lucide React

## 🚀 Getting Started

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/audit-ai-solana.git
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Set Environment Variables**
    Create a `.env` file:
    ```env
    VITE_API_KEY=your_google_gemini_key
    ```
4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 🗺️ Roadmap for Grant Funding

We are requesting funding to build the **Backend Decompilation Layer**:
1.  **Phase 1 (Complete):** AI Consensus Frontend & Basic Scanning.
2.  **Phase 2 (Grant Scope):** Rust Service to decompile BPF Bytecode from on-chain programs, allowing audits of *unverified* contracts.
3.  **Phase 3:** Autonomous "Defense Bots" that monitor mempools for exploits in real-time.

---

*Built with ❤️ for the Solana Community.*
