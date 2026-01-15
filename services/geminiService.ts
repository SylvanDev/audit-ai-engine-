
import { GoogleGenAI } from "@google/genai";
import { AnalysisType, Severity, AuditProject } from "../types";

export const analyzeCode = async (code: string, type: AnalysisType, context: string, fileName: string, project: AuditProject) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview";

  let systemPrompt = `You are Talos, a Tier-1 Smart Contract Auditor specialized in Solana (Rust/Anchor).`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `File Name: ${fileName}\nAnalysis Type: ${type}\nAdditional Context: ${context}\n\nCODE TO AUDIT:\n\`\`\`\n${code}\n\`\`\``,
      config: { systemInstruction: systemPrompt },
    });
    return response.text;
  } catch (error) {
    return "Audit service unavailable. Please check API connection.";
  }
};

export const generateAuditReport = async (fileName: string, code: string, project: AuditProject, modelLabel: string = "Gemini 3.0 Pro") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview";
  
  // This is the "Infrastructure" logic. 
  // We frame the AI not as a chatbot, but as a rigid analysis engine.
  const systemPrompt = `
  IDENTITY: You are TALOS (Autonomous Security Infrastructure), a specialized static analysis engine for Solana Smart Contracts written in Rust/Anchor.

  OBJECTIVE: Perform a rigorous, pessimistic security audit of the provided code. Your goal is to protect investors from scams, rug pulls, and incompetence.

  ANALYSIS VECTORS:
  1. **Privilege Escalation:** Can a user call instructions meant for the admin? (Missing \`#[account(signer)]\`, missing \`has_one\` checks).
  2. **Economic Exploits:** Infinite minting, arithmetic overflow (if no overflow checks), logic errors in token transfer amounts.
  3. **Rug Pull Indicators (CRITICAL):** 
     - Mint Authority not revoked on SPL tokens.
     - Freeze Authority enabled.
     - Hardcoded fees sending funds to a dev wallet.
     - Ability to pause transfers indefinitely.
  4. **Data Validation:** Missing checks on account constraints (e.g., ensuring a token account belongs to the correct mint).

  OUTPUT FORMAT:
  Return strictly valid JSON. Do not use Markdown code blocks. The JSON must match this schema:
  {
    "riskScore": number, // 0-100. Start at 100. Deduct 20 for Critical, 10 for High, 5 for Medium issues. If Rug Pull vector found, score MUST be < 40.
    "issuesFound": number, // Total count of issues
    "summary": "string", // A 1-sentence executive summary for an investor. E.g., "CRITICAL: Mint authority is not revoked, allowing the developer to dump tokens."
    "markdown": "string" // A formatted report using emojis and bold text. Structure:
                          // ## 🚨 Critical Findings
                          // - **Issue Name**: Description...
                          // ## ⚠️ Warnings
                          // - **Issue Name**: Description...
                          // ## ✅ Safe Patterns
                          // - Description...
  }

  TONE: Professional, paranoid, concise. No fluff.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `FILE: ${fileName}\n\nSOURCE CODE:\n${code}`,
      config: { 
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      },
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return {
      riskScore: 0,
      issuesFound: 1,
      summary: "Analysis Error: Could not connect to inference nodes.",
      markdown: "## System Error\nUnable to complete audit. Please check your API key or internet connection."
    };
  }
};
